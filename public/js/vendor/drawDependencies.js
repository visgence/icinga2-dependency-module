function drawDependencies(hosts, dependencies) {



    var hostObj = {};
    var groups = [];
    var selectedGroups = [];

    //  Passed objects are are ordered by Obj.results[i].attrs.hostName.var, would be easier to use Obj['hostName'].var
    //  Convert to Obj[hostName].var format while combining hosts and dependency objects using loops:

    for (i = 0; i < hosts.results.length; i++) { //Create 

        if (hosts.results[i].attrs.state === 0) { //if host is in a sate of 0 it is up, if '1' it is considered down, but can also be unreachable.
            hostStatus = 'UP';
        } else if (hosts.results[i].attrs.state === 1) {

            if (hosts.results[i].attrs.last_reachable === false) {
                hostStatus = 'UNREACHABLE';
            } else {
                hostStatus = 'DOWN';
            }
        }

        hostObj[hosts.results[i].name] = { //Use this loop to initialize values that will be changed if dependency data exists for host.
            status: hostStatus,
            parent: 'NONE',
            hasDependencies: false,
            group: hosts.results[i].attrs.groups[0],
            children: [],
        };

    }

    for (i = 0; i < dependencies.results.length; i++) { //modifies host entries in hostObj[] for which dependency data exists

        [hostName, parentName] = (dependencies.results[i].name).split('!Parent'); //need to split due to names in dependencies.json being 'hostName!ParentparentName'

        hostObj[hostName].hasDependencies = true;
        hostObj[hostName].parent = parentName;
        hostObj[parentName].children.push(hostName); //push child name to parent host entry
        hostObj[parentName].hasDependencies = true;

        if (groups.indexOf(hostObj[hostName].group) == -1) {
            groups.push(hostObj[hostName].group);
        }
    }


    $.each(
        groups,

        function (i, v) {
            $("#dependency-menu").append("<li>" + v + "</li>");
        }

    );

    $("#dependency-menu").prepend("<li class = \"selected\"> All</li>");

    selectedGroups = groups;


    $("#dependency-menu").on('click', 'li', function (params) {
        params.currentTarget.classList.toggle('selected')
        if (params.currentTarget.outerText === 'All') {

            if (selectedGroups === groups) {
                selectedGroups = [];
            } else {
                selectedGroups = groups;
            }

        } else if (selectedGroups.indexOf(params.currentTarget.outerText) == -1) {
            selectedGroups.push(params.currentTarget.outerText);
        } else {
            selectedGroups.splice(selectedGroups.indexOf(params.currentTarget.outerText), 1);
        }

        drawNetwork(hostObj, selectedGroups)
    });


    drawNetwork(hostObj, groups);

}

function drawNetwork(hostObj, group) {


    color_background = 'white'

    var nodes = new vis.DataSet([]);

    var edges = new vis.DataSet([]);


    for (i = 0; i < Object.keys(hostObj).length; i++) {

        currHost = Object.keys(hostObj)[i];

        if (hostObj[currHost].hasDependencies && group.includes(hostObj[currHost].group)) {

            if (hostObj[currHost].status === 'DOWN') {

                color_border = 'red';
            }

            if (hostObj[currHost].status === 'UNREACHABLE') {

                color_border = 'purple';

            }

            if (hostObj[currHost].status === 'UP') {

                color_border = 'green';

            }

            nodes.update({
                id: currHost,
                label: currHost,
                mass: (hostObj[currHost].children.length / 4) + 1,
                color: {
                    border: color_border,
                    background: color_background
                },
                // event:

            })

            edges.update({
                from: hostObj[currHost].parent,
                to: currHost
            })

        }

    }

    var data = {
        nodes: nodes,
        edges: edges
    };
    var container = document.getElementById('dependency-network');
    var options = {
        layout: {
            improvedLayout: true,
            randomSeed: 298956,
        },

        edges: {
            arrows: {
                middle: {
                    enabled: true,
                    scaleFactor: 1,
                    type: 'arrow'
                }
            },
        },

        physics: {
            // barnesHut: {
            //     springLength: 55,
            //     avoidOverlap: 0.16
            // },
            // solver: 'hierarchicalRepulsion',
            // stabilization: {
            //     enabled: true,
            //     iterations: 0
            // }
        },

            nodes: {
                // color: '#ff0000',
                fixed: false,
                // font: '12px arial red',
                scaling: {
                    label: true
                },
                // shadow: true,
                shape: 'dot'
            },


        };
        var network = new vis.Network(container, data, options);

        network.stabilize();

        network.on('afterDrawing', function(params){
            network.setOptions({nodes : {fixed: true}});
        });

        
        console.log(network.getSeed())

        network.on("doubleClick", function (params) {

            if (params.nodes[0] != undefined) {
                href = location.href.split('/');
                location.href = 'http://' + href[2] + '/icingaweb2/monitoring/list/hosts#!/icingaweb2/monitoring/host/show?host=' + params.nodes[0];
            }
        });
    }