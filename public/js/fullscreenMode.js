function fullscreenMode(network, nodes) {

    idle();

    setTimeout(function () {

        refreshMap();
    }, 600000);

    // var problemHosts = [];

    var focusOptions = {
        scale: 1.5,
        animation: { 
            duration: 1500,
            easingFunction: 'easeInCubic'

        }
    }

    var fitOptions = {

        animation: {
            duration: 2000,
            easingFunction: 'easeOutCubic'
        }

    }


    function idle() {

        setTimeout(function () {

            getStateUpdate(network, nodes);
            //  focusProblemHost();

            idle();


        }, 300000);

        // setTimeout(function () {

        // focusProblemHost();

        // }, 5000)

    }

    // function focusProblemHost(){

    //     network.focus(problemHosts[1], focusOptions);

    //     setTimeout(function(){
    //         exitTimeout();
    //     }, 5000);


}

// }, 2000);

function exitTimeout() {
    network.fit(fitOptions);

    setTimeout(function () {

    }, )


}

function refreshMap(isHierarchical, isFullscreen) {


    $.when(
        $.ajax({
            url: "/icingaweb2/dependency_plugin/graph/getHosts", //get host states
            type: 'GET',
            success: function (hostData) {
                hosts = (JSON.parse(hostData));
                // console.log(hosts);
            }
        }),

        $.ajax({
            url: "/icingaweb2/dependency_plugin/graph/getDependency", //get dependencies
            type: 'GET',
            success: function (dependencyData) {
                dependencies = (JSON.parse(dependencyData));
            }
        }),

        $.ajax({
            url: "/icingaweb2/dependency_plugin/graph/getNodes", //get node positions
            type: 'GET',
            success: function (response) {
                response = JSON.parse(response);
                if (response === "EMPTY!") {
                    positionData = null;
                } else {
                    positionData = response;
                }
            }
        })
    ).then(function () {
        if (dependencies === 404) {
            alert("API Authentication Not Found, Please run Setup API command on host machine");
        } else {
            // console.log(hosts, dependencies);
            formatDependencies(hosts, dependencies, false, positionData, true);
        }
    });
}

function getStateUpdate(network, nodes) {

    problemHosts = [];


    $.when(
        $.ajax({
            url: "/icingaweb2/dependency_plugin/graph/getHosts", //get host states
            type: 'GET',
            success: function (hostData) {
                hosts = (JSON.parse(hostData));

            }
        })
    ).then(function () {

        for (i = 0; i < hosts.results.length; i++) {

            var node = network.body.nodes[hosts.results[i].name];

            if (hosts.results[i].attrs.state === 0) { //if host is in a sate of 0 it is up, if '1' it is considered down, but can also be unreachable.
                color_border = 'green';
                font_size = 0;
            } else if (hosts.results[i].attrs.state === 1) {

                if (hosts.results[i].attrs.last_reachable === false) {
                    color_border = 'purple';
                    font_size = 14;
                    problemHosts.push(hosts.results[i].name);
                } else {
                    color_border = 'red';
                    font_size = 14;
                    problemHosts.push(hosts.results[i].name);
                }
            }

            if (node != undefined) {

                nodes.update({
                    id: hosts.results[i].name,
                    color: {
                        border: color_border
                    },
                    font: {
                        size: font_size

                    }
                });

            }
        }

    });


}