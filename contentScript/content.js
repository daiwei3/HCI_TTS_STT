$(document).ready(function() {
    console.log("ready!");

    chrome.runtime.sendMessage({ type: "check_ac_status" }, function(response) {
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
            if (response == "false") {
                this.title = " Converting to text...";
                var that = this;
                STT_handler(this).then(
                    (response) => {
                        console.log(response);
                        var title_text = "";
                        for (var i = 0; i < response.length; i++) {

                            title_text = title_text + "Source " + String(i) + ":  \n";
                            title_text = title_text + response[i] + "\n\n";
                        }
                        console.log(title_text);
                        that.title = title_text;
                    }
                ).catch(message => this.title = message);

            } else {
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