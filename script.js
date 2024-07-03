const myCanvas = document.getElementById('myCanvas');
const myAudio = document.getElementById('myAudio');
const myCtx = myCanvas.getContext('2d');

myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;

const myAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
const myAudioSource = myAudioCtx.createMediaElementSource(myAudio);
const myAnalyser = myAudioCtx.createAnalyser();

myAudioSource.connect(myAnalyser);
myAnalyser.connect(myAudioCtx.destination);

myAnalyser.fftSize = 256;
const myBufferLength = myAnalyser.frequencyBinCount;
const myDataArray = new Uint8Array(myBufferLength);

function myFrequencyToColor(value) {
    const hue = (value / 255) * 360;
    return `hsl(${hue}, 100%, 50%)`;
}

function myDraw() {
    requestAnimationFrame(myDraw);

    myAnalyser.getByteFrequencyData(myDataArray);

    myCtx.fillStyle = '#000';
    myCtx.fillRect(0, 0, myCanvas.width, myCanvas.height);

    const barWidth = (myCanvas.width / myBufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < myBufferLength; i++) {
        barHeight = myDataArray[i];
        myCtx.fillStyle = myFrequencyToColor(barHeight);
        myCtx.fillRect(x, myCanvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
    }
}

myAudio.addEventListener('play', () => {
    myAudioCtx.resume();
    myDraw();
});
