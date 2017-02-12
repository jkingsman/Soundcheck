// define globals
var tone = {
    playing: false,
    frequency: 440,
    phase: 0,
    volume: 100,
    channels: {
        left: true,
        right: true
    },
    waveform: 'sine'
};

// initialize oscillator -- have to a have a function so we can call it on user interaction
// iOS won't let us generate sound unless it's based directly on user interaction
var AudioContext, audioCtx, oscillatorL, oscillatorR, gainNodeL, gainNodeR, mergerNode;
var audioInitialized = false;
function initializeAudio() {
    if (!audioInitialized) {
        audioInitialized = true;
        AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        oscillatorL = audioCtx.createOscillator();
        oscillatorR = audioCtx.createOscillator();

        // connect gain
        gainNodeL = audioCtx.createGain();
        oscillatorL.connect(gainNodeL);

        gainNodeR = audioCtx.createGain();
        oscillatorR.connect(gainNodeR);

        // split channels
        mergerNode = audioCtx.createChannelMerger(2);
        mergerNode.connect(audioCtx.destination);
        gainNodeL.connect(mergerNode, 0, 0);
        gainNodeR.connect(mergerNode, 0, 1);

        // set defaults
        oscillatorL.type = oscillatorR.type = 'sine';
        oscillatorL.frequency.value = oscillatorR.frequency.value = 440;
        gainNodeL.gain.value = gainNodeR.gain.value = 0;

        // start the oscillator
        oscillatorL.start(0);
        oscillatorR.start(0);
    }
}

// handle all changes to the oscillator
function setTone() {
    initializeAudio();
    if (tone.playing) {
        if (tone.channels.left) {
            gainNodeL.gain.value = tone.volume / 100;
        } else {
            gainNodeL.gain.value = 0;
        }

        if (tone.channels.right) {
            gainNodeR.gain.value = tone.volume / 100;
        } else {
            gainNodeR.gain.value = 0;
        }
    } else {
        gainNodeL.gain.value = 0;
        gainNodeR.gain.value = 0;
    }

    oscillatorL.frequency.value = oscillatorR.frequency.value = tone.frequency;
    oscillatorL.type = oscillatorR.type = tone.waveform;

    if (tone.waveform == 'sine') {
        $('input[name="phase"]').attr('disabled', false);

        // set the phase -- thanks to https://medium.com/web-audio/phase-offsets-with-web-audio-wavetables-c7dc85ac3218#.a6fr0iid8
        var real = new Float32Array(2);
        var imag = new Float32Array(2);

        // Lets assume we’re starting with a simple sine wave:
        var a1 = 0.0;
        var b1 = 1.0;

        // Apply a simple rotation to the initial coefficients
        var shift = Math.PI * tone.phase; // Shift the waveform 50%
        real[1] = a1 * Math.cos(shift) - b1 * Math.sin(shift);
        imag[1] = a1 * Math.sin(shift) + b1 * Math.cos(shift);
        var wt = audioCtx.createPeriodicWave(real, imag);

        oscillatorR.setPeriodicWave(wt);
    } else {
        // don't change phase for other tones
        $('input[name="phase"]').attr('disabled', true);
        tone.phase = 0;
        $('#inphase').prop('checked', true);
    }

    drawStatus();
}

document.ontouchend = document.onmousedown = initializeAudio;
