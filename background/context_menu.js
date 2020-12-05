// initialize context menu at install time:
/*
TTS/STT
   |─ TTS
   |─ convert
   |─ STT setting
		|─ option1 (radio)
		└─ option2 (radio)
*/


function Install_Context_menu() {
    // Create one tts selection in menu
    console.log("init context menu ");
    // tts
    chrome.contextMenus.create({
        "title": "Convert to audio",
        "contexts": ["selection"],
        "id": "Convert_to_audio",
    });

    chrome.contextMenus.create({
        "title": "Stop/Play audio",
        "contexts": ["page"],
        "id": "Stop_Play_audio_player",
    });


    // stt, context menu section created in the first time
    chrome.contextMenus.create({
        "title": "Convert audio to text",
        "contexts": ["audio"],
        "id": "stt"
    });


}

//click event handler
function onClickHandler(info, tab) {
    console.log(info);
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
    getSelection()

    if (info.menuItemId == "Convert_to_audio") {

        API_request(info.selectionText);

    } else if (info.menuItemId == "Stop_Play_audio_player") {
        //Play or stop audio
        if (audioEle.paused) {
            audioEle.play();
        } else {
            audioEle.pause();
        }
    } else if (info.menuItemId == "stt") {
        //tell content script to convert this audio
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {type:"convert"});
		});
    }
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(Install_Context_menu());
