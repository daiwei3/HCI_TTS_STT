//the GUI DIV
var div = document.createElement("div");
div.style.position = "fixed";
div.style.width = "300";
div.style.height = "100";
div.style.right = "0";
div.style.bottom = "0";
div.style.zIndex = "9999";
div.id = "MY_TTS_AUDIO_DIV"


//audio
var audio = document.createElement("audio");
audio.id = "MY_TTS_AUDIO_CONTROL"
audio.controls = 'controls';


//loader
var loader = document.createElement("div");
loader.style.border = "10px solid #f3f3f3";
loader.style.borderTop = "10px solid #3498db";
loader.style.borderRadius = "50%";
loader.style.width = "25px";
loader.style.height = "25px";
loader.style.animation = "spin 2s linear infinite";
loader.id = "MY_TTS_AUDIO_LOADER";
const spinkeyframes = ` 
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`
const style = document.createElement('style')
style.type = 'text/css';
style.innerHTML = spinkeyframes;

document.head.appendChild(style);
document.body.appendChild(div);

document.getElementById('MY_TTS_AUDIO_DIV').appendChild(audio);
document.getElementById('MY_TTS_AUDIO_DIV').appendChild(loader);
$("#MY_TTS_AUDIO_DIV").fadeOut(0);