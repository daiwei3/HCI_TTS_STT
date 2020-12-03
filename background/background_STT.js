var STT_converting_Count = 0;
var STT_failed_Count = 0;
var STT_success_Count = 0;
var disable_auto_convert = true;

// initialize auto conversion flag
chrome.storage.sync.get(null, function(items) {
    if (Object.keys(items).length == 0) {
        alert("something wrong with the storage...");
    } else {
        disable_auto_convert = items.autoCoversion == false ? true : false;
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        console.log(request);
        if (request.type == "STT_content_msg_convet") {
            STT_converting_Count += 1;
            console.log(request.value)
            var sources = request.value;


            //connect to server
            $.ajax('http://ec2-18-221-142-189.us-east-2.compute.amazonaws.com:5000/speech-to-text', {
                type: 'POST', // http method
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify({ urls: sources }), // data to submit
                success: function(data, status, xhr) {
                    console.log(data);
                    sendResponse({ complete: true, value: data.text });
                    STT_success_Count = STT_success_Count + 1;
                },
                error: function(jqXhr, textStatus, errorMessage) {
                    console.log(errorMessage);
                    sendResponse({ complete: false, value: "Failed to convert" });
                    STT_failed_Count = STT_failed_Count + 1;
                }
            });



        }

        if (request.type == "disable_auto_convert") {
            sendResponse({ complete: true, value: disable_auto_convert });
        }
        if (request.type == "check_ac_status") {
            if (disable_auto_convert) {
                sendResponse("true");
            } else {
                sendResponse("false");
            }
        }
        chrome.runtime.sendMessage({ type: "Background_updated_STT", val: 1 });
        return true;
    }

);





chrome.runtime.onInstalled.addListener(function() {
    // initialize user's option
    chrome.storage.sync.clear();
    chrome.storage.sync.set({
        "autoCoversion": false
    });
});

$(document).ready(function() {

})