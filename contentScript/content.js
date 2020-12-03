$(document).ready(function() {
    console.log("ready!");

    //check if auto convert is on
    chrome.runtime.sendMessage({ type: "disable_auto_convert", value: 1 }, function(response) {
        console.log(response.value);
        //auto convert allowed
        if (!response.value) {
            $("audio").each(function() {

                this.title = " Converting to text..."
                var div = document.createElement("div");
                div.innerText = " Converting to text..."

                div.style.backgroundColor = "#fc8c03";
                div.style.borderRadius = "5px";
                div.style.paddingLef = "50px";
                div.style.color = "white";
                div.style.margin = "20";
                /* 
                div.style.position = "absolute"
                div.style.zIndex = "9999"
                $(div).fadeOut(0);

                $(this).hover(function() {
                    $(div).fadeIn()
                    $(this).mousemove(function(event) {
                        var msg = "Handler for .mousemove() called at ";
                        msg += event.pageX + ", " + event.pageY;

                    });


                }, function() {
                    $(div).fadeOut()
                })
                */

                $(this).after(div)
                convert_audio(this, div).catch(e => {
                    console.log(e);
                });
            });


        }
    });

    $(document.body).find('audio[src="https://6a63fca904fd268f15f7-d5770ffdd579eb31eaa89faeffc55fe7.ssl.cf1.rackcdn.com/LE_listening_A1_A_request_from_your_boss.mp3"]').each(function() {
        console.log(this);
    });

});

function convert_audio(audio, div) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "STT_content_msg_convet", value: audio.src }, function(response) {
            console.log(response);
            if (response.complete) {
                div.innerText = response.value;
                resolve();

            } else {
                div.innerText = response.value;
                reject("failed");
            }


        });
    });

}