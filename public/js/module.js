(function (Icinga) {
    var dependencies;
    var hosts;
    // Double ajax request to getHostsAction() and getDependencyAction() in module php controller file to retrieve JSONs for hosts, dependencies
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
        console.log(hosts);
        console.log(dependencies);
        drawDependencies(hosts, dependencies);
    });

}(Icinga));

