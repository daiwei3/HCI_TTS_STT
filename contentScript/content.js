$(document).ready(function() {
    console.log("ready!");

    $("audio").each(function() {
        this.title = " Converting to text..."
        chrome.runtime.sendMessage({ type: "STT_content_msg_conveting", val: 1 });
        STT_handler(this).then(
            response => response_handler(this, response)
        );
    });




});

//send request to server
async function STT_handler(audio) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ status: "success", result: "success!" });
        }, 2000);
    });

}


//response handler
function response_handler(audio, response) {
    if (response.status == "success") {
        audio.title = response.result;
        //signal to backgournd and popup
        chrome.runtime.sendMessage({ type: "STT_content_msg_success", val: 1 });

    } else {
        audio.title = "failed to convert to audio";
        chrome.runtime.sendMessage({ type: "STT_content_msg_failed", val: 1 });
    }
}