function cameraSetup(){

    // The following code adds camera-related elements to the page

    $('body').append($("<div>",{id:"camera"})
        .append($("<canvas>",{id:"camera--sensor"}))
        .append($("<video>",{id:"camera--view"}).attr('playsinline',true).attr('autoplay',true))
        .append($("<img>",{id:"camera--output", src:"//:0",alt:""}))
        .append($("<button>",{id:"camera--trigger", text: "Take a picture"}))
        );

    // Set constraints for the video stream
    var constraints = { video: { facingMode: "environment" }, audio: false };
    // Define constants
    const cameraView = document.querySelector("#camera--view"),
        cameraOutput = document.querySelector("#camera--output"),
        cameraSensor = document.querySelector("#camera--sensor"),
        cameraTrigger = document.querySelector("#camera--trigger")
    // Access the device camera and stream to cameraView
    function cameraStart() {
            console.log("entered camera start");
    // $("#camera--trigger").attr('type','none');       
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(function(stream) {
                track = stream.getTracks()[0];
                cameraView.srcObject = stream;
                cameraStatus = true;

            }).catch(function(error) {
                    console.error("Oops. Something is broken.", error);
                    cameraStatus = false;
                    console.log("user denied");
            });
}


// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
    chatContent.innerHTML += '<div class="chatRow html"> <img src="'+cameraOutput.src+'" alt="star" width="192" height="192"> </img></div>' ;
    
    // Code to add : Add code here to determine what gets done when the picture gets uploaded 
    
    sendUserInputEvent("Picture Uploaded");
    $(this).hide();
    };
                        // Start the video stream when the window loads
                    cameraStart();
                    // Hide the camera icon at the start
                    $("#camera--trigger").hide();
                    

}




