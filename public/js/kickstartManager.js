function kickstartManager() {


    $.ajax({
        url: "/icingaweb2/dependency_plugin/graph/getResources", //get node positions
        type: 'GET',
        success: function (response) {

            var resources = JSON.parse(response);

            console.log(resources);

            var $dropdown = $("#resource");

            for (i = 0; i < resources['databases'].length; i++) {
                $dropdown.append("<option value=" + resources['databases'][i] + ">" + resources['databases'][i] + "</option>");
            }

            if(resources['user']){
                $port = $("#port-field");
                $port.attr("placeholder", resources['address']).val('');

                $apiUser = $('#user-field');
                $apiUser.attr("placeholder", resources['user']).val('');

                $password = $('password-field');
                $password.attr('placeholder', '(use stored passwod)').val('');
            }

            }
        
    }).then(function (resources) {


        
    

    })





}