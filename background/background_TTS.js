var audioEle = null;

var srcs = [];
var current_play_id = -1;

function API_request(text) {
    console.log(text)
    $.ajax('http://ec2-18-221-142-189.us-east-2.compute.amazonaws.com:5000/text-to-speech', {
        type: 'POST', // http method
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify({ text: text }), // data to submit
        success: function(data, status, xhr) {
            console.log("success");
            console.log(data);

            audioEle.src = "data:audio/wav;base64," + data.src;
            audioEle.play();

            var currentdate = new Date();
            var datetime = currentdate.getDate() + " " +
                currentdate.getHours() + ":" +
                currentdate.getMinutes() + ":" +
                currentdate.getSeconds() + "  " + text;
            srcs.push({ title: datetime, src: "data:audio/wav;base64," + data.src })
            current_play_id = srcs.length;
        },
        error: function(jqXhr, textStatus, errorMessage) {
            console.log("error");
        }
    });
}




$(document).ready(function() {
    audioEle = document.getElementById("TTS_audio_player");
})