// This function opens up a browser when the Upload button is clicked

let uploadFile = function(){
    
    if(cameraStatus){
        $("#camera--trigger").show();

    } else {

            var input = document.createElement('input');
            input.type = 'file';

            input.onchange = e => { 
                var file = e.target.files[0]; 
                // setting up the reader
                    var reader = new FileReader();
                    reader.readAsDataURL(file); // this is reading as data url

                    // here we tell the reader what to do when it's done reading...
                    reader.onload = readerEvent => {
                        var content = readerEvent.target.result; // this is the content!
                        chatContent.innerHTML += '<div class="chatRow html"> <img src="'+content+'" alt="star" width="192" height="192"> </img></div>' ;
                        
                        // document.querySelector('#content').style.backgroundImage = 'url('+ content +')';
                        sendUserInputEvent("Picture Uploaded");
                    }
             }

            input.click();
    
        };




};

function openChatDialog() {
    $(".speechBubble").slideToggle(600);

}