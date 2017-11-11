(function (Icinga) {

    var dependencies;
    var hosts;
    // Double ajax request to getHostsAction() and getDependencyAction() in module php controller file to retrieve JSONs for hosts, dependencies


    timeout();

    function timeout() {
        
        setTimeout(function () {

            if (window.location.href.endsWith('network')) {

                var layout = 'network';

                $.when(
                    $.ajax({
                        url: "/icingaweb2/dependency_plugin/graph/getHosts",
                        type: 'GET',
                        success: function (hostData) {
                            hosts = (JSON.parse(hostData));
                        }
                    }),

                    $.ajax({
                        url: "/icingaweb2/dependency_plugin/graph/getDependency",
                        type: 'GET',
                        success: function (dependencyData) {
                            dependencies = (JSON.parse(dependencyData));
                        }
                    })
                ).then(function () {
                    if (dependencies === 404) {
                        alert("API Authentication Not Found, Please run Setup API command on host machine");
                    } else {
                        console.log(hosts, dependencies);
                        drawDependencies(hosts, dependencies, layout);
                    }
                });


                networkExitTimeout();

            }

            else if (window.location.href.endsWith('hierarchy')) {

                var layout = 'hierarchical';

                $.when(
                    $.ajax({
                        url: "/icingaweb2/dependency_plugin/graph/getHosts",
                        type: 'GET',
                        success: function (hostData) {
                            hosts = (JSON.parse(hostData));
                        }
                    }),

                    $.ajax({
                        url: "/icingaweb2/dependency_plugin/graph/getDependency",
                        type: 'GET',
                        success: function (dependencyData) {
                            dependencies = (JSON.parse(dependencyData));
                        }
                    })
                ).then(function () {
                    if (dependencies === 404) {
                        alert("API Authentication Not Found, Please run Setup API command on host machine");
                    } else {
                        console.log(hosts, dependencies);
                        drawDependencies(hosts, dependencies, layout);
                    }
                });

                hierarchyExitTimeout();
            
            } 
            
            else {

                timeout();
            }
        }, 1000);

    }

    function hierarchyExitTimeout() {
        setTimeout(function () {

            if (!(window.location.href.endsWith('hierarchy'))) {
                timeout();
            } else {
                hierarchyExitTimeout();
            }
        }, 1000);

    }      
    function networkExitTimeout() {
        setTimeout(function () {

            if (!(window.location.href.endsWith('network'))) {
                timeout();
            } else {
                networkExitTimeout();
            }
        }, 1000);

    } 


}(Icinga));