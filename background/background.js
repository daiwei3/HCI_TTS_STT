// text to show in the popup
var stringReturn = "wow! you click an audio";

// The onClicked callback function.
function onClickHandler(info, tab) {
	/*
	// setting changed
    if (info.menuItemId == "radio1" || info.menuItemId == "radio2") {
		// save user's change
		var tts = info.menuItemId == "radio1" ? "whenopen" : "whenclick";
		chrome.storage.sync.set({
			time2save: tts
		});
    } 
	*/
	if (info.menuItemId == "tts") {
		// call tts function here
		return;
    } else {
		// call stt function here
		return;
    }
};

// handle context menu click
chrome.contextMenus.onClicked.addListener(onClickHandler);

// initialize context menu at install time:
/*
TTS/STT
   |─ TTS
   |─ convert
   |─ STT setting
		|─ option1 (radio)
		└─ option2 (radio)
*/
function createmenu(){
    // tts
    // chrome.contextMenus.create({"title": "Convert text to speech", "contexts":["selection"], "id": "tts"});
	// stt
    chrome.contextMenus.create({"title": "Convert audio to text", "contexts":["audio"], "id": "stt", "onclick": convertAudio});
	/*
	// stt options
    chrome.contextMenus.create({"title": "STT options", "id": "sttop"});
    // radio items of stt settiing
    chrome.contextMenus.create({"title": "Convert when page opened", "type": "radio",
                                "parentId": "sttop", "id": "radio1"});
	chrome.contextMenus.create({"title": "Convert when clicked", "type": "radio",
                                "parentId": "sttop", "id": "radio2"});
	*/
}

// handling the convertion of audio
// four status of the audio: original, downloading, converting, converted
function convertAudio(webAudio){
	audioUrl = webAudio.srcUrl;
	if(audioUrl.length <= 0){
		stringReturn = "Audio file invalid.";
		return;
	}
	var format = audioUrl.split(".").pop();
	if(typeof(format) == undefined){
		stringReturn = "Audio file invalid.";
		return;
	}
	// check whether the url is in user's local storage
	chrome.storage.local.get(null, function(result) {
        audioLoaded = result.loadedAudio;
		window.alert(result.loadedAudio);
		var index = audioLoaded.indexOf(audioUrl);
		if(index != -1){
			// audio in the loaded list, find whether it has been download
			chrome.downloads.search({filename:"tempAudio/" + index.toString() + "." + format}, function(audioGot){
				if(Object.keys(audioGot).length == 0){
					// download failed last time, retry
					stringReturn = "Downloading target audio file";
					// start downloading
					chrome.downloads.download({url:audioUrl, filename:"tempAudio/" + index.toString() + "." + format});
				}
				else if(audioGot[0].state != 'complete'){
					// downloading not complete
					stringReturn = "Downloading target audio file";
				}
				else{
					// find whether there's a result for the audio
					chrome.storage.local.get(audioUrl, function (items) {
						if(Object.keys(audioGot).length == 0){
							stringReturn = "waiting for result";
						}
						else
							stringReturn = items.audioUrl;
					});
				}
			});
		} else {
			// the first time an audio is clicked, download and add to the list
			stringReturn = "Downloading target audio file";
			// start downloading
			index = audioLoaded.length;
			chrome.downloads.download({url:audioUrl, filename:"tempAudio/" + index.toString() + "." + format});
			// add loaded audio
			audioLoaded.push(audioUrl);
			result.loadedAudio = audioLoaded;
			chrome.storage.local.set(result);
		}
	});
}

chrome.runtime.onInstalled.addListener(function() {
	/*
	// initialize user's option
	chrome.storage.sync.set({
        time2save: "whenopen"
    });
	*/
	// initialize user storage
	chrome.storage.local.clear();
	chrome.storage.local.set({
        "loadedAudio": []
    });
	chrome.storage.local.get(null, function(items) {
        // If no settings are set
        if (Object.keys(items).length == 0) {
			window.alert("aaa");
            
        } else {
			window.alert(items.loadedAudio);
		}
	});
	
	createmenu();
});

chrome.contextMenus.onClicked.addListener(convertAudio);








