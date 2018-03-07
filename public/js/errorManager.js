function errorHandler(error) {

    if (error['data']) {

        console.log(error)

        if (JSON.parse(error['data'])['message'] === 'Setup') {
            $('#notifications').append().html('<li class="error fade-out">No Configuration File Detected, Redirecting to Setup</li>');
            setTimeout(() => {
                window.location.replace('./kickstart')
            }, 3000)
        }else {
            $('#notifications').append().html('<li class="error fade-out">' + JSON.parse(error['data'])['message'] + '</li>');
        }

    }else{

        $('#notifications').append().html('<li class="error fade-out">' + error['responseJSON']['message'] + '</li>');
    }


}