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
		    if (request.type == "check_ac_status") {
			    if(disable_auto_convert) {
				    sendResponse("true");
			    } else {
				    sendResponse("false");
			    }
		    }
        chrome.runtime.sendMessage({ type: "Background_updated_STT", val: 1 });
    });

chrome.runtime.onInstalled.addListener(function() {
	// initialize user's option
    chrome.storage.sync.clear();
    chrome.storage.sync.set({
        "autoCoversion": false
    });
});

$(document).ready(function() {

})