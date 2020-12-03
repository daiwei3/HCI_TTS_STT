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


    // stt
    chrome.contextMenus.create({
        "title": "Convert audio to text",
        "contexts": ["audio"],
        "id": "convert_audio",
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
    } else if (info.menuItemId == "convert_audio") {
        //inject is

        if (info.srcUrl) {

        }


    }
};


chrome.contextMenus.onClicked.addListener(onClickHandler);



// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(Install_Context_menu());