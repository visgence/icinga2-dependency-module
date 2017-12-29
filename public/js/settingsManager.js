function settingsManager() {

    loadSaved();
    

     $("#settings-form").change(function () {
         drawPreviewNetwork();
    });

    $('#submit-button').click(() => {
        saveSettings();
    });

}

function loadSettings() {

    var moduleSettings = {

        'hostLabels': {
            'up': true,
            'down': true,
            'unreachable': true
        },

        'displayOnlyDependencies': false,

        'isHierarchical': false,

        'boldTextonNodeSelection': true,

        'scaling': true,

        'textSize': 50
    }


    moduleSettings.isHierarchical = $('#hierarchy-radio').prop('checked');
    moduleSettings.displayOnlyDependencies = $("#host-mode-checkbox").prop('checked');
    moduleSettings.hostLabels.up = $("#node-text-up-checkbox").prop('checked');
    moduleSettings.hostLabels.down  = $("#node-text-down-checkbox").prop('checked');
    moduleSettings.hostLabels.unreachable  = $("#node-text-unreachable-checkbox").prop('checked');
    moduleSettings.scaling = $("#scaling-mode-checkbox").prop('checked');
    moduleSettings.textSize = $("#text-size-range").val() / 2;

 

    return moduleSettings;
}

function drawPreviewNetwork(moduleSettings) {
    
    var moduleSettings = loadSettings();

    if(moduleSettings.scaling === true){
        scalingSize = 15;
    } else{
        scalingSize = 0;
    }

    var nodes = new vis.DataSet([{
            id: 1,
            size: 25 + (scalingSize * 1.5),
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 1'
        },
        {
            id: 2,
            size: 25 + scalingSize, 
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 2'
        },
        {
            id: 3,
            size: 25,
            color: {
                border: 'red',
                background: 'white'
            },
            group: 'down',
            label: 'host 3'
        },
        {
            id: 4,
            size: 25,
            color: {
                border: 'purple',
                background: 'white'
            },
            group: 'unreachable',
            label: 'host 4'
        },
        {
            id: 5,
            size: 25,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 5'
        },
        {
            id: 6,
            size: 25,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 6'
        },
        {
            id: 7,
            size: 25,
            color: {
                border: 'red',
                background: 'white'
            },
            group: 'down',
            label: 'host 7'
        },
        {
            id: 8,
            size: 25,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 8'
        },
        {
            id: 9,
            size: 25,
            color: {
                border: 'red',
                background: 'white'
            },
            group: 'down',
            label: 'host 9'
        },
        {
            id: 10,
            size: 25,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 10'
        },
        {
            id: 11,
            size: 25,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 11'
        },
        {
            id: 12,
            size: 25,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 12'
        }


    ]);

    var edges = new vis.DataSet([{
            from: 3,
            to: 1
        },
        {
            from: 4,
            to: 1
        },
        {
            from: 5,
            to: 1
        },
        {
            from: 6,
            to: 1
        },
        {
            from: 7,
            to: 1
        },
        {
            from: 8,
            to: 1
        }, {
            from: 9,
            to: 2
        },
        {
            from: 10,
            to: 2
        },
        {
            from: 11,
            to: 2
        }
    ]);

    if (moduleSettings.displayOnlyDependencies) {
        nodes.remove(12);
    }

    if (moduleSettings.hostLabels.up) {
        var upSize = moduleSettings.textSize;
    } else {
        var upSize = 0;
    }

    if (moduleSettings.hostLabels.down) {
        var downSize = moduleSettings.textSize;
    } else {
        var downSize = 0;
    }

    if (moduleSettings.hostLabels.unreachable) {
        var unreachableSize = moduleSettings.textSize;
    } else {
        var unreachableSize = 0;
    }


    var container = document.getElementById('network-preview');
    var data = {
        nodes: nodes,
        edges: edges
    };

    const hierarchyOptions = {

        groups: {
            up: {
                font: {
                    size: upSize
                }
            },
            down: {
                font: {
                    size: downSize
                }
            },
            unreachable: {
                font: {
                    size: unreachableSize
                }
            },
        },

        layout: {

            hierarchical: {
                enabled: true,
                levelSeparation: 200,
                nodeSpacing: 150,
                treeSpacing: 200,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                direction: 'DU',
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

        groups: {
            up: {
                font: {
                    size: upSize
                }
            },
            down: {
                font: {
                    size: downSize
                }
            },
            unreachable: {
                font: {
                    size: unreachableSize
                }
            },
        },

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
            fixed: false,
            shape: 'dot'
        }
    };

    if (moduleSettings.isHierarchical) {
        var network = new vis.Network(container, data, hierarchyOptions);
    } else {
        var network = new vis.Network(container, data, networkOptions);
    }

}

function saveSettings(moduleSettings){

    var moduleSettings = loadSettings();


    $.ajax({

        url: "/icingaweb2/dependency_plugin/graph/storeGraphSettings", //get host states
        type: 'POST',
        data: {
            json: JSON.stringify(moduleSettings)
        },
        success: function () {
            $("#notification").html(
                "<div class = notification-content><h3>Settings Saved Succesfully</h3>"
            ).css({
                "display": "block",
            }).delay(5000).fadeOut();
        },
        error: function (data) {
            console.log(data);
            alert('Configuration Unsuccessful, Please Check Entered Information\n\n' + data.responseJSON['message']);
        }

    });


}

function loadSaved(){

    $.ajax({
        url: "/icingaweb2/dependency_plugin/graph/getgraphSettings", //get host states
        type: 'GET',
        success: function (data) {

            settings = JSON.parse(data)

            $('#hierarchy-radio').prop('checked', (parseInt(settings[0].default_network) === 1));
            $('#network-radio').prop('checked', (parseInt(settings[0].default_network) === 0));
            $("#host-mode-checkbox").prop('checked', (parseInt(settings[0].display_only_dependencies) === 1));
            $("#node-text-up-checkbox").prop('checked', (parseInt(settings[0].display_up) === 1));
            $("#node-text-down-checkbox").prop('checked', (parseInt(settings[0].display_down) === 1));
            $("#node-text-unreachable-checkbox").prop('checked', (parseInt(settings[0].display_unreachable) === 1));
            $("#scaling-mode-checkbox").prop('checked', (parseInt(settings[0].scaling) === 1));
            $("#text-size-range").val(parseInt(settings[0]).text_size*2);



            drawPreviewNetwork();


        },
        error: function (data) {


            alert('Cannot Load Settings Information, Please Check Databases\n\nError:' + data.responseJSON['message']);

        }

    });

    
}


