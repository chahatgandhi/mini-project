let audioContext;
let analyser;
let microphone;
let javascriptNode;
let videoElement;
let isPlaying = false;

window.onload = function() {
    videoElement = document.getElementById('myVideo');
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(handleSuccess);
};

function handleSuccess(stream) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);
    javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    javascriptNode.onaudioprocess = processAudio;
}
let lastToggleTimestamp = 0;
const debounceTime = 3000; // 3 seconds debounce time

function processAudio() {
    let array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    let values = 0;

    let length = array.length;
    for (let i = 0; i < length; i++) {
        values += (array[i]);
    }

    let average = values / length;
    let now = Date.now();
    if (average > 30 && now - lastToggleTimestamp > debounceTime) {
        toggleVideo();
        lastToggleTimestamp = now; 
    }
}

function toggleVideo() {
    if (isPlaying) {
        videoElement.pause();
    } else {
        videoElement.play();
    }
    isPlaying = !isPlaying;
}



