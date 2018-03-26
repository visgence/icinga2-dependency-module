$('.controls').hide();
$('#dependency-network').css("background-color", '#262626');
$('#dependency-network').css("height", '90%')
$('#main').css("width", '100%');
$('#main').css("height", '100%');
$('#hud').css('display', 'block');
$('#layout').addClass('fullscreen-layout');

function drawGrid() {

    processData = (response) => {

        var hosts = response['data']['results']
        var nodes = new vis.DataSet([]);
        var edges = new vis.DataSet([]);
        var color_border = 'green'
        var color_background = '#262626'

        var hostsUp = 0;
        var hostsDown = 0;
        var font_size = 0;
        var hostsUnreachable = 0;

        var level = 0;
        var x_pos = 1;

        for (i = 0; i < hosts.length; i++){

            if (hosts[i]['attrs'].state === 0) {
                color_border = 'green';
                font_size = 0;
                hostsUp++;
            } else if (hosts[i]['attrs'].state === 1 && !hosts[i]['attrs'].last_reachable) {
                font_size = 10;
                color_border = "purple";
                hostsUnreachable++;

            } else {
                font_size = 10;
                color_border = "red";
                hostsDown++;
            }

            if(i % 20 === 0){
                level = level + 1;
                x_pos = 0
            } else {
                x_pos  += 1;
            }

            nodes.update({
                id: hosts[i].name,
                level: level,
                label: hosts[i].name,
                x: x_pos * 105,
                y: level * 105,
                color: {
                    border: color_border,
                    background: color_background
                },

                font: {
                    size: font_size,
                    color: 'white',
                    vadjust: -80
                },

            });
        }

        var networkData = {
            nodes: nodes,
            edges: edges
        };

        var container = document.getElementById('dependency-network');

        const hierarchyOptions = {
            height: '100%',
            autoResize: true,
            width : '100%',
            nodes: {
                shape: 'square',
                fixed: true,
                size:  50,
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

        var network = new vis.Network(container, networkData, hierarchyOptions);
        startRefreshTimeout(network);

        var date = new Date();
        var timeUpdated = date;
    

        $('#hud-down').html("<h1>" + hostsDown + calculatePercentage(hostsDown, hosts.length)  + ' Hosts DOWN' + "</h1>");
        $('#hud-unreachable').html('<h1>' + hostsUnreachable + calculatePercentage(hostsUnreachable, hosts.length) + ' Hosts UNREACHABLE' + '</h1>');
        $('#hud-up').html('<h1>' + hostsUp + calculatePercentage(hostsUp, hosts.length) + ' Hosts UP' + '</h1>');
        $('#hud-title').html('<h1>' + timeUpdated + '</h1>');


        updateTime();
    }

    processError = (error) => {
        // errors[error['type']] = error['data']
        throw error;
    }

    var hostPromise = getHosts().then(processData, processError)


    function calculatePercentage(num, total){

        return " (" + Math.round((num/total) * 100) + "%) "

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
}