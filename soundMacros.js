function playTone(frequency) {
    $('#frequency').val(frequency);
    tone.frequency = frequency;
    tone.playing = true;
    setTone();
}

var sweepInterval;

function sweep(startFreq, endFreq, seconds) {
    // start with a clean slate
    clearAllMacros();

    var interval = endFreq - startFreq;
    var step = interval / (seconds * 100);
    playTone(startFreq);
    sweepInterval = setInterval(function() {
        playTone(tone.frequency + step);
        if (tone.frequency > endFreq) {
            playTone(endFreq);
            clearInterval(sweepInterval);
            tone.playing = false;
            setTone();
        }
    }, 10);
}

var pulseInterval;

function LRPulse() {
    // start with a clean slate
    clearAllMacros();
    
    // set base case
    var pulse = 1;
    tone.channels.left = true;
    tone.channels.right = false;
    playTone(300);

    pulseInterval = setInterval(function() {
        if (pulse === 0) {
            pulse = 1;
            $('#leftChannel').prop('checked', true);
            $('#rightChannel').prop('checked', false);
            tone.channels.left = true;
            tone.channels.right = false;
            playTone(300);
        } else {
            pulse = 0;
            $('#leftChannel').prop('checked', false);
            $('#rightChannel').prop('checked', true);
            tone.channels.left = false;
            tone.channels.right = true;
            playTone(900);
        }
    }, 1000);
}

function clearAllMacros() {
    clearInterval(sweepInterval);
    clearInterval(pulseInterval);

    $('#leftChannel').prop('checked', true);
    $('#rightChannel').prop('checked', true);

    tone.channels.left = true;
    tone.channels.right = true;
    tone.playing = false;
    setTone();
}
