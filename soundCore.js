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

// ios only let's us use the audiocontext on user interaction
var oscillatorStarted = false;

// initialize oscillator
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();
var oscillatorL = audioCtx.createOscillator();
var oscillatorR = audioCtx.createOscillator();

// connect gain
var gainNodeL = audioCtx.createGain();
oscillatorL.connect(gainNodeL);

var gainNodeR = audioCtx.createGain();
oscillatorR.connect(gainNodeR);

// connect panners to gain and connect pannets to output
var panNodeL = audioCtx.createStereoPanner();
panNodeL.pan.value = -1;
gainNodeL.connect(panNodeL);
panNodeL.connect(audioCtx.destination);

var panNodeR = audioCtx.createStereoPanner();
panNodeR.pan.value = 1;
gainNodeR.connect(panNodeR);
panNodeR.connect(audioCtx.destination);

// set defaults
oscillatorL.type = oscillatorR.type = 'sine';
oscillatorL.frequency.value = oscillatorR.frequency.value = 440;
gainNodeL.gain.value = gainNodeR.gain.value = 0;

// start the oscillator
oscillatorL.start(0);
oscillatorR.start(0);

// handle all changes to the oscillator
function setTone() {
    if (tone.playing) {
        if(tone.channels.left){
            gainNodeL.gain.value = tone.volume / 100;
        } else {
            gainNodeL.gain.value = 0;
        }

        if(tone.channels.right){
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

    if(tone.waveform == 'sine'){
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