function drawDependencies(hosts, dependencies) {

    console.log('Called')


    var hostObj = {};

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
            children: [],
        };

    }

    for (i = 0; i < dependencies.results.length; i++) { //modifies host entries in hostObj[] for which dependency data exists

        [hostName, parentName] = (dependencies.results[i].name).split('!Parent'); //need to split due to names in dependencies.json being 'hostName!ParentparentName'

        hostObj[hostName].hasDependencies = true;
        hostObj[hostName].parent = parentName;
        hostObj[parentName].children.push(hostName); //push child name to parent host entry
        hostObj[parentName].hasDependencies = true;

    }

    console.log(hostObj);

    color_border = 'blue';

    color_background = 'white'

    var nodes = new vis.DataSet([]);

    var edges = new vis.DataSet([]);

    for (i = 0; i < Object.keys(hostObj).length; i++) {

        currHost = Object.keys(hostObj)[i];

        if(hostObj[currHost].hasDependencies)
        {

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
            color: {
                border: color_border,
                background: color_background
            },
            // event:

        })

        edges.update({
            from: currHost,
            to: hostObj[currHost].parent,
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
            hierarchical: {
                enabled: true,
                levelSeparation: 100,
                nodeSpacing: 200,
                treeSpacing: 100,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                direction: 'UD', // UD, DU, LR, RL
                sortMethod: 'hubsize' // hubsize, directed
            }
        },

        edges: {
            arrows: {
                to: {
                    enabled: false,
                    scaleFactor: 1,
                    type: 'arrow'
                },
                middle: {
                    enabled: true,
                    scaleFactor: 1,
                    type: 'arrow'
                },
                from: {
                    enabled: false,
                    scaleFactor: 1,
                    type: 'arrow'
                }
            }
        },

        nodes: {
            // color: '#ff0000',
            fixed: true,
            // font: '12px arial red',
            // scaling: {
            //     label: true
            // },
            // shadow: true,
            shape: 'box'
        }

    };



    var network = new vis.Network(container, data, options);

    network.on("doubleClick", function (params){
       
        if(params.nodes[0] != undefined){
        href = location.href.split('/');
        location.href = 'http://' + href[2] + '/icingaweb2/monitoring/list/hosts#!/icingaweb2/monitoring/host/show?host=' + params.nodes[0];
        }
    });
}
