function drawGrid() {

    processData = (response) => {

        var hosts = response['data']['results']
        var nodes = new vis.DataSet([]);
        var edges = new vis.DataSet([]);
        var color_border = 'green'

        var hostsUp = 0
        var hostsDown = 0;
        var font_size = 0;
        var hostsUnreachable = 0;

        var level = 0;
        var x_pos = 1;


        num_cols = calculateNumCols(hosts.length);

        // num_cols = 17

        // return;


        if (isInFullscreenMode()) {
            font_color = "white"
        } else {
            font_color = "black"
        }

        for (i = 0; i < hosts.length; i++) {

            if (hosts[i]['attrs'].state === 0) {
                color_border = 'green';
                color_background = 'rgba(0, 204, 3, 0.25)'
                font_size = 0;
                hostsUp++;
            } else if (hosts[i]['attrs'].state === 1 && !hosts[i]['attrs'].last_reachable) {
                font_size = 20;
                color_border = "purple";
                color_background = 'rgba(98, 0, 178, 0.25)'
                hostsUnreachable++;

            } else {
                font_size = 20;
                color_border = "red";
                color_background = 'rgba(204, 0, 0, 0.25)'
                hostsDown++;
            }

            if (i % num_cols === 0) {
                level = level + 1;
                x_pos = 0
            } else {
                x_pos += 1;
            }

            nodes.update({
                id: hosts[i].name,
                level: level,
                borderWidth: 2,
                label: hosts[i].name,
                x: x_pos * 205,
                y: level * 205,
                color: {
                    border: color_border,
                    background: color_background
                },

                font: {
                    size: font_size,
                    color: font_color,
                    vadjust: -150
                },

            });
        }

        var networkData = {
            nodes: nodes,
            edges: edges
        };

        var container = document.getElementById('grid-container');

        const networkOptions = {
            nodes: {
                shape: 'square',
                fixed: true,
                size: 100,
                scaling: {
                    min: 1,
                    max: 15,
                    label: {
                        enabled: false,
                        min: 14,
                        max: 30,
                        maxVisible: 30,
                        drawThreshold: 5
                    },

                },
            }
        };

        var network = new vis.Network(container, networkData, networkOptions);

        if (isInFullscreenMode()) {

            fullscreenMode(hosts, network, hostsDown, hostsUp, hostsUnreachable)

        } else {
            startListeners(network)
        }

    }

    processError = (error) => {
        // errors[error['type']] = error['data']
        throw error;
    }

    var hostPromise = getHosts().then(processData, processError)

    function startListeners(network) {

        network.on("click", function (params) { //double click on node listener
            if (params.nodes[0] != undefined) {
                location.href = '/icingaweb2/dependency_plugin/module/statusGrid#!/icingaweb2/monitoring/host/show?host=' + params.nodes[0]; //redirect to host info page.

            }
        });

        network.on('resize', (params) => {

            isBeingDestroyed = (params.width === 0 && params.height === 0)

            if (!isBeingDestroyed) {
                drawGrid()
                network.off();
                network.destroy();
            } else {
                network.off();
                network.destroy();
            }
        })
    }

    function calculatePercentage(num, total) {

        return " (" + Math.round((num / total) * 100) + "%) "

    }

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

            drawGrid();

        }, 60000);
    }

    function fullscreenMode(hosts, network, hostsDown, hostsUp, hostsUnreachable) {

        updateTime();
        var date = new Date();
        var timeUpdated = date;

        $('#hud-down').html("<h1>" + hostsDown + calculatePercentage(hostsDown, hosts.length) + ' Hosts DOWN' + "</h1>");
        $('#hud-unreachable').html('<h1>' + hostsUnreachable + calculatePercentage(hostsUnreachable, hosts.length) + ' Hosts UNREACHABLE' + '</h1>');
        $('#hud-up').html('<h1>' + hostsUp + calculatePercentage(hostsUp, hosts.length) + ' Hosts UP' + '</h1>');
        $('#hud-title').html('<h1>' + timeUpdated + '</h1>');


        $('.controls').hide();
        $('#grid-container').css("background-color", '#262626');
        $('#grid-container').css("height", '90%')
        $('#main').css("width", '100%');
        $('#main').css("height", '100%');
        $('#hud').css('display', 'block');

        startRefreshTimeout(network);

    }

    function isInFullscreenMode() {
        return (window.location.href.indexOf('Fullscreen') > -1)
    }

    function isInMonitoringMode() {
        return (window.location.href.indexOf('monitoring') > -1)
    }

    function calculateNumCols(numHosts) {

        let screenRatio = Math.round(($('#grid-container').innerWidth() / $('#grid-container').innerHeight()) * 10) / 10


        for (i = 0; i < numHosts; i++) {
            for (y = 0; y < numHosts; y++) {
                ratio = Math.round((y / i) * 10) / 10
                total = Math.round(i * y)
                if (ratio === screenRatio) {
                    if (total >= numHosts) {
                        return (y)
                    }
                }
            }
        }
    }
}