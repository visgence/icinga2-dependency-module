function errorHandler(error) {

    if (error['data']) {

        if (JSON.parse(error['data'])['message'] === 'Setup') {
            $('#notifications').append().html('<li class="error fade-out">No Configuration File Detected, Redirecting to Setup</li>');
            setTimeout(() => {
                window.location.replace('./kickstart')
            }, 3000)
        }
    }else{
        console.log(error)

        $('#notifications').append().html('<li class="error fade-out">' + error['responseJSON']['message'] + '</li>');
    }

}