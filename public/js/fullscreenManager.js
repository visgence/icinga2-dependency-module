function fullscreenMode(container, networkData, Icinga) {

    hosts = [];
    $('.controls').hide();
    $('#dependency-network').css("background-color", '#262626');
    $('#dependency-network').css("height", '90%')
    $('#main').css("width", '100%');
    $('#main').css("height", '100%');
    $('#hud').css('display', 'block');
    $('#layout').addClass('fullscreen-layout');
    // Icinga.ui.toggleFullscreen();

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

    function success(data){
        hosts = JSON.parse(data['data'])
    }

    function error(error){
        errorHandler(error)

        throw error;
    }

    var hostPromise = getHosts(success, error).then(function () {

        var hostsUp = 0;
        var hostsDown = 0;
        var hostsUnreachable = 0;

        for (i = 0; i < hosts.results.length; i++) {

            var node = networkData.nodes['_data'][hosts.results[i].name];

            // console.log(node);

            if (hosts.results[i].attrs.state === 0) { //if host is in a sate of 0 it is up, if '1' it is considered down, but can also be unreachable.
                color_border = 'green';
                font_size = 0;
                hostsUp++;
            } else if (hosts.results[i].attrs.state === 1) {

                if (hosts.results[i].attrs.last_reachable === false) {
                    color_border = 'purple';
                    font_size = 20;
                    hostsUnreachable++;
                    // problemHosts.push(hosts.results[i].name);
                } else {
                    color_border = 'red';
                    font_size = 20;
                    hostsDown++;
                    // problemHosts.push(hosts.results[i].name);
                }
            }

            if (node != undefined) {

                if (node.mass > 1.5) {
                    font_size = 20;
                }

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

        startRefreshTimeout(network);

        var date = new Date();
        var timeUpdated = date;

        // console.log(timeUpdated);

        $('#hud-down').html("<h1>" + hostsDown + ' Hosts DOWN' + "</h1>");
        $('#hud-unreachable').html('<h1>' + hostsUnreachable + ' Hosts UNREACHABLE' + '</h1>');
        $('#hud-up').html('<h1>' + hostsUp + ' Hosts UP' + '</h1>');
        $('#hud-title').html('<h1>' + timeUpdated + '</h1>');

        updateTime();

    });

    function updateTime() {

        setTimeout(() => {

            var date = new Date();

            $('#hud-title').html('<h1>' + date + '</h1>')

            updateTime();

        }, 1000);
    }

    function startRefreshTimeout(network) {

        setTimeout(function () {

            network.destroy();


            getRequests(false);

        }, 60000);
    }

}