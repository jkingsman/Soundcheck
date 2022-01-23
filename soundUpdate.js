// handle play and pause
$('#play').on('click', function() {
    tone.playing = true;
    setTone();
});

$('#pause').on('click', function() {
    stopAllSound();
});

// handle speaker selection
$('#rightChannel').on('click', function() {
    if ($('#rightChannel').prop('checked')) {
        tone.channels.right = true;
    } else {
        tone.channels.right = false;
    }
    setTone();
});

$('#leftChannel').on('click', function() {
    if ($('#leftChannel').prop('checked')) {
        tone.channels.left = true;
    } else {
        tone.channels.left = false;
    }
    setTone();
});

// set waveform and phase
$('#waveformSelection').on('change', function() {
    tone.waveform = $("input[name='waveform']:checked")[0].value;
    setTone();
});

$('#phaseSelection').on('change', function() {
    tone.phase = $("input[name='phase']:checked")[0].value;
    setTone();
});

// set volume
$('#volume').on('input', function() {
    tone.volume = Number($('#volume').val());
    setTone();
});

// set frequency
$('#frequency').on('input', function() {
    // cancel macros if we're going freeform
    stopMacros();

    tone.frequency = Number($('#frequency').val());
    setTone();
});

// draw the status bar at the bottom
function drawStatus() {
    // show the appropriate play/pause button
    if (tone.playing) {
        $('#play').hide();
        $('#pause').show();
    } else {
        $('#play').show();
        $('#pause').hide();
    }

    // round off frequency
    $('#statusFreq').text((Math.round(tone.frequency * 100) / 100).toFixed());

    // show pi multiples out of phase
    $('#statusPhase').html(tone.phase === 0 ? 'in phase' : tone.phase + '&pi; out of phase');

    $('#statusPlaying').text(tone.playing ? 'Playing' : 'Paused');
    $('#statusVolume').text(tone.volume);
    $('#statusWaveform').text(tone.waveform);

    // show channel settings
    var channels = '';
    if (tone.channels.left) {
        channels += 'L';
    }

    if (tone.channels.right) {
        channels += 'R';
    }

    if (!tone.channels.right && !tone.channels.left) {
        channels = 'No';
    }

    $('#statusChannels').text(channels);
}

// initial draw on page load
drawStatus();
