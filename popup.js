var audio;
var srcs;



//play audio
function play_audio() {
    if (audio.readyState != 0) {
        audio.play();
        $("#play_pause_icon").removeClass('fa-play-circle');
        $("#play_pause_icon").addClass('fa-pause-circle');
    }
}

//pause audio
function pause_audio() {
    audio.pause();
    $("#play_pause_icon").removeClass('fa-pause-circle');
    $("#play_pause_icon").addClass('fa-play-circle');
}

//update the time label of audio
function update_time_label() {
    var date = new Date(0);
    var current_time = "00:00:00";
    var duration = "00:00:00";
    date.setSeconds(audio.currentTime);
    current_time = date.toISOString().substr(11, 8);

    if (audio.duration != null && audio.duration != Infinity && audio.duration != NaN) {
        date.setSeconds(audio.duration);
        duration = date.toISOString().substr(11, 8)
        document.getElementById("audio_duration_bar").disabled = false;
        document.getElementById("audio_duration_bar").value = audio.currentTime;
        document.getElementById("audio_duration_bar").max = audio.duration;
    } else {
        document.getElementById("audio_duration_bar").disabled = true;
    }
    document.getElementById("current_time_label").innerText = current_time;
    document.getElementById("duration_label").innerText = duration;
}



$(function() {
    audio = chrome.extension.getBackgroundPage().audioEle;
    srcs = chrome.extension.getBackgroundPage().srcs;

    /**initilize window components**/
    console.log(audio.paused)

    //init play / pause icon
    if (audio.paused) {
        $("#play_pause_icon").removeClass('fa-pause-circle');
        $("#play_pause_icon").addClass('fa-play-circle');

    } else {
        $("#play_pause_icon").removeClass('fa-play-circle');
        $("#play_pause_icon").addClass('fa-pause-circle');
    }

    if (audio.readyState == 0) {
        document.getElementById("audio_duration_bar").disabled = true;
    } else {
        update_time_label();
    }

    //audio volume
    document.getElementById("audio_volume_bar").value = audio.volume * document.getElementById("audio_volume_bar").max;


    //init src list
    for (var i = 0; i < srcs.length; i++) {
        console.log(srcs[i]);
        var newOption = new Option(srcs[i].title, srcs[i].src);
        document.getElementById("srcs").appendChild(newOption);
    }




    //audio contols
    $("#play_button").click(function() {
        if (audio.paused && audio.readyState != 0) {
            play_audio();
        } else if (!audio.paused) {
            pause_audio();
        }

    });
    $("#stop_button").click(function() {
        pause_audio();
        audio.currentTime = 0;
    });

    //drag duration bar action handler
    var onDrag_duration_bar = false;
    $("#audio_duration_bar").on('mousedown', function(event) {
        onDrag_duration_bar = true;
    });
    $("#audio_duration_bar").on('mouseup', function(event) {
        onDrag_duration_bar = false;
        audio.currentTime = $(this).val();
        console.log($(this).val());
    });

    //drag duration bar action handler
    var onDrag_volume_bar = false;
    $("#audio_volume_bar").on('mousedown', function(event) {
        onDrag_volume_bar = true;
    });
    $("#audio_volume_bar").on('mouseup', function(event) {
        onDrag_volume_bar = false;
        audio.volume = this.value / this.max;
    });


    //secltion list action handler
    document.getElementById('srcs').ondblclick = function() {
        audio.scr = this.options[this.selectedIndex].value;
        audio.load();
        play_audio();
    };


    //time label update
    audio.ontimeupdate = function() {
        console.log(onDrag_duration_bar)
        if (onDrag_duration_bar) {
            return;
        }
        try {
            update_time_label();
        } catch (error) {
            document.getElementById("current_time_label").innerText = "00:00:00";
            document.getElementById("duration_label").innerText = "00:00:00";
        }


    }


});