function getIcingaResourceDatabases() {

    var promise = new Promise((resolve, reject) => {

        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/getResources", //get Icinga Resource List
            type: 'GET',
            success: (response) => {
                resolve(response);
            },
            error: (error) => {
                reject({
                    'type': 'resources',
                    'message': error['responseJSON']['message'],
                    'code': error.code
                });
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
            success: (data) => {

                dependencies = (JSON.parse(data));
                resolve({
                    type: 'dependencies',
                    data: dependencies,
                });
            },
            error: (error) => {
                reject({
                    'type': 'dependencies',
                    'message': error['responseJSON']['message'],
                    'code': error.code,
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
            error: (error) => {
                console.log(error)
                reject({
                    'type': 'hosts',
                    'message': error['responseJSON']['message'],
                    'code': error['code']
                });
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
            success: (data) => {
                data = JSON.parse(data);
                if (data === "EMPTY!") {
                    resolve({
                        'type': 'positions',
                        'data': null
                    });
                } else {
                    resolve({
                        'type': 'positions',
                        'data': data
                    });
                }

            },
            error: (error) => {
                reject({
                    'type': 'positions',
                    'message': error['responseJSON']['message'],
                    'code': error['code']
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

                resolve({
                    'type': 'settings',
                    'data': settings
                });
            },
            error: (error) => {
                console.log(error);
                reject({
                    'type': 'settings',
                    'message': error['responseJSON']['message'],
                    'code': error['code']
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
            success: (data) => {
                resolve(data);
            },
            error: (data) => {

                reject({
                    'type': 'templates',
                    'message': error['responseJSON']['message'],
                    'code': error[code]
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
                    'type': 'nodes',
                    'message': error['responseJSON']['message'],
                    'code' : error['code']
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
            error: (error) => {
                reject({
                    'type' : 'positions',
                    'message': error['responseJSON']['message'],
                    'code': error['code']
                });
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
                    'message': error['responseJSON']['message'],
                    'code' : error['code']
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
                    'type': 'graph_settings',
                    'message': error['responseJSON']['message'],
                    'code': error['code']
                });
            }
        });
    });

    return promise;
}