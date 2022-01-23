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

        // create new audio context
        AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // create oscillators for our channels
        oscillatorL = audioCtx.createOscillator();
        oscillatorR = audioCtx.createOscillator();

        // connect gain
        gainNodeL = audioCtx.createGain();
        oscillatorL.connect(gainNodeL);

        gainNodeR = audioCtx.createGain();
        oscillatorR.connect(gainNodeR);

        // merge channels for stereo
        mergerNode = audioCtx.createChannelMerger(2);
        mergerNode.connect(audioCtx.destination);
        gainNodeL.connect(mergerNode, 0, 0); // left channel
        gainNodeR.connect(mergerNode, 0, 1); // right channel

        // set defaults
        oscillatorL.type = oscillatorR.type = 'sine';
        oscillatorL.frequency.value = oscillatorR.frequency.value = 440;
        gainNodeL.gain.value = gainNodeR.gain.value = 0;

        // start the oscillator
        oscillatorL.start(0);
        oscillatorR.start(0);
    }
}

// handle all changes to the oscillator; will make the audio reflect the tone data
function setTone() {
    initializeAudio(); // skipped over by initializeAudio() once done for the first time; probably not needed

    if (tone.playing) {
        // we're playing audio
        if (tone.channels.left) {
            // level left channel
            gainNodeL.gain.value = tone.volume / 100;
        } else {
            // mute left channel if it's disabled
            gainNodeL.gain.value = 0;
        }

        if (tone.channels.right) {
            // level right channel
            gainNodeR.gain.value = tone.volume / 100;
        } else {
            // mute right channel if it's disabled
            gainNodeR.gain.value = 0;
        }
    } else {
        // we're not playing -- mute everything
        gainNodeL.gain.value = 0;
        gainNodeR.gain.value = 0;
    }

    // sync the oscillators to the requested freq and waveform
    oscillatorL.frequency.value = oscillatorR.frequency.value = tone.frequency;
    oscillatorL.type = oscillatorR.type = tone.waveform;

    if (tone.waveform == 'sine') {
        // enable the phase options since it's a sine wave
        $('input[name="phase"]').attr('disabled', false);

        // this handles phase setup
        // thanks to https://medium.com/web-audio/phase-offsets-with-web-audio-wavetables-c7dc85ac3218#.a6fr0iid8
        var real = new Float32Array(2);
        var imag = new Float32Array(2);

        // factors for simple sine
        var a1 = 0.0;
        var b1 = 1.0;

        // Apply a simple rotation to the initial coefficients
        var shift = Math.PI * tone.phase; // Shift the waveform by (pi * phaseshift)
        real[1] = a1 * Math.cos(shift) - b1 * Math.sin(shift);
        imag[1] = a1 * Math.sin(shift) + b1 * Math.cos(shift);
        var wt = audioCtx.createPeriodicWave(real, imag); // create the waveform

        oscillatorR.setPeriodicWave(wt); // set the right channel to use the waveform
    } else {
        // don't allow any other waveforms to change the phase offset because I haven't written them
        $('input[name="phase"]').attr('disabled', true);

        // set phase selection and data to 0
        tone.phase = 0;
        $('#inphase').prop('checked', true);
    }

    // update the status bar
    drawStatus();
}

// screw you iOS. Have to run this to enable audio directly due to user interaction
// short circuits in the function if it's already been called
document.ontouchend = document.onmousedown = initializeAudio;
