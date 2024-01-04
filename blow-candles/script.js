document.addEventListener('DOMContentLoaded', function() {
    var age = prompt("Enter your age:");
    var cake = document.getElementById("cake");

    for (var i = 0; i < age; i++) {
        var candle = document.createElement("div");
        candle.className = "candle";
        candle.style.left = (i * 15) + "px";

        var flame = document.createElement("div");
        flame.className = "flame";

        candle.appendChild(flame);
        cake.appendChild(candle);
    }

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(processAudioStream)
        .catch(error => {
            console.error('Error accessing microphone', error);
        });
});

function processAudioStream(stream) {
    var audioContext = new AudioContext();
    var analyser = audioContext.createAnalyser();
    var microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    function analyze() {
        requestAnimationFrame(analyze);
        analyser.getByteFrequencyData(dataArray);

        var total = 0;
        for (var i = 0; i < bufferLength; i++) {
            total += dataArray[i];
        }

        var average = total / bufferLength;

        var intensityLevel = Math.floor(average / 128 * document.getElementsByClassName("flame").length);
        blowOutCandles(intensityLevel);
    }

    analyze();
}

function blowOutCandles(number) {
    var flames = Array.from(document.getElementsByClassName("flame"));
    flames.slice(0, number).forEach(function(flame) {
        flame.style.display = "none";
    });
}
