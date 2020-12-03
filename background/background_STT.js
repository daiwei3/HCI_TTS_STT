var STT_converting_Count = 0;
var STT_failed_Count = 0;
var STT_success_Count = 0;
var disable_auto_convert = false;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        console.log(request);
        if (request.type == "STT_content_msg_convet") {
            STT_converting_Count += 1;
            console.log(request.value)
            var src = request.value;

            //connect to server
            console.log(src)
            $.ajax('http://ec2-18-221-142-189.us-east-2.compute.amazonaws.com:5000/speech-to-text', {
                type: 'POST', // http method
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify({ url: src }), // data to submit
                success: function(data, status, xhr) {
                    console.log(data);
                    sendResponse({ complete: true, value: data.text });
                },
                error: function(jqXhr, textStatus, errorMessage) {
                    console.log(errorMessage);
                    sendResponse({ complete: false, value: "Failed to convert" });
                }
            });



        }

        if (request.type == "disable_auto_convert") {
            sendResponse({ complete: true, value: disable_auto_convert });
        }


        chrome.runtime.sendMessage({ type: "Background_updated_STT", val: 1 });
        return true;
    }

);



//CONNECT TO SERVER
function STT_API_request(src) {

}



$(document).ready(function() {

})