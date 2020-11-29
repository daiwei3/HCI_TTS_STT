var audioEle = null;
var stopped = true;
var srcs = [];



function onClickHandler(info, tab) {
    console.log(info);
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));

    getSelection()
    console.log(info.selectionText);
    if (info.menuItemId == "Convert_to_audio") {
        //TODO
        stopped = false;
        //audioEle.src = "http://radio-contact.ice.infomaniak.ch/radio-contact-high.mp3";
        audioEle.src = "https://6a63fca904fd268f15f7-d5770ffdd579eb31eaa89faeffc55fe7.ssl.cf1.rackcdn.com/LE_listening_A1_A_request_from_your_boss.mp3";


        var currentdate = new Date();
        var datetime = currentdate.getDate() + " " +
            currentdate.getHours() + ":" +
            currentdate.getMinutes() + ":" +
            currentdate.getSeconds();
        srcs.push({ title: datetime, src: "https://6a63fca904fd268f15f7-d5770ffdd579eb31eaa89faeffc55fe7.ssl.cf1.rackcdn.com/LE_listening_A1_A_request_from_your_boss.mp3" })

    } else if (info.menuItemId == "Stop_Play_audio_player") {
        //Play or stop audio

        if (audioEle.paused) {
            audioEle.play();
        } else {
            audioEle.pause();
        }
    }
};


chrome.contextMenus.onClicked.addListener(onClickHandler);


$(document).ready(function() {
    audioEle = document.getElementById("TTS_audio_player");
})