// play a tone of the given frequency
function playTone(frequency) {
    // update UI to match
    $('#frequency').val(frequency);

    // set frequency, play it, fire the tone
    tone.frequency = frequency;
    tone.playing = true;
    setTone();
}

var sweepInterval; // id of the sweep interval for easy cancel
function sweep(startFreq, endFreq, seconds) {
    // start with a clean slate
    stopAllSound();

    var interval = endFreq - startFreq; // total range to cover
    var step = interval / (seconds * 100); // compute Hz per time step

    playTone(startFreq);
    sweepInterval = setInterval(function() {
        playTone(tone.frequency + step); // up the tone
        if (tone.frequency > endFreq) {
            // we've hit our goal; end it
            playTone(endFreq);
            clearInterval(sweepInterval);
            tone.playing = false;
            setTone();
        }
    }, 10);
}


var pulseInterval; // id of the pulse interval for easy cancel
function LRPulse() {
    // start with a clean slate
    stopAllSound();

    // set base case
    var pulse = 1;
    tone.channels.left = true;
    tone.channels.right = false;
    playTone(300);

    pulseInterval = setInterval(function() {
        // alternate every second between left and right
        if (pulse === 0) {
            pulse = 1;
            //update UI
            $('#leftChannel').prop('checked', true);
            $('#rightChannel').prop('checked', false);

            // update data structure
            tone.channels.left = true;
            tone.channels.right = false;

            // play the tone
            playTone(300);
        } else {
            pulse = 0;
            //update UI
            $('#leftChannel').prop('checked', false);
            $('#rightChannel').prop('checked', true);

            // update data structure
            tone.channels.left = false;
            tone.channels.right = true;

            // play the tone
            playTone(900);
        }
    }, 1000);
}

function stopMacros(){
    // clear all interval
    clearInterval(sweepInterval);
    clearInterval(pulseInterval);
}

function stopAllSound() {
    stopMacros();

    // restore channel selection UI
    $('#leftChannel').prop('checked', true);
    $('#rightChannel').prop('checked', true);

    // restore channels in data structure
    tone.channels.left = true;
    tone.channels.right = true;

    // kill the sound
    tone.playing = false;
    setTone();
}
