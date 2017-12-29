function fullscreenMode(container, networkData) {

    $('#dependency-network').css("background-color", '#262626');

    const fullscreenOptions = {

        layout: {
            improvedLayout: false,
            randomSeed: 728804
        },
        edges: {
            smooth: {
                "forceDirection": "none",
            },


            width: 5
        },

        nodes: {
            borderWidth: 2,
            scaling: {
                label: true
            },
            font: {
                color: 'white'
        },
            fixed: true,
            shape: 'dot'

        }
    };

    $.ajax({
        url: "/icingaweb2/dependency_plugin/graph/getHosts", //get host states
        type: 'GET',
        success: function (hostData) {
            hosts = (JSON.parse(hostData));

        }
    }).then(function () {

        for (i = 0; i < hosts.results.length; i++) {

            var node = networkData.nodes['_data'][hosts.results[i].name];

            if (hosts.results[i].attrs.state === 0) { //if host is in a sate of 0 it is up, if '1' it is considered down, but can also be unreachable.
                color_border = 'green';
                font_size = 0;
            } else if (hosts.results[i].attrs.state === 1) {

                if (hosts.results[i].attrs.last_reachable === false) {
                    color_border = 'purple';
                    font_size = 20;
                    // problemHosts.push(hosts.results[i].name);
                } else {
                    color_border = 'red';
                    font_size = 20;
                    // problemHosts.push(hosts.results[i].name);
                }
            }

            if (node != undefined) {

                networkData.nodes.update({
                    id: hosts.results[i].name,
                    color: {
                        border: color_border,
                        background: '#262626'
                    },
                    font: {
                        size: font_size,
                        color: 'white'
                    }
                });

            }
        }

        var network = new vis.Network(container, networkData, fullscreenOptions);

    });

    setTimeout(function () {

        getRequests(false);

    }, 300000);

}
