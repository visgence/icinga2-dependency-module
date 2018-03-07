// function getRequests(isHierarchical) {

// if (window.location.href.indexOf('Fullscreen') > -1) {
//     var isFullscreen = true;
//     $('.fabs').hide();
// }

// $.when(

function getIcingaResourceDatabases() {

    var promise = new Promise((resolve, reject) => {

        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/getResources", //get Icinga Resource List
            type: 'GET',
            success: function (response) {
                resolve(response);
            },
            error: (error) => {
                reject(error);
            }
        });
    });

    return promise;

}

function getDependencies() {

    var promise = new Promise((resolve, reject) => {

        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/getDependency", //get dependencies
            type: 'GET',
            success: function (dependencyData) {

                dependencies = (JSON.parse(dependencyData));
                resolve({
                    type: 'dependencies',
                    data: dependencies,
                });
            },
            error: (data) => {
                reject({
                    'type': 'dependencies',
                    'data': data['responseText']
                });

            }

        });

    });

    return promise;

}

function getHosts() {

    var promise = new Promise((resolve, reject) => {

        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/getHosts", //get host states
            type: 'GET',
            success: function (hostData) {

                hosts = (JSON.parse(hostData));
                resolve({
                    type: 'hosts',
                    data: hosts
                });
            },
            error: (data) => {
                reject(data)
            }
        });

    });

    return promise;

}

function getNodePositions() {

    var promise = new Promise((resolve, reject) => {
        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/getNodes", //get node positions
            type: 'GET',
            success: function (response) {
                response = JSON.parse(response);
                if (response === "EMPTY!") {
                    resolve({
                        'type': 'positions',
                        'data': null
                    });
                } else {
                    resolve({
                        'type': 'positions',
                        'data': response
                    });
                }

            },
            error: (data) => {
                reject({
                    'type': 'positions',
                    'data': data['responseText']
                });
            }
        });
    });

    return promise;

}

function getSettings() {

    var promise = new Promise((resolve, reject) => {


        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/getgraphSettings", //get host states
            type: 'GET',
            success: function (data) {

                settings = JSON.parse(data);

                parsedSettings = {}

                for (i = 0; i < settings.length; i++) {

                    if (settings[i]['setting_type'] === 'bool') {
                        parsedSettings[settings[i]['setting_name']] = (settings[i]['setting_value'] === 'true');
                    } else if (settings[i]['setting_type'] === 'int') {

                        parsedSettings[settings[i]['setting_name']] = (parseInt(settings[i]['setting_value']));

                    } else {

                        parsedSettings[settings[i]['setting_name']] = settings[i]['setting_value'];

                    }

                }
                resolve({
                    'type': 'settings',
                    'data': parsedSettings
                });
            },
            error: (data) => {
                reject({
                    'type': 'settings',
                    'data': data['responseText']
                });
            }

        });

    });

    return promise;

}

function getTemplates() {

    var promise = new Promise((resolve, reject) => {

        $.ajax({
            url: "/icingaweb2/director/dependencies/templates",
            type: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            success: function (data) {
                console.log('data', data)
                resolve(data);
            },
            error: function (data) {

                reject({
                    'Type': 'Templates',
                    'Error': data
                });

            }

        });

    });

    return promise;

}

function storeNodes(data) {

    var promise = new Promise((resolve, reject) => {
        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/storeNodes",
            type: 'POST',
            data: {
                json: JSON.stringify(data)
            },
            success: () => {
                resolve();
            },
            error: (error) => {
                reject({
                    'type': 'settings',
                    'data': error['responseText']
                });
            }
        });
    })

    return promise;

}

function storeNodePositions(data) {

    var promise = new Promise((resolve, reject) => {
        $.ajax({ //ajax request to store into DB
            url: "/icingaweb2/dependency_plugin/module/storeNodes",
            type: 'POST',
            data: {
                json: JSON.stringify(data)
            },
            success: () => {
                resolve();
            },
            error: (data) => {
                reject(data);
            }
        });

    });
    return promise;
}

function storeSettings(settings) {

    var promise = new Promise((resolve, reject) => {

        payload = JSON.stringify(settings)

        // console.log(payload)

        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/storeSettings",
            type: 'POST',
            data: {
                json: payload
            },
            success: () => {
                resolve();
            },
            error: (error) => {
                reject({
                    'type': 'settings',
                    'data': error['responseText']
                });
            }
        });
    });

    return promise;
}

function storeGraphSettings(settings) {

    var promise = new Promise((resolve, reject) => {

        payload = JSON.stringify(settings)

        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/storeGraphSettings",
            type: 'POST',
            data: {
                json: payload
            },
            success: () => {
                resolve();
            },
            error: (error) => {
                reject({
                    'type': 'settings',
                    'data': error['responseText']
                });
            }
        });
    });

    return promise;
}