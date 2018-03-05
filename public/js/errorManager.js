function errorHandler(error){

    if(JSON.parse(error['data'])['message'] === 'Setup'){
        $('#notifications').append().html('<li class="error fade-out">No Configuration File Detected, Redirecting to Setup</li>');
        setTimeout(()=>{
            window.location.replace('./kickstart')
        }, 3000)
    }

}