function kickstartManager() {


    $.ajax({
        url: "/icingaweb2/dependency_plugin/graph/getResources", //get Icinga Resource List
        type: 'GET',
        success: function (response) {

            var resources = JSON.parse(response);

            var $dropdown = $("#resource-field");

            for (i = 0; i < resources['databases'].length; i++) {
                $dropdown.append("<option value=" + resources['databases'][i] + ">" + resources['databases'][i] + "</option>");
            }

        }
        

    }).then(function () {

        $('form').submit(function (data) {

            var $formData = $("form.settings-form").serializeArray();

            $.ajax({
                url: "/icingaweb2/dependency_plugin/graph/storeSettings",
                type: 'POST',
                data: {
                    json: JSON.stringify($formData)
                },
                success: function () { //on successful POST to settings db, test auth info by getting from Icinga API

                    $.ajax({
                        url: "/icingaweb2/dependency_plugin/graph/getHosts", //get host states
                        type: 'GET',
                        success: function (data) {
                            setTimeout(function () {

                                window.location.replace("./network"); //on succes redirect to network.

                            }, 1000);
                            $("#notification").html(
                                "<div class = notification-content><h3>Settings Saved Succesfully</h3>"
                            ).css({
                                "display": "block",
                            }).delay(5000).fadeOut();
                        },
                        error: function (data) { 
                            console.log(data);
                            alert('Configuration Unsuccessful, Please Check Entered Information\n\n' + data.responseJSON['message']);
                        }

                    })
                }

            });

            return false;
        });

    });

}