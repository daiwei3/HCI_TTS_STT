var timer = null;

$(document).ready(function() {
    console.log("ready!");
	// message to background to check the status of the auto conversion flag
	chrome.runtime.sendMessage({type: "check_ac_status"}, function(response) {
		$("audio").each(function() {
			$(this).on("mouseover", function() {
				timer = setTimeout(() => {
					destructResult();
					showResult(this);
				}, 300);
			});
			$(this).on("mouseout", function() {
				clearTimeout(timer);
			});
			// notice that the return will be true when auto conversion is disabled
			if(response == "false") {
				this.title = " Converting to text...";
				chrome.runtime.sendMessage({ type: "STT_content_msg_conveting", val: 1 });
				STT_handler(this).then(
					response => response_handler(this, response)
				);
			}else {
				this.title = " Auto conversion disabled, please right click and convert.";
			}
		});	
	});
    
});


//show result in a new container
function showResult(audio) {
	//if(isExist(text)) return;
    var $result = constructBox(audio.title);
    $result.classList.add("result");
    document.documentElement.appendChild($result);
	$result.style.left = "10px";
	$result.style.top = "50px";
}


//construct a new container
function constructBox(text) {
    var $newBox = document.createElement("div");
    $newBox.classList.add("resultBox");
    var $textArea = document.createElement("div");
    $textArea.innerHTML = text;
    $newBox.appendChild($textArea);
    return $newBox;
};


// destruct the existing container
function destructResult() {
	var contructedContainer = document.querySelector(".resultBox");
    if (contructedContainer) {
        document.documentElement.removeChild(contructedContainer);
    }
	var result = document.querySelector(".result");
    if (result) {
        document.documentElement.removeChild(result);
    }
}


// mouse click for destructing the container
$("body").on("click", function(event) {
	// get the range of the position of the container
    var contructedContainer = document.querySelector(".resultBox");
	if(contructedContainer) {
		var t = contructedContainer.offsetTop;   
		var l = contructedContainer.offsetLeft;   
		var height = contructedContainer.offsetHeight;   
		var width  = contructedContainer.offsetWidth;
		while(contructedContainer = contructedContainer.offsetParent){
			t += contructedContainer.offsetTop;   
			l += contructedContainer.offsetLeft;   
		}
		if (event.clientX < l || event.clientX > l + width || event.clientY < t || event.clientY > t + height) {
			destructResult();
		}
	}
});


//send request to server
async function STT_handler(audio) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ status: "success", result: "success!!" });
        }, 2000);
    });

}


//response handler
function response_handler(audio, response) {
    if (response.status == "success") {
        audio.title = response.result;
        //signal to backgournd and popup
        chrome.runtime.sendMessage({ type: "STT_content_msg_success", val: 1 });

    } else {
        audio.title = "failed to convert to audio";
        chrome.runtime.sendMessage({ type: "STT_content_msg_failed", val: 1 });
    }
}