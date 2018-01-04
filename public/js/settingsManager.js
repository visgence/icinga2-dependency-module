function settingsManager() {

    loadSaved();
    

     $("#settings-form").change(() => {
         drawPreviewNetwork();
    });

    $('#submit-button').click(() => {
        saveSettings();
    });

}

function loadSettings() {

    var moduleSettings = {

        'display_up' : true,

        'display_down': true,

        'display_unreachable': true,

        'display_only_dependencies': false,

        'is_hierarchical': false,

        'scaling': true,

        'alias_only': true,

        'label_large_nodes': true,

        'text_size': 50
    }


    moduleSettings.is_hierarchical = $('#hierarchy-radio').prop('checked');
    moduleSettings.display_only_dependencies = $("#host-mode-checkbox").prop('checked');
    moduleSettings.display_up = $("#node-text-up-checkbox").prop('checked');
    moduleSettings.display_down  = $("#node-text-down-checkbox").prop('checked');
    moduleSettings.display_unreachable  = $("#node-text-unreachable-checkbox").prop('checked');
    moduleSettings.scaling = $("#scaling-mode-checkbox").prop('checked');
    moduleSettings.text_size = $("#text-size-range").val() / 2;
    moduleSettings.label_large_nodes = $('#label-mode-checkbox').prop('checked');
    moduleSettings.alias_only = $('#alias-label-checkbox').prop('checked');

    return moduleSettings;
}

function drawPreviewNetwork(moduleSettings) {
    
    var moduleSettings = loadSettings();

    if(moduleSettings.scaling === true){
        scalingSize = 15;
    } else{
        scalingSize = 0;
    }

    if(moduleSettings.alias_only){
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

    } 
    else {
        var nodes = new vis.DataSet([{
            id: 1,
            size: 25 + (scalingSize * 1.5),
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 1' + '\n(host-1)'
        },
        {
            id: 2,
            size: 25 + scalingSize,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 2' + '\n(host-2)'
        },
        {
            id: 3,
            size: 25,
            color: {
                border: 'red',
                background: 'white'
            },
            group: 'down',
            label: 'host 3' + '\n(host-3)'
        },
        {
            id: 4,
            size: 25,
            color: {
                border: 'purple',
                background: 'white'
            },
            group: 'unreachable',
            label: 'host 4' + '\n(host-4)'
        },
        {
            id: 5,
            size: 25,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 5' + '\n(host-5)'
        },
        {
            id: 6,
            size: 25,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 6' + '\n(host-6)'
        },
        {
            id: 7,
            size: 25,
            color: {
                border: 'red',
                background: 'white'
            },
            group: 'down',
            label: 'host 7' + '\n(host-7)'
        },
        {
            id: 8,
            size: 25,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 8' + '\n(host-8)'
        },
        {
            id: 9,
            size: 25,
            color: {
                border: 'red',
                background: 'white'
            },
            group: 'down',
            label: 'host 9' + '\n(host-9)'
        },
        {
            id: 10,
            size: 25,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 10' + '\n(host-10)'
        },
        {
            id: 11,
            size: 25,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 11' + '\n(host-11)'
        },
        {
            id: 12,
            size: 25,
            color: {
                border: 'green',
                background: 'white'
            },
            group: 'up',
            label: 'host 12' + '\n(host-12)'
        }


        ]);
}


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

    if (moduleSettings.display_up) {
        var upSize = moduleSettings.text_size;
    } else {
        var upSize = 0;
    }

    if (moduleSettings.display_down) {
        var downSize = moduleSettings.text_size;
    } else {
        var downSize = 0;
    }

    if (moduleSettings.display_unreachable) {
        var unreachableSize = moduleSettings.text_size;
    } else {
        var unreachableSize = 0;
    }

    if (moduleSettings.label_large_nodes){

        nodes.update({
            id: 1,
            font: {
                size: moduleSettings.text_size
            },
            group:  ''
        });

        nodes.update({
            id: 2,
            font: {
                size: moduleSettings.text_size
            },
            group: ''
        });

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

    if (moduleSettings.is_hierarchical) {
        var network = new vis.Network(container, data, hierarchyOptions);
    } else {
        var network = new vis.Network(container, data, networkOptions);
    }

}

function saveSettings(moduleSettings){

    var moduleSettings = loadSettings();

    console.log(moduleSettings);


    $.ajax({

        url: "/icingaweb2/dependency_plugin/module/storeGraphSettings", //get host states
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
        url: "/icingaweb2/dependency_plugin/module/getgraphSettings", //get host states
        type: 'GET',
        success: function (data) {

            settings = JSON.parse(data)

            parsedSettings = {};

            for (i = 0; i < settings.length; i++) {
                parsedSettings[settings[i]['setting_name']] = settings[i]['setting_value']
            }

            $('#hierarchy-radio').prop('checked', (parseInt(parsedSettings.is_hierarchical) === 1));
            $('#network-radio').prop('checked', (parseInt(parsedSettings.is_hierarchical) === 0));
            $("#host-mode-checkbox").prop('checked', (parseInt(parsedSettings.display_only_dependencies) === 1));
            $("#node-text-up-checkbox").prop('checked', (parseInt(parsedSettings.display_up) === 1));
            $("#node-text-down-checkbox").prop('checked', (parseInt(parsedSettings.display_down) === 1));
            $("#node-text-unreachable-checkbox").prop('checked', (parseInt(parsedSettings.display_unreachable) === 1));
            $("#scaling-mode-checkbox").prop('checked', (parseInt(parsedSettings.scaling) === 1));
            $("#text-size-range").val(parseInt(parsedSettings.text_size)*2);
            $('#label-mode-checkbox').prop('checked', (parseInt(parsedSettings.label_large_nodes)));
            $('#alias-label-checkbox').prop('checked', (parseInt(parsedSettings.alias_only)));

            drawPreviewNetwork();


        },
        error: function (data) {


            alert('Cannot Load Settings Information, Please Check Databases\n\nError:' + data.responseJSON['message']);

        }

    });

    
}


