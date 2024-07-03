const myCanvas = document.getElementById('myCanvas');
const myAudio = document.getElementById('myAudio');
const myPlayButton = document.getElementById('playButton');
const myStopButton = document.getElementById('stopButton');
const myForwardButton = document.getElementById('forwardButton');
const myCtx = myCanvas.getContext('2d');


myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;

let myAudioCtx;
let myAudioSource;
let myAnalyser;
let myBufferLength;
let myDataArray;


function initializeAudio() {
    myAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    myAudioSource = myAudioCtx.createMediaElementSource(myAudio);
    myAnalyser = myAudioCtx.createAnalyser();
    myAudioSource.connect(myAnalyser);
    myAnalyser.connect(myAudioCtx.destination);
    myAnalyser.fftSize = 256;
    myBufferLength = myAnalyser.frequencyBinCount;
    myDataArray = new Uint8Array(myBufferLength);
}


function myFrequencyToColor(value) {
    const hue = (value / 255) * 360;
    return `hsl(${hue}, 100%, 50%)`;
}


function myDraw() {
    if (myAudio.paused) return;

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


myPlayButton.addEventListener('click', () => {
    if (!myAudioCtx) {
        initializeAudio();
    }
    if (myAudioCtx.state === 'suspended') {
        myAudioCtx.resume();
    }
    myAudio.play();
    myDraw();
});

myStopButton.addEventListener('click', () => {
    myAudio.pause();
    myAudio.currentTime = 0;
});

myForwardButton.addEventListener('click', () => {
    myAudio.currentTime += 10;
});


window.addEventListener('resize', () => {
    myCanvas.width = window.innerWidth;
    myCanvas.height = window.innerHeight;
});
