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
        if (request.type == "STT_content_msg_conveting") {
            STT_converting_Count += 1;
        }
        if (request.type == "STT_content_msg_success") {
            STT_converting_Count -= 1;
            STT_success_Count += 1;
        }
        if (request.type == "STT_content_msg_failed") {
            STT_converting_Count -= 1;
            STT_failed_Count += 1;
        }
        chrome.runtime.sendMessage({ type: "Background_updated_STT", val: 1 });
    });



$(document).ready(function() {

})