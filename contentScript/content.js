var currentAudio = null;

$(document).ready(function() {
    console.log("ready!");

    chrome.runtime.sendMessage({ type: "check_ac_status" }, function(response) {
        $("audio").each(function() {
            $(this).on("mouseover", function() {
				currentAudio = this;
                timer = setTimeout(() => {
                    destructResult();
                    showResult(this);
                }, 300);
            });
            $(this).on("mouseout", function() {
                clearTimeout(timer);
            });
            // notice that the return will be true when auto conversion is disabled
            if (response == "false") {
				convertAudio(this);
            } else {
                this.title = " Auto conversion disabled, please right click and convert.";
            }
        });
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if(request.type == "convert") {
		convertAudio(currentAudio);
		destructResult();
		showResult(currentAudio);
	}
});

//send request to server and start conversion
function convertAudio(audio) {
	audio.title = " Converting to text...";
    // var that = this;
    STT_handler(audio).then(
        (response) => {
            console.log(response);
            var title_text = "";
            for (var i = 0; i < response.length; i++) {

                title_text = title_text + "Source " + String(i) + ":  \n";
                title_text = title_text + response[i] + "\n\n";
            }
            console.log(title_text);
            audio.title = title_text;		
			// if the container shown and keep focusing on the same audio file,
			// update the content of the container
			var resultShown = document.querySelector(".STTResultText");
			if (resultShown && audio === currentAudio) {
				resultShown.innerHTML = title_text;
			}
        }
    ).catch(message => audio.title = message);
}


//show result in a new container
function showResult(audio) {
    //if(isExist(text)) return;
    var $result = constructBox(audio.title);
    $result.classList.add("result");
	$result.addEventListener("mousedown", dragHandler);
    document.documentElement.appendChild($result);
	//get last position of the result box
	chrome.runtime.sendMessage({ type: "tell_me_the_position" }, function(response) {
        $result.style.left = response.x;
		$result.style.top = response.y;
    });
}

//handle dragging of the content box
function dragHandler(event) {
	var resultContainer = this;
    var x = event.clientX - this.offsetLeft;
    var y = event.clientY - this.offsetTop;
    document.onmousemove = function(event) {
		//calculate gap between the content box and window
        var l = event.clientX - x;
        var t = event.clientY - y;
        if(l < 0) {
            l = 0;
        } else if(l > document.documentElement.clientWidth - resultContainer.offsetWidth) {
            l = document.documentElement.clientWidth - resultContainer.offsetWidth;
        }
        if(t < 0) {
            t = 0;
        } else if(t > document.documentElement.clientHeight - resultContainer.offsetHeight) {
            t = document.documentElement.clientHeight - resultContainer.offsetHeight;
        }
        resultContainer.style.left = l + "px";
        resultContainer.style.top = t + "px";
    }
    document.onmouseup = function() {
		chrome.runtime.sendMessage({ type: "remember_this",
			x: resultContainer.style.left, y: resultContainer.style.top });
        document.onmousemove = null;
        document.onmouseup = null;
    }
}


//construct a new container
function constructBox(text) {
    var $newBox = document.createElement("div");
    $newBox.classList.add("resultBox");
    var $textArea = document.createElement("div");
	$textArea.classList.add("STTResultText");
    $textArea.innerHTML = text;
    $newBox.appendChild($textArea);
    return $newBox;
}


// destruct the existing container
function destructResult() {
	/*
    var contructedContainer = document.querySelector(".resultBox");
    if (contructedContainer) {
        document.documentElement.removeChild(contructedContainer);
    }
	*/
    var result = document.querySelector(".result");
    if (result) {
        document.documentElement.removeChild(result);
    }
}


// mouse click for destructing the container
$("body").on("click", function(event) {
    // get the range of the position of the container
    var contructedContainer = document.querySelector(".resultBox");
    if (contructedContainer) {
        var t = contructedContainer.offsetTop;
        var l = contructedContainer.offsetLeft;
        var height = contructedContainer.offsetHeight;
        var width = contructedContainer.offsetWidth;
        while (contructedContainer = contructedContainer.offsetParent) {
            t += contructedContainer.offsetTop;
            l += contructedContainer.offsetLeft;
        }
        if (event.clientX < l || event.clientX > l + width || event.clientY < t || event.clientY > t + height) {
            destructResult();
        }
    }
});


//response handler
function response_handler(audio, response) {

}






function STT_handler(audio) {
    sources = []
    var src;
    if (audio.src != "") {
        sources.push(audio.src);
    } else {
        $(audio).children("source").each(function() {
            if (this.src != "") {
                sources.push(this.src);
            }
        })
    }

    console.log(sources);

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "STT_content_msg_convet", value: sources }, function(response) {
            console.log(response);
            if (response.complete) {
                console.log(response.value)
                resolve(response.value);
            } else {
                reject("failed to convert this audio");
            }
        });
    });

}