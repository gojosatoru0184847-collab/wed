const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq, dur, vol, type) {
    if (type === undefined) type = 'sine';
    try {
        initAudio();
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + dur);
    } catch (e) {}
}

function clickSound() { playTone(800, 0.08, 1.0); }
function successSound() {
    playTone(1000, 0.08, 0.9);
    setTimeout(function() { playTone(1200, 0.08, 0.9); }, 80);
    setTimeout(function() { playTone(1400, 0.08, 0.9); }, 160);
    setTimeout(function() { playTone(1600, 0.1, 0.9); }, 240);
    setTimeout(function() { playTone(1800, 0.12, 0.8); }, 340);
    setTimeout(function() { playTone(2000, 0.15, 0.7); }, 460);
}
function errorSound() { playTone(300, 0.18, 1.0, 'sawtooth'); }
function downloadSound() { playTone(1000, 0.06, 0.9); setTimeout(function() { playTone(1300, 0.06, 0.9); }, 80); setTimeout(function() { playTone(1600, 0.08, 0.9); }, 160); }
function toggleSound() { playTone(500, 0.05, 0.9); }