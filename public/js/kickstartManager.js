function kickstartManager() {


    $.ajax({
        url: "/icingaweb2/dependency_plugin/graph/getResources", //get node positions
        type: 'GET',
        success: function (response) {

            var resources = JSON.parse(response);

            // console.log(resources);

            var $dropdown = $("#resource-field");

            for (i = 0; i < resources['databases'].length; i++) {
                $dropdown.append("<option value=" + resources['databases'][i] + ">" + resources['databases'][i] + "</option>");
            }

        }

    }).then(function (resources) {

        // console.log('then');

        $('form').submit(function (data) {

            var $formData =$("form.settings-form").serializeArray();

            $.ajax({
                url: "/icingaweb2/dependency_plugin/graph/storeSettings",
                type: 'POST',
                data: {
                json: JSON.stringify($formData)
                },
                success: function () {
                    $("#notification").html(
                        "<div class = notification-content><h3>Settings Saved Succesfully</h3>"
                    ).css({
                        "display": "block",
                    }).delay(5000).fadeOut();
                }
            });

        })

    })

}