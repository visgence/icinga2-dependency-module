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

        'default_dependency_template': '',

        'enable_director': false,

        'display_up': true,

        'display_down': true,

        'display_unreachable': true,

        'display_only_dependencies': false,

        'scaling': true,

        'alias_only': true,

        'fulscreen_mode': 'network',

        'label_large_nodes': true,

        'text_size': 50
    }


    moduleSettings.display_only_dependencies = $("#host-mode-checkbox").prop('checked');
    moduleSettings.display_up = $("#node-text-up-checkbox").prop('checked');
    moduleSettings.display_down = $("#node-text-down-checkbox").prop('checked');
    moduleSettings.display_unreachable = $("#node-text-unreachable-checkbox").prop('checked');
    moduleSettings.scaling = $("#scaling-mode-checkbox").prop('checked');
    moduleSettings.text_size = $("#text-size-range").val() / 2;
    moduleSettings.label_large_nodes = $('#label-mode-checkbox').prop('checked');
    moduleSettings.alias_only = $('#alias-label-checkbox').prop('checked');
    moduleSettings.default_dependency_template = $("#dependency-template-field").val();
    moduleSettings.enable_director = $("#director-checkbox").prop('checked');
    if ($('#fullscreen-grid-checkbox').prop('checked')){
        moduleSettings.fullscreen_mode = 'grid'
    }
    if ($('#fullscreen-network-checkbox').prop('checked')) {
        moduleSettings.fullscreen_mode = 'network'
    }

    return moduleSettings;
}

function drawPreviewNetwork() {

    var moduleSettings = loadSettings();

    if (moduleSettings.enable_director === false) {
        $('#director-settings').hide();
    } else {
        $('#director-settings').show();
    }

    if (moduleSettings.scaling === true) {
        scalingSize = 15;
    } else {
        scalingSize = 0;
    }

    if (moduleSettings.alias_only) {
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

    } else {
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

    if (moduleSettings.display_only_dependencies) {
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

    if (moduleSettings.label_large_nodes) {

        nodes.update({
            id: 1,
            font: {
                size: moduleSettings.text_size
            },
            group: ''
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

function saveSettings() {

    var moduleSettings = loadSettings();

    payload = { //convert to strings for db on frontend due t o PHP's handling of booleans->strings

        'display_up': {
            'value': (String(moduleSettings['display_up'])),
            'type': 'bool'
        },

        'display_down': {
            'value': (String(moduleSettings['display_down'])),
            'type': 'bool'
        },

        'display_unreachable': {
            'value': (String(moduleSettings['display_unreachable'])),
            'type': 'bool'
        },

        'display_only_dependencies': {
            'value': (String(moduleSettings['display_only_dependencies'])),
            'type': 'bool'
        },

        'scaling': {
            'value': (String(moduleSettings['scaling'])),
            'type': 'bool'
        },

        'alias_only': {
            'value': (String(moduleSettings['alias_only'])),
            'type': 'bool'
        },

        'label_large_nodes': {
            'value': (String(moduleSettings['label_large_nodes'])),
            'type': 'bool'
        },

        'text_size': {
            'value': (String(moduleSettings['text_size'])),
            'type': 'int'
        },

        'enable_director': {
            'value': (String(moduleSettings['enable_director'])),
            'type': 'bool'

        },

        'default_dependency_template': {
            'value': moduleSettings['default_dependency_template'],
            'type': 'string'
        },

        'fullscreen_mode': {
            'value' : moduleSettings['fullscreen_mode'],
            'type' : 'string'
        }

    };

    success = () => {

        // checkForSettingsConflicts()
        $('#notifications').append().html('<li class="success fade-out">Settings Saved Successfully</li>');
    }

    error = (error) => {
        errorHandler(error)
    }

    var saveSettings = storeGraphSettings(payload).then(success, error)

}

function loadSaved() {

    var settings = {}

    success = (data) => {
        settings = data['data']
    }

    error = (error) => {

        errorHandler(error);

        throw error;
    }

    var settingsPromise = getSettings().then(success, error);

    Promise.all([settingsPromise]).then(() => {


        $("#host-mode-checkbox").prop('checked', settings.display_only_dependencies);
        $("#node-text-up-checkbox").prop('checked', settings.display_up);
        $("#node-text-down-checkbox").prop('checked', settings.display_down);
        $("#node-text-unreachable-checkbox").prop('checked', settings.display_unreachable);
        $("#scaling-mode-checkbox").prop('checked', settings.scaling);
        $("#text-size-range").val((settings.text_size) * 2);
        $('#label-mode-checkbox').prop('checked', settings.label_large_nodes);
        $('#alias-label-checkbox').prop('checked', settings.alias_only);
        $('#director-checkbox').prop('checked', settings.enable_director);
        $('#fullscreen-grid-checkbox').prop('checked', settings.fullscreen_mode === 'grid')
        $('#fullscreen-network-checkbox').prop('checked', settings.fullscreen_mode === 'network')

        $('#fullscreen-grid-checkbox').click(()=>{
            $('#fullscreen-network-checkbox').prop('checked', false)
        });

        $('#fullscreen-network-checkbox').click(()=>{
            $('#fullscreen-grid-checkbox').prop('checked', false)
        });


        populateDependencyTemplateDropdown(settings.default_dependency_template);

        drawPreviewNetwork();

    });

}

function populateDependencyTemplateDropdown(defaultTemplate) {
    templateNames = [];

    success = (data) => {

        var templateDropdown = $("#dependency-template-field");

        for (i = 0; i < data['objects'].length; i++) {

            templateDropdown.append("<option value=" + data['objects'][i]["object_name"] + ">" + data['objects'][i]["object_name"] + "</option>");

        }

        $("#dependency-template-field").val(defaultTemplate);

    }

    error = (error) => {

        handleError(error);

    }

    var templatesPromise = getTemplates().then(success, error)

}

// function checkForSettingsConflicts(){
    
// }