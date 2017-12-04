function formatDependencies(hosts, dependencies, hierarchical, positionData, isFullscreen) {

    var hostObj = {};
    var positionObj = {};
    // console.log(isFullscreen);


    //  Passed objects are are ordered by Obj.results[i].attrs.hostName.var, would be easier to use Obj['hostName'].var
    //  Convert to Obj[hostName].var format while combining hosts and dependency objects:

    for (i = 0; i < dependencies.results.length; i++) { //build base hostObj out of dependencies, add state infromation later

        [hostName, parentName] = (dependencies.results[i].name).split('!Parent'); //need to split due to names in dependencies.json being 'hostName!ParentparentName'

        if (hostObj[hostName] === undefined) { //initialize host obj child entry if it does not exit
            hostObj[hostName] = {
                status: '',
                description: '',
                parents: [parentName],
                hasDependencies: true,
                group: '',
                children: [],
            }
        } else {
            hostObj[hostName].parents.push(parentName);
        }

        if (hostObj[parentName] === undefined) { //initialize host obj parent entry if it does not exit

            hostObj[parentName] = {
                status: '',
                description: '',
                parents: [],
                hasDependencies: true,
                group: '',
                children: [hostName],
            }
        } else {
            hostObj[parentName].children.push(hostName); //
        }

    }

    for (i = 0; i < hosts.results.length; i++) {

        if (hosts.results[i].attrs.state === 0) { //if host is in a sate of 0 it is up, if '1' it is considered down, but can also be unreachable.
            hostStatus = 'UP';
        } else if (hosts.results[i].attrs.state === 1) {

            if (hosts.results[i].attrs.last_reachable === false) {
                hostStatus = 'UNREACHABLE';
            } else {
                hostStatus = 'DOWN';
            }
        }

        if (hostObj[hosts.results[i].name] != undefined) { //insert into hostObj if dependencies exist
            hostObj[hosts.results[i].name].status = hostStatus;
            hostObj[hosts.results[i].name].group = hosts.results[i].attrs.groups[0];
            hostObj[hosts.results[i].name].description = hosts.results[i].attrs.display_name;
        }

        if (positionData != null && positionData[i] != undefined) { //build positionObj 
            positionObj[positionData[i].node_name] = {
                node_x: positionData[i].node_x,
                node_y: positionData[i].node_y
            }
        }
    }

    // if (Object.keys(positionObj).length != Object.keys(hostObj).length) { //if these are not the same, a host with dependencies has been removed/added
    //     positionObj = {}; //reset signals new network generation
    // }

    // positionObj = {};

    drawNetwork(hostObj, hierarchical, positionObj, isFullscreen);

}

function drawNetwork(hostObj, hierarchical, positionObj, isFullscreen) {

    var redraw = true;

    var newHost = false;

    color_background = 'white'

    var nodes = new vis.DataSet([]);

    var edges = new vis.DataSet([]);

    for (i = 0; i < Object.keys(hostObj).length; i++) {

        currHost = Object.keys(hostObj)[i];

        // console.log(currHost);

        if (hostObj[currHost].hasDependencies) {

            if (hostObj[currHost].status === 'DOWN') {
                color_border = 'red';
                text_size = 25;
            }

            if (hostObj[currHost].status === 'UNREACHABLE') {
                color_border = 'purple';
                text_size = 20;
            }

            if (hostObj[currHost].status === 'UP') {
                color_border = 'green';
                text_size = 0;
            }
            if((hostObj[currHost].children.length) > 3)
                text_size = 15;

            if (!positionObj[currHost]) { //if the name of the host does not exist in data base, it is a new host.
                if (Object.keys(positionObj).length > 0)
                    newHost = true;
                nodes.update({
                    id: currHost,
                    label: (hostObj[currHost].description + "\n(" + currHost + ")"),
                    mass: (hostObj[currHost].children.length / 4) + 1,
                    color: {
                        border: color_border,
                        background: color_background
                    },

                    font: {
                        size: text_size
                    },

                    size: (hostObj[currHost].children.length * 3) + 20, //generate new x/y coordinates on network generation
                })
            } else {
                nodes.update({
                    id: currHost,
                    label: (hostObj[currHost].description + "\n(" + currHost + ")"),
                    mass: (hostObj[currHost].children.length / 4) + 1,
                    color: {
                        border: color_border,
                        background: color_background
                    },

                    font: {
                        size: text_size
                    },

                    size: (hostObj[currHost].children.length * 3) + 20,
                    x: positionObj[currHost].node_x,
                    y: positionObj[currHost].node_y,

                });
            }


            for (y = 0; y < hostObj[currHost].parents.length; y++) {

                edges.update({
                    from: hostObj[currHost].parents[y],
                    to: currHost
                });

            }

        }

    }

    var networkData = {
        nodes: nodes,
        edges: edges
    };

    var container = document.getElementById('dependency-network');

    const hierarchyOptions = {
        layout: {

            randomSeed: 728804,

            // improvedLayout: true,
            hierarchical: {
                enabled: true,
                levelSeparation: 200,
                nodeSpacing: 150,
                treeSpacing: 200,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                direction: 'UD', // UD, DU, LR, RL
                sortMethod: 'directed' // hubsize, directed
            },

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
        nodes: {
            shape: 'square', // color: '#ff0000',
            fixed: true,
            // font: '12px arial red',
            scaling: {
                min: 1,
                max: 15,
                label: {
                    enabled: true,
                    min: 14,
                    max: 30,
                    maxVisible: 30,
                    drawThreshold: 5
                },

            },
        }
    };

    const networkOptions = {

        layout: {
            improvedLayout: false,
            randomSeed: 728804
        },
        edges: {
            smooth: {
                "forceDirection": "none",
            }
        },

        nodes: {
            scaling: {
                label: true
            },
            fixed: true,
            shape: 'dot'
        }
    };


    if (hierarchical) {
        var network = new vis.Network(container, networkData, hierarchyOptions);
    } else if(isFullscreen){

        var network = new vis.Network(container, networkData, networkOptions);

        // console.log("called");

        fullscreenMode(network, nodes);


    } else{

        var network = new vis.Network(container, networkData, networkOptions);

        // setTimeout();

        if (Object.keys(positionObj).length === 0) {
            network.setOptions({
                nodes: {
                    fixed: false
                }
            });
            $("#notification").html(
                "<div class = notification-content><h3>Generating New Network</h3>"
            ).css({
                "display": "block",
            }).delay(5000).fadeOut();
            $('.fabs').hide();
            document.getElementById('loadingBar').style.display = 'block';
            network.on("stabilizationProgress", function (params) {
                var maxWidth = 496;
                var minWidth = 20;
                var widthFactor = params.iterations / params.total;
                var width = Math.max(minWidth, maxWidth * widthFactor);

                document.getElementById('bar').style.width = width + 'px';
                document.getElementById('text').innerHTML = Math.round(widthFactor * 100) + '%';
            });

            network.once("stabilizationIterationsDone", function () {
                document.getElementById('text').innerHTML = '100%';
                document.getElementById('bar').style.width = '496px';
                document.getElementById('loadingBar').style.opacity = 0;
                // really clean the dom element
                setTimeout(function () {
                    document.getElementById('loadingBar').style.display = 'none';
                }, 500);
                $('.fabs').show();
            });
        }
    }



    $('#editBtn').click(function () {


        network.setOptions({
            nodes: {
                fixed: false
            },
        });

        $('.fab-btn-sm').toggleClass('scale-out');
        if ($('.fab-btn-sm').hasClass('scale-out')) {
            network.setOptions({
                nodes: {
                    fixed: true
                }
            });
        }
    });

    $('.fab-btn-save').click(function() {
        network.setOptions({
            nodes: {
                fixed: true
            }
        });

        network.storePositions()

        $.ajax({
            url: "/icingaweb2/dependency_plugin/graph/storeNodes",
            type: 'POST',
            data: {
                json: JSON.stringify(nodes._data)
            },
            success: function () {
                    $("#notification").html(
                        "<div class = notification-content><h3>Changes Saved Successfully</h3>"
                    ).css({
                        "display": "block",
                    }).delay(5000).fadeOut();
            }
        });
    });

    if(newHost && !hierarchical){
        network.setOptions({
            nodes: {
                fixed: false
            }
        });
         network.startSimulation();
          network.stabilize(100);

        network.once("stabilizationIterationsDone", function () {
         network.stopSimulation();  
             network.setOptions({
                nodes: {
                    fixed : true 
                }
            }); 
            network.storePositions();
        $.ajax({
            url: "/icingaweb2/dependency_plugin/graph/storeNodes",
            type: 'POST',
            data: {
                json: JSON.stringify(nodes._data)
            },
            success: function () {
                $("#notification").html(
                    "<div class = notification-content><h3>Network Change Detected</h3>"
                ).css({
                    "display": "block",
                }).delay(5000).fadeOut();
            }
        });

        });
    }

    // $('.fab-btn-refresh').click(function () {
    //     network.setOptions({
    //         nodes: {
    //             fixed: false
    //         },

    //         drawNetwork(hostObj,  )
    //     });

    // });

    network.on("doubleClick", function (params) {
        if (params.nodes[0] != undefined) {
            href = location.href.split('/');
            location.href = 'http://' + href[2] + '/icingaweb2/monitoring/list/hosts#!/icingaweb2/monitoring/host/show?host=' + params.nodes[0];
        }
    });
    network.on("selectNode", function (params) {

        var clickedNode = network.body.nodes[params.nodes[0]];
        font_size = clickedNode.options.font.size;
        clickedNode.setOptions({
            font: {
                size: 30,
                background: 'white',
            }
        });
    });

    network.on("deselectNode", function (params) {

        var clickedNode = network.body.nodes[params.previousSelection.nodes[0]];
        clickedNode.setOptions({
            font: {
                size: font_size,
                background: 'none',
            }
        });

    });


}
