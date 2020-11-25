var myAudio = new Audio();
myAudio.src = "https://6a63fca904fd268f15f7-d5770ffdd579eb31eaa89faeffc55fe7.ssl.cf1.rackcdn.com/LE_listening_A1_A_request_from_your_boss.mp3";

function onClickHandler(info, tab) {
    console.log(info);
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));

    getSelection()
    console.log(info.selectionText);
    if (info.menuItemId == "Convert_to_audio") {
        //TODO
    } else if (info.menuItemId == "Stop_Play_audio_player") {
        if (myAudio.paused) {
            myAudio.play();
        } else {
            myAudio.pause();
        }
    }
};



chrome.contextMenus.onClicked.addListener(onClickHandler);


// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
    // Create one tts selection in menu

    var id = chrome.contextMenus.create({
        "title": "Convert to audio",
        "contexts": ["selection"],
        "id": "Convert_to_audio",
    });

    var id = chrome.contextMenus.create({
        "title": "Stop/Play audio",
        "contexts": ["page"],
        "id": "Stop_Play_audio_player",
    });



});