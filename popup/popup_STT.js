$(document).ready(function() {
    //init counts
    $("#converting_audionumber").text(chrome.extension.getBackgroundPage().STT_converting_Count);
    $("#success_audionumber").text(chrome.extension.getBackgroundPage().STT_success_Count);
    $("#failed_audionumber").text(chrome.extension.getBackgroundPage().STT_failed_Count);



    //init diable check box
    if (chrome.extension.getBackgroundPage().disable_auto_convert) {
        $("#disable_SST").prop('checked', true);
    } else {
        $("#disable_SST").prop('checked', false);
    }


    //check box handler
    $('#disable_SST').click(function() {
        if ($(this).is(':checked')) {
            chrome.extension.getBackgroundPage().disable_auto_convert = true;
			      // to local storage
			      chrome.storage.sync.set({
			      	"autoCoversion": false
			      });
			      // update context menu
			      chrome.contextMenus.create({
			      	"title": "Convert audio to text",
			      	"contexts": ["audio"],
			      	"id": "stt"
			      });
              } else {
                  chrome.extension.getBackgroundPage().disable_auto_convert = false;
			      chrome.storage.sync.set({
			      	"autoCoversion": true
			      });
			      chrome.contextMenus.remove("stt");
        }
    });

    //background update listener
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
            if (request.type == "Background_updated_STT") {
                $("#converting_audionumber").text(chrome.extension.getBackgroundPage().STT_converting_Count);
                $("#success_audionumber").text(chrome.extension.getBackgroundPage().STT_success_Count);
                $("#failed_audionumber").text(chrome.extension.getBackgroundPage().STT_failed_Count);
            }

        });
})