$('#play').on('mousedown', function() {
    $('#play').hide();
    $('#pause').show();
    tone.playing = true;
    setTone();
});

$('#pause').on('click', function() {
    $('#play').show();
    $('#pause').hide();
    tone.playing = false;
    setTone();
});

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

$('#waveformSelection').on('change', function() {
    tone.waveform = $("input[name='waveform']:checked")[0].value;
    setTone();
});

$('#phaseSelection').on('change', function() {
    tone.phase = $("input[name='phase']:checked")[0].value;
    setTone();
});

$('#volume').on('input', function() {
    tone.volume = $('#volume').val();
    setTone();
});

$('#frequency').on('input', function() {
    tone.frequency = $('#frequency').val();
    setTone();
});

function drawStatus() {
    $('#statusFreq').text(tone.frequency);
    $('#statusPhase').html(tone.phase == 0 ? 'in phase' : tone.phase + '&pi; out of phase');
    $('#statusPlaying').text(tone.playing ? 'Playing' : 'Paused');
    $('#statusVolume').text(tone.volume);
    $('#statusWaveform').text(tone.waveform);

    // hand channel settings
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

// initial draw
drawStatus();
