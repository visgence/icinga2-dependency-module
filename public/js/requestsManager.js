function calculateRequestURL() {
    // checks if /icingaweb2 is present in routing or has been removed, neccessary for hitting correct endpoints

    if (location.href.indexOf('/icingaweb2') > 1) {
        return ('/icingaweb2/dependency_plugin/module/');
    } else {
        return ('/dependency_plugin/module/');
    }
}


function getIcingaResourceDatabases() {


    let requestURL = calculateRequestURL() + 'getResources';

    var promise = new Promise((resolve, reject) => {


        $.ajax({
            url: requestURL, //get Icinga Resource List
            type: 'GET',
            success: (response) => {
                resolve(response);
            },
            error: (error) => {

                if (error['responseJSON']) {
                    reject({
                        'type': 'resources',
                        'message': error['responseJSON']['message'],
                        'code': error.code
                    });
                } else { //non standard error
                    reject({
                        'type': 'resources',
                        'message': error,
                        'code': error.code
                    })
                }
            }
        });
    });

    return promise;

}

function getDependencies() {

    let requestURL = calculateRequestURL() + 'getDependency'


    var promise = new Promise((resolve, reject) => {

        $.ajax({
            url: requestURL, //get dependencies
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


    let requestURL = calculateRequestURL() + 'getHosts';

    var promise = new Promise((resolve, reject) => {

        $.ajax({
            url: requestURL, //get host states
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

    let requestURL = calculateRequestURL() + 'getNodes';

    var promise = new Promise((resolve, reject) => {
        $.ajax({
            url: requestURL, //get node positions
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

    let requestURL = calculateRequestURL() + 'getGraphSettings';

    var promise = new Promise((resolve, reject) => {


        $.ajax({
            url: requestURL, //get host states
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

// function getTemplates() {

//     let requestURL = calculateRequestURL() + 'templates';

//     var promise = new Promise((resolve, reject) => {

//         $.ajax({
//             url: requestURL,
//             type: 'GET',
//             headers: {
//                 'Accept': 'application/json'
//             },
//             success: (data) => {
//                 resolve(data);
//             },
//             error: (data) => {

//                 reject({
//                     'type': 'templates',
//                     'message': error['responseJSON']['message'],
//                     'code': error[code]
//                 });

//             }

//         });

//     });

//     return promise;

// }

function storeNodePositions(data) {

    let requestURL = calculateRequestURL() + 'storeNodePositions';


    var promise = new Promise((resolve, reject) => {
        $.ajax({
            url: requestURL,
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
                    'code': error['code']
                });
            }
        });
    })

    return promise;

}

// function storeNodePositions(data) {

//     var promise = new Promise((resolve, reject) => {
//         $.ajax({ //ajax request to store into DB
//             url: "./storeNodePositions",
//             type: 'POST',
//             data: {
//                 json: JSON.stringify(data)
//             },
//             success: () => {
//                 resolve();
//             },
//             error: (error) => {
//                 reject({
//                     'type': 'positions',
//                     'message': error['responseJSON']['message'],
//                     'code': error['code']
//                 });
//             }
//         });

//     });
//     return promise;
// }

function storeSettings(settings) {

    let requestURL = calculateRequestURL() + 'storeSettings';

    var promise = new Promise((resolve, reject) => {

        payload = JSON.stringify(settings)

        // console.log(payload)

        $.ajax({
            url: requestURL,
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
                    'code': error['code']
                });
            }
        });
    });

    return promise;
}

function storeGraphSettings(settings) {

    let requestURL = calculateRequestURL() + 'storeGraphSettings';

    var promise = new Promise((resolve, reject) => {

        payload = JSON.stringify(settings)

        $.ajax({
            url: requestURL,
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