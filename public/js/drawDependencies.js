function formatDependencies(hosts, dependencies, isHierarchical, positionData, isFullscreen) {

    var hostObj = {};
    var positionObj = {};

    //  Passed objects are are ordered by Obj.results[i].attrs.hostName.var, would be easier to use Obj['hostName'].var
    //  Convert to Obj[hostName].var format while combining hosts and dependency objects:

    for (i = 0; i < dependencies.results.length; i++) { //build base hostObj out of dependencies, add state infromation later

        hostName = dependencies.results[i].attrs.child_host_name;
        parentName = dependencies.results[i].attrs.parent_host_name;

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
            hostObj[hostName].parents.push(parentName); //if host exists,push the additional parent
        }

        //also intitialize parents if undefined because some hosts exist solely as parent entries.

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
            hostObj[parentName].children.push(hostName);
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

        if (hostObj[hosts.results[i].name] === undefined) { //initialize host obj child entry if it does not exit
            hostObj[hosts.results[i].name] = {
                status: hostStatus,
                description: hosts.results[i].attrs.display_name,
                parents: [],
                hasDependencies: true,
                group: hosts.results[i].attrs.groups[0],
                children: [],
            }
        } else { //insert into hostObj if dependencies exist
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

    drawNetwork(hostObj, isHierarchical, positionObj, isFullscreen);

}

function drawNetwork(hostObj, isHierarchical, positionObj, isFullscreen) {

    var redraw = true;

    var color_border = 'yellow';
    
    var newHost = false;

    color_background = 'white'

    var nodes = new vis.DataSet([]);

    var edges = new vis.DataSet([]);

    for (i = 0; i < Object.keys(hostObj).length; i++) {

        currHost = Object.keys(hostObj)[i]; //gets name of current host based on key iter


        if (hostObj[currHost].hasDependencies) {

            if (hostObj[currHost].status === 'DOWN') { //node color based on status
                color_border = 'red';
                text_size = 14;
            }

            if (hostObj[currHost].status === 'UNREACHABLE') {
                color_border = 'purple';
                text_size = 14;
            }

            if (hostObj[currHost].status === 'UP') { //if host is up, hide text.
                color_border = 'green';
                text_size = 0;
            }

            if ((hostObj[currHost].children.length) > 3) //label major nodes with more than 3 children regardless
                text_size = 14;

            if (!positionObj[currHost]) { //if the name of the host does not exist in object, it is a new host.
                if (Object.keys(positionObj).length > 0) //check if it is a new host, or an entire new network.
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

                    size: (hostObj[currHost].children.length * 3) + 20
                })
            } else { //not a new host
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
                    x: positionObj[currHost].node_x, //set x, y position
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

            hierarchical: {
                enabled: true,
                levelSeparation: 200,
                nodeSpacing: 150,
                treeSpacing: 200,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                direction: 'UD',
                sortMethod: 'directed'
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
            shape: 'square',
            fixed: true,
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


    if (isHierarchical) { //display using hierarchyOptions
        var network = new vis.Network(container, networkData, hierarchyOptions);

    } else if (isFullscreen) { //display using fullscreen (auto refresh)

        var network = new vis.Network(container, networkData, networkOptions);
        fullscreenMode(network, nodes);

    } else {

        var network = new vis.Network(container, networkData, networkOptions);

        if (Object.keys(positionObj).length === 0) { //if there is no position data for the network, simulate network.
            network.setOptions({
                nodes: {
                    fixed: false //unlock nodes for physics sim
                }
            });

            $("#notification").html(
                "<div class = notification-content><h3>Generating New Network</h3>"
            ).css({
                "display": "block",
            }).delay(5000).fadeOut();

            $('.fabs').hide();

            $('#loadingBar').css('display', 'block');

            network.on("stabilizationProgress", function (params) { //as network is simulating animate by percentage of physics iter complete
                var maxWidth = 496;
                var minWidth = 20;
                var widthFactor = params.iterations / params.total;
                var width = Math.max(minWidth, maxWidth * widthFactor);
                $('#bar').css("width", width);
                $('#text').html(Math.round(widthFactor * 100) + '%');
            });

            network.once("stabilizationIterationsDone", function () {
                $('#text').html('100%');
                $('#bar').css("width", '496');
                $('#loadingBar').css('opacity', '0');
                // really clean the dom element
                setTimeout(function () {
                    $('#loadingBar').css('display', 'none');
                }, 500);
                $('.fabs').show();
            });
        }
    }

    $('#editBtn').click(function () { //on edit

        network.setOptions({ //unlock nodes for editing
            nodes: {
                fixed: false
            },
        });

        $('.fab-btn-sm').toggleClass('scale-out'); // show secondary FABs
        if ($('.fab-btn-sm').hasClass('scale-out')) { //if already scaled out, second click hides secondary FABs and locks nodes
            network.setOptions({
                nodes: {
                    fixed: true
                }
            });
        }
    });

    $('.fab-btn-save').click(function () { //on save
        network.setOptions({
            nodes: {
                fixed: true
            }
        });

        network.storePositions(); //visjs function that adds X, Y coordinates of all nodes to the visjs node dataset that was used to draw the network.

        $.ajax({ //ajax request to store into DB
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

    if (newHost && !isHierarchical) { //if a new host was added, and it is not being displayed in hierarchical layout
        network.setOptions({
            nodes: {
                fixed: false //unlock nodes
            }
        });
        network.startSimulation(); //start new physics sim
        network.stabilize(100); //on sim for 100 iters, usually enough for the node to place itself automatically.

        network.once("stabilizationIterationsDone", function () {
            network.stopSimulation();
            network.setOptions({
                nodes: {
                    fixed: true
                }
            });
            network.storePositions(); //after new node added, resave network positions
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
                },
                error: function (data) {
                    console.log(data);
                    alert('Error Loading Node Positional Data, Please Check Entered Information\n\n' + data.responseJSON['message']);
                }
            });

        });
    }

    network.on("doubleClick", function (params) { //double click on node listener
        if (params.nodes[0] != undefined) {
            href = location.href.split('/');
            location.href = 'http://' + href[2] + '/icingaweb2/monitoring/list/hosts#!/icingaweb2/monitoring/host/show?host=' + params.nodes[0]; //redirect to host info page.
        }
    });

    network.on("selectNode", function (params) { //on selecting node, background of label is made solid white for readabillity. 
        var clickedNode = network.body.nodes[params.nodes[0]];
        font_size = clickedNode.options.font.size;
        clickedNode.setOptions({
            font: {
                size: 30,
                background: 'white',
            }
        });
    });

    network.on("deselectNode", function (params) { //on node deselect, label set back to transparent.

        var clickedNode = network.body.nodes[params.previousSelection.nodes[0]];
        clickedNode.setOptions({
            font: {
                size: font_size,
                background: 'none',
            }
        });

    });


}