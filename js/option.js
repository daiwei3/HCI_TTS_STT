// init the option window when clicked
function init() {
	/*
	// restore user's option from storage
    chrome.storage.sync.get(null, function (items) {
        if (Object.keys(items).length == 0) {
            items = {
                time2save: "whenopen",
            };
            chrome.storage.sync.set({
                time2save: "whenopen"
            });
        }
		// show the value that the user has chosen
        if (items.time2save === "whenopen") {
            document.querySelector("#wo").checked = true;
        } else
            document.querySelector("#wc").checked = true;
		// save user's option when user click the check box
        document.querySelector("#wo").onchange = function (event) {
            save_options();
        };
        document.querySelector("#wc").onchange = function (event) {
            save_options();
        };
    });
	*/
	// inject script to count the audio number
	chrome.tabs.executeScript({code: returnAN});
	var background = chrome.extension.getBackgroundPage();
	var textArea = document.getElementById("result");
	textArea.textContent = background.stringReturn;
}

const returnAN =
	`var audioNumber = document.getElementsByTagName("audio").length;
	 chrome.runtime.sendMessage({type: "aun", value: audioNumber});`;


// save user's option when check box chosen
function save_options() {
	var tts = "";
	var elements = document.getElementsByName("uniquetab");
    for (var i = 0; i < elements.length; i++)
        if (elements[i].checked)
			tts = elements[i].value;
    chrome.storage.sync.set({
        time2save: tts
    });
}

window.addEventListener("load", init);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if(request.type == "aun"){
		var test = document.getElementById("audionumber");
		test.textContent = request.value;
	}
});








