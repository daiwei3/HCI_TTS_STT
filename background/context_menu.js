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

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(Install_Context_menu());

