var LICENSE_KEY = 'tranduc_2026_license';
var MAX_DEVICES = 5;

var songList = [
    { name: '🎵 Cause Love You', file: 'music/music-1.mp4' },
    { name: '🎵 Good For You x one of the girl', file: 'music/music-2.mp4' }
];

var currentSongIndex = 0;
var isPlaying = false;
var isDragging = false;
var audio = new Audio();
var musicInitialized = false;
var userInteracted = false;
var songEnded = false;
var checkInterval = null;
var isDurationLoaded = false;

var playBtn, nextBtn, songName, songStatus, progressFill, progressBar, volumeControl, songCounter, bgStatus;
var musicToggleBtn;

function initMusicPlayer() {
    playBtn = document.getElementById('playBtn');
    nextBtn = document.getElementById('nextBtn');
    songName = document.getElementById('songName');
    songStatus = document.getElementById('songStatus');
    progressFill = document.getElementById('progressFillPlayer');
    progressBar = document.getElementById('progressBarPlayer');
    volumeControl = document.getElementById('volumeControl');
    songCounter = document.getElementById('songCounter');
    bgStatus = document.getElementById('bgStatus');
    musicToggleBtn = document.getElementById('musicToggleBtn');

    if (!playBtn) {
        console.log('❌ Music Player: Khong tim thay playBtn');
        return;
    }
    console.log('✅ Music Player initialized');

    if (musicToggleBtn) {
        musicToggleBtn.textContent = '🔊 Bat nhac';
        musicToggleBtn.style.cssText = 'background:transparent;border:1px solid #1a3a6a;color:#4a8acc;padding:6px 16px;border-radius:50px;cursor:pointer;font-family:Orbitron,monospace;font-size:11px;transition:all 0.3s;';
        
        musicToggleBtn.addEventListener('click', function() {
            if (isPlaying) {
                // TẮT NHẠC
                audio.pause();
                isPlaying = false;
                playBtn.textContent = '▶';
                musicToggleBtn.textContent = '🔊 Bat nhac';
                musicToggleBtn.style.borderColor = '#1a3a6a';
                musicToggleBtn.style.color = '#4a8acc';
                if (songStatus) songStatus.textContent = '⏸ Da tat';
                if (bgStatus) {
                    bgStatus.textContent = '⏸ OFF';
                    bgStatus.style.borderColor = '#ff4466';
                    bgStatus.style.color = '#ff4466';
                }
                console.log('🔇 Da tat nhac');
                clearInterval(checkInterval);
            } else {
                // BẬT NHẠC
                musicToggleBtn.textContent = '🔊 Dang bat...';
                musicToggleBtn.style.borderColor = '#4aff88';
                musicToggleBtn.style.color = '#4aff88';
                
                if (!audio.src) {
                    playSong(0);
                } else {
                    var playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.then(function() {
                            isPlaying = true;
                            playBtn.textContent = '⏸';
                            musicToggleBtn.textContent = '🔊 Bat nhac';
                            musicToggleBtn.style.borderColor = '#4aff88';
                            musicToggleBtn.style.color = '#4aff88';
                            if (songStatus) songStatus.textContent = '▶ Dang phat';
                            if (bgStatus) {
                                bgStatus.textContent = '▶ BG';
                                bgStatus.style.borderColor = '#4aff88';
                                bgStatus.style.color = '#4aff88';
                            }
                            console.log('🔊 Da bat nhac');
                            startCheckInterval();
                        }).catch(function(e) {
                            musicToggleBtn.textContent = '🔊 Bat nhac';
                            musicToggleBtn.style.borderColor = '#ffcc44';
                            musicToggleBtn.style.color = '#ffcc44';
                            if (songStatus) songStatus.textContent = '🖱️ Click Play';
                            console.log('❌ Khong the bat nhac:', e.message);
                        });
                    }
                }
            }
        });
    }

    function startCheckInterval() {
        clearInterval(checkInterval);
        // Đợi duration load xong mới bắt đầu kiểm tra
        isDurationLoaded = false;
        
        audio.addEventListener('loadedmetadata', function onLoaded() {
            isDurationLoaded = true;
            audio.removeEventListener('loadedmetadata', onLoaded);
        });
        
        // Nếu duration đã có sẵn
        if (audio.duration && audio.duration > 0) {
            isDurationLoaded = true;
        }
        
        checkInterval = setInterval(function() {
            // Chỉ kiểm tra khi đã load xong duration và đang phát
            if (isPlaying && !audio.paused && isDurationLoaded && audio.duration > 0) {
                var remaining = audio.duration - audio.currentTime;
                // Chỉ chuyển khi còn dưới 1.5s và bài chưa kết thúc
                if (remaining <= 1.5 && remaining > 0 && !songEnded) {
                    songEnded = true;
                    console.log('⏰ Tu dong chuyen bai (con ' + remaining.toFixed(2) + 's)');
                    var nextIndex = (currentSongIndex + 1) % songList.length;
                    clearInterval(checkInterval);
                    playSong(nextIndex);
                }
            }
        }, 500);
    }

    function playSong(index) {
        clearInterval(checkInterval);
        songEnded = false;
        isDurationLoaded = false;
        
        if (index >= songList.length) {
            currentSongIndex = 0;
            index = 0;
        }
        currentSongIndex = index;
        
        var songFile = songList[index].file;
        
        console.log('🎵 Dang phat bai ' + (index + 1) + ':', songFile);
        
        audio.src = songFile;
        songName.textContent = songList[index].name;
        songCounter.textContent = (index + 1) + '/' + songList.length;
        audio.volume = volumeControl ? volumeControl.value / 100 : 0.7;

        // Khi load xong metadata thì mới bật check
        audio.addEventListener('loadedmetadata', function onLoaded() {
            isDurationLoaded = true;
            audio.removeEventListener('loadedmetadata', onLoaded);
        });

        var playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(function() {
                isPlaying = true;
                playBtn.textContent = '⏸';
                if (musicToggleBtn) {
                    musicToggleBtn.textContent = '🔊 Bat nhac';
                    musicToggleBtn.style.borderColor = '#4aff88';
                    musicToggleBtn.style.color = '#4aff88';
                }
                if (songStatus) songStatus.textContent = '▶ Dang phat';
                if (bgStatus) {
                    bgStatus.textContent = '▶ BG';
                    bgStatus.style.borderColor = '#4aff88';
                    bgStatus.style.color = '#4aff88';
                }
                console.log('✅ Dang phat thanh cong!');
                // Bắt đầu check sau 2s để đảm bảo duration đã load
                setTimeout(function() {
                    startCheckInterval();
                }, 2000);
            }).catch(function(e) {
                isPlaying = false;
                playBtn.textContent = '▶';
                if (musicToggleBtn) {
                    musicToggleBtn.textContent = '🔊 Bat nhac';
                    musicToggleBtn.style.borderColor = '#ffcc44';
                    musicToggleBtn.style.color = '#ffcc44';
                }
                if (songStatus) songStatus.textContent = '🖱️ Click Play';
                if (bgStatus) {
                    bgStatus.textContent = '⏸ Pause';
                    bgStatus.style.borderColor = '#ffcc44';
                    bgStatus.style.color = '#ffcc44';
                }
                console.log('❌ Loi phat nhac:', e.message);
            });
        }
    }

    // ===== PLAY/PAUSE =====
    playBtn.addEventListener('click', function() {
        userInteracted = true;
        console.log('🖱️ User clicked Play');
        
        if (!audio.src) {
            playSong(0);
            return;
        }
        
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playBtn.textContent = '▶';
            clearInterval(checkInterval);
            if (musicToggleBtn) {
                musicToggleBtn.textContent = '🔊 Bat nhac';
                musicToggleBtn.style.borderColor = '#1a3a6a';
                musicToggleBtn.style.color = '#4a8acc';
            }
            if (songStatus) songStatus.textContent = '⏸ Tam dung';
            if (bgStatus) {
                bgStatus.textContent = '⏸ Pause';
                bgStatus.style.borderColor = '#ffcc44';
                bgStatus.style.color = '#ffcc44';
            }
        } else {
            var playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    isPlaying = true;
                    playBtn.textContent = '⏸';
                    if (musicToggleBtn) {
                        musicToggleBtn.textContent = '🔊 Bat nhac';
                        musicToggleBtn.style.borderColor = '#4aff88';
                        musicToggleBtn.style.color = '#4aff88';
                    }
                    if (songStatus) songStatus.textContent = '▶ Dang phat';
                    if (bgStatus) {
                        bgStatus.textContent = '▶ BG';
                        bgStatus.style.borderColor = '#4aff88';
                        bgStatus.style.color = '#4aff88';
                    }
                    setTimeout(function() {
                        startCheckInterval();
                    }, 2000);
                }).catch(function(e) {
                    if (songStatus) songStatus.textContent = '❌ Khong phat duoc';
                    console.error('Play error:', e);
                });
            }
        }
    });

    // ===== NEXT SONG =====
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            userInteracted = true;
            clearInterval(checkInterval);
            var nextIndex = (currentSongIndex + 1) % songList.length;
            console.log('⏭ Chuyen sang bai ' + (nextIndex + 1));
            playSong(nextIndex);
        });
    }

    // ===== ENDED EVENT =====
    audio.addEventListener('ended', function() {
        clearInterval(checkInterval);
        songEnded = true;
        console.log('⏭ Bai hat ket thuc (ended event)');
        var nextIndex = (currentSongIndex + 1) % songList.length;
        playSong(nextIndex);
    });

    // ===== ERROR =====
    audio.addEventListener('error', function(e) {
        console.error('❌ LOI AUDIO:', audio.error ? audio.error.message : 'unknown');
        if (songStatus) {
            songStatus.textContent = '❌ Loi file nhac';
            songStatus.style.color = '#ff4466';
        }
        // Thử chuyển bài sau 2s
        setTimeout(function() {
            var nextIndex = (currentSongIndex + 1) % songList.length;
            playSong(nextIndex);
        }, 2000);
    });

    // ===== VOLUME =====
    if (volumeControl) {
        volumeControl.addEventListener('input', function() {
            audio.volume = this.value / 100;
        });
    }

    // ===== PROGRESS =====
    audio.addEventListener('timeupdate', function() {
        if (!isDragging && audio.duration && progressFill) {
            var percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = percent + '%';
        }
    });

    if (progressBar) {
        progressBar.addEventListener('click', function(e) {
            if (!audio.duration) return;
            userInteracted = true;
            var rect = this.getBoundingClientRect();
            var percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * audio.duration;
            if (progressFill) progressFill.style.width = (percent * 100) + '%';
        });

        progressBar.addEventListener('mousedown', function() {
            isDragging = true;
        });
    }

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // ===== KEEP ALIVE =====
    setInterval(function() {
        if (isPlaying && audio.paused) {
            if (userInteracted) {
                audio.play().catch(function() {});
            }
        }
    }, 5000);

    // ===== START =====
    setTimeout(function() {
        console.log('🎵 Thu phat bai dau...');
        playSong(0);
    }, 500);

    musicInitialized = true;
}

// ===== CLICK TO ENABLE =====
document.addEventListener('click', function enableAudio() {
    if (!userInteracted) {
        userInteracted = true;
        console.log('🖱️ User interacted (click)');
        if (!isPlaying && audio.src) {
            audio.play().catch(function() {});
        }
    }
}, { once: false });

document.addEventListener('touchstart', function enableAudioTouch() {
    if (!userInteracted) {
        userInteracted = true;
        console.log('👆 User interacted (touch)');
        if (!isPlaying && audio.src) {
            audio.play().catch(function() {});
        }
    }
}, { once: false });









function getMachineId() {
    try {
        var ua = window.navigator.userAgent || '';
        var screen = (window.screen || {}).width + 'x' + (window.screen || {}).height || '';
        var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        var lang = navigator.language || 'en';
        var raw = ua + screen + tz + lang;
        var hash = 0;
        for (var i = 0; i < raw.length; i++) {
            var char = raw.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        var mid = Math.abs(hash).toString(16).toUpperCase();
        while (mid.length < 16) mid = '0' + mid;
        var parts = mid.match(/.{1,4}/g) || [mid];
        return parts.join('-');
    } catch (e) {
        return 'UNKNOWN-' + Date.now().toString(16).toUpperCase();
    }
}

function getLicenseData() {
    try {
        var data = localStorage.getItem(LICENSE_KEY);
        if (data) return JSON.parse(data);
    } catch (e) {}
    return null;
}

function getKeyList() {
    try {
        var data = localStorage.getItem('tranduc_keys');
        if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
}

function findKeyInfo(key) {
    var list = getKeyList();
    for (var i = 0; i < list.length; i++) {
        if (list[i].key === key) {
            return list[i];
        }
    }
    return null;
}

function updateKeyStatus(key, status) {
    try {
        var keyList = JSON.parse(localStorage.getItem('tranduc_keys') || '[]');
        for (var i = 0; i < keyList.length; i++) {
            if (keyList[i].key === key) {
                keyList[i].status = status;
                break;
            }
        }
        localStorage.setItem('tranduc_keys', JSON.stringify(keyList));
    } catch (e) {}
}

function addActivationLog(key, machineId) {
    try {
        var logs = JSON.parse(localStorage.getItem('tranduc_activation_logs') || '[]');
        var now = new Date();
        var dateStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
        var timeStr = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
        logs.push({
            key: key,
            machineId: machineId,
            time: dateStr + ' ' + timeStr,
            userAgent: window.navigator.userAgent || 'Unknown'
        });
        localStorage.setItem('tranduc_activation_logs', JSON.stringify(logs));
    } catch (e) {}
}

function addMachineToLicense(key, machineId) {
    var keyInfo = findKeyInfo(key);
    if (!keyInfo) {
        return { success: false, msg: 'Key khong ton tai trong he thong!' };
    }
    
    var maxDev = keyInfo.maxDev || MAX_DEVICES;
    
    var data = getLicenseData();
    if (!data) {
        data = { key: key, machines: [machineId] };
    } else {
        if (data.machines.indexOf(machineId) === -1) {
            if (data.machines.length >= maxDev) {
                return { success: false, msg: 'Key da dat so may toi da (' + maxDev + ' may)' };
            }
            data.machines.push(machineId);
        }
    }
    localStorage.setItem(LICENSE_KEY, JSON.stringify(data));
    updateKeyStatus(key, 'used');
    addActivationLog(key, machineId);
    return { success: true, msg: 'Kich hoat thanh cong! So may da dung: ' + data.machines.length + '/' + maxDev };
}

function verifyLicense(key, machineId) {
    if (!key || key.length < 8) return false;
    if (key.indexOf('TRANDUC') !== 0) return false;
    var parts = key.split('-');
    if (parts.length < 3) return false;
    var keyInfo = findKeyInfo(key);
    if (!keyInfo) return false;
    return true;
}

function isLicensed() {
    var data = getLicenseData();
    if (!data) return false;
    var mid = getMachineId();
    if (!data.machines || data.machines.indexOf(mid) === -1) return false;
    return verifyLicense(data.key, mid);
}

function showLicenseDialog() {
    var oldOverlay = document.querySelector('.license-overlay');
    if (oldOverlay) oldOverlay.remove();

    var overlay = document.createElement('div');
    overlay.className = 'license-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);display:flex;justify-content:center;align-items:center;z-index:99999;';

    var box = document.createElement('div');
    box.style.cssText = 'background:#111822;border:2px solid #00aaff;border-radius:16px;padding:40px;max-width:480px;width:90%;text-align:center;box-shadow:0 0 80px rgba(0,170,255,0.15);';

    var mid = getMachineId();
    box.innerHTML = `
    <div style="position:relative;margin-bottom:16px;">
        <div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#004466;padding:3px 18px;border-radius:50px;font-size:9px;font-weight:700;color:#00d4ff;letter-spacing:2px;text-transform:uppercase;border:1px solid #00d4ff;box-shadow:0 0 20px rgba(0,212,255,0.2);">⚡ NEON SECURE</div>
        <div style="width:72px;height:72px;margin:14px auto 0;background:radial-gradient(circle,#004466,#001a2a);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:34px;border:2px solid #00d4ff;box-shadow:0 0 40px rgba(0,212,255,0.25),inset 0 0 30px rgba(0,212,255,0.05);">🔑</div>
    </div>
    <h2 style="color:#fff;margin-bottom:4px;font-size:24px;font-weight:800;letter-spacing:1px;text-shadow:0 0 30px rgba(0,212,255,0.15);">NHAP KEY</h2>
    <p style="color:#6a9aba;font-size:13px;margin-bottom:4px;letter-spacing:0.5px;">Nhap key ban quyen de kich hoat</p>
    <p style="color:#4a7a8a;font-size:11px;margin-bottom:14px;">Key se duoc gan voi may tinh cua ban</p>
    <div style="background:rgba(0,10,20,0.8);padding:8px 14px;border-radius:8px;margin-bottom:14px;border:1px solid rgba(0,212,255,0.15);display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:inset 0 0 30px rgba(0,212,255,0.03);">
        <span style="color:#4a7a8a;font-size:11px;">🖥️</span>
        <span style="color:#8ab0c0;font-size:12px;font-family:monospace;letter-spacing:0.5px;text-shadow:0 0 10px rgba(0,212,255,0.05);">${mid}</span>
    </div>
    <input type="text" id="licenseInput" placeholder="TRANDUC-XXXX-XXXX-XXXX" 
           style="width:100%;padding:14px 16px;background:#0a0a18;border:2px solid #1a3344;color:#d0e8f0;border-radius:10px;font-size:16px;text-align:center;font-family:monospace;margin:0 0 12px 0;outline:none;transition:all 0.3s;letter-spacing:0.5px;"
           onfocus="this.style.borderColor='#00d4ff';this.style.boxShadow='0 0 30px rgba(0,212,255,0.15),inset 0 0 30px rgba(0,212,255,0.03)';"
           onblur="this.style.borderColor='#1a3344';this.style.boxShadow='none';">
    <button id="activateBtn" 
            style="width:100%;padding:14px;background:linear-gradient(135deg,#003355,#0088bb);border:1px solid #00d4ff;border-radius:10px;color:#fff;font-size:16px;font-weight:700;cursor:pointer;margin:0 0 12px 0;transition:all 0.3s;box-shadow:0 0 30px rgba(0,212,255,0.1),inset 0 0 30px rgba(0,212,255,0.03);text-shadow:0 0 20px rgba(0,212,255,0.3);letter-spacing:1px;"
            onmouseover="this.style.transform='scale(1.02)';this.style.boxShadow='0 0 50px rgba(0,212,255,0.25),inset 0 0 30px rgba(0,212,255,0.05)';this.style.borderColor='#00e8ff';"
            onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 0 30px rgba(0,212,255,0.1),inset 0 0 30px rgba(0,212,255,0.03)';this.style.borderColor='#00d4ff';">
        ⚡ KICH HOAT NGAY
    </button>
    <p id="licenseMsg" style="color:#ff6b6b;font-size:13px;margin:6px 0 12px;min-height:20px;font-weight:500;text-shadow:0 0 20px rgba(255,100,100,0.1);"></p>
    <div style="display:flex;gap:10px;align-items:center;justify-content:center;padding-top:14px;border-top:1px solid rgba(0,212,255,0.08);">
        <span style="color:#4a7a8a;font-size:12px;letter-spacing:0.5px;">Chua co key?</span>
        <a href="https://zalo.me/0584429837" target="_blank" 
           style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#004466,#006688);color:#fff;padding:8px 22px;border-radius:50px;text-decoration:none;font-size:13px;font-weight:600;border:1px solid #00d4ff;box-shadow:0 0 30px rgba(0,212,255,0.1);transition:all 0.3s;letter-spacing:0.5px;"
           onmouseover="this.style.transform='scale(1.04)';this.style.boxShadow='0 0 50px rgba(0,212,255,0.25)';this.style.borderColor='#00e8ff';"
           onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 0 30px rgba(0,212,255,0.1)';this.style.borderColor='#00d4ff';">
            💬 MUA KEY ZALO
        </a>
    </div>
    <div style="margin-top:12px;text-align:center;">
        <span style="color:#1a4a5a;font-size:10px;letter-spacing:1px;">▰▰▰ NEON SYSTEM v2.0 ▰▰▰</span>
    </div>
`;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    var input = document.getElementById('licenseInput');
    var msg = document.getElementById('licenseMsg');

    document.getElementById('activateBtn').addEventListener('click', function() {
        var key = input.value.trim();
        var mid2 = getMachineId();

        if (!key) {
            msg.style.color = '#ff6b6b';
            msg.textContent = '❌ Vui long nhap key!';
            return;
        }

        if (!verifyLicense(key, mid2)) {
            msg.style.color = '#ff6b6b';
            msg.textContent = '❌ Key khong ton tai hoac khong hop le!';
            return;
        }

        var result = addMachineToLicense(key, mid2);
        if (result.success) {
            msg.style.color = '#00ff88';
            msg.textContent = '✅ ' + result.msg;
            setTimeout(function() {
                overlay.remove();
                initTool();
            }, 1000);
        } else {
            msg.style.color = '#ff6b6b';
            msg.textContent = '❌ ' + result.msg;
        }
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') document.getElementById('activateBtn').click();
    });

    setTimeout(function() { input.focus(); }, 300);
}

var state = {
    selected: new Set(),
    files: [],
    totalSize: 0,
    startTime: 0,
    isGenerating: false
};

var $ = function(id) { return document.getElementById(id); };
var log = $('logArea');
var fileTags = $('fileTags');
var totalDisplay = $('totalFilesDisplay');
var avgSize = $('avgSize');
var genTime = $('genTime');
var selectedDisplay = $('selectedFuncs');
var progressBar = $('progressBar');
var progressFill = $('progressFill');
var fileCountInput = $('fileCount');
var prefixInput = $('classPrefix');

var jsZipLoaded = false;
var CDN_LIST = [
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
    'https://unpkg.com/jszip@3.10.1/dist/jszip.min.js'
];

function loadJSZip(callback, index) {
    if (index === undefined) index = 0;
    if (typeof JSZip !== 'undefined') {
        jsZipLoaded = true;
        callback();
        return;
    }
    if (index >= CDN_LIST.length) {
        alert('Khong the tai JSZip. Vui long kiem tra ket noi mang.');
        return;
    }
    var script = document.createElement('script');
    script.src = CDN_LIST[index];
    script.onload = function() { jsZipLoaded = true; callback(); };
    script.onerror = function() { loadJSZip(callback, index + 1); };
    document.head.appendChild(script);
}

function isRealBrowser() {
    if (typeof window === 'undefined') return false;
    if (typeof window.navigator === 'undefined') return false;
    var ua = window.navigator.userAgent || '';
    if (ua.indexOf('Koder') !== -1) return false;
    if (ua.indexOf('Mobile') !== -1 && ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) {
        if (typeof window.webkit !== 'undefined' && typeof window.webkit.messageHandlers !== 'undefined') {
            return false;
        }
    }
    var realBrowsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
    var isReal = false;
    for (var i = 0; i < realBrowsers.length; i++) {
        if (ua.indexOf(realBrowsers[i]) !== -1) { isReal = true; break; }
    }
    if (ua.indexOf('Safari') !== -1 && ua.indexOf('Version') === -1 && ua.indexOf('Chrome') === -1) {
        isReal = false;
    }
    var webviews = ['Electron', 'CEF', 'WebView', 'Headless', 'PhantomJS', 'QtWebEngine'];
    for (var j = 0; j < webviews.length; j++) {
        if (ua.indexOf(webviews[j]) !== -1) { isReal = false; break; }
    }
    if (isReal) {
        try {
            if (typeof window.localStorage === 'undefined') isReal = false;
            if (typeof window.document === 'undefined') isReal = false;
            if (typeof window.cefQuery !== 'undefined') isReal = false;
            if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') isReal = false;
            if (typeof window.webkit !== 'undefined' && typeof window.webkit.messageHandlers !== 'undefined') isReal = false;
        } catch (e) { isReal = false; }
    }
    return isReal;
}

document.querySelectorAll('.btn-func').forEach(function(btn) {
    btn.addEventListener('click', function() {
        toggleSound();
        var func = this.dataset.func;
        if (state.selected.has(func)) {
            state.selected.delete(func);
            this.classList.remove('active');
        } else {
            state.selected.add(func);
            this.classList.add('active');
        }
        selectedDisplay.textContent = state.selected.size ? 
            Array.from(state.selected).join(', ') : 'chua chon';
    }, { passive: true });
});

var nameArray = [
    "DamTamSung","NangTamSung","ChimTamSung","SauTamSung","DayTamSung",
    "TamSungNang","TamSungDay","TamSungSau","TamSungChim","TamSungDam",
    "CoDinhTam","GiuTam","NeoTam","GhimTam","DongTam","CamTam","BamTam",
    "DinhTam","MocTam","TreoTam","TamSungCung","TamSungChac","TamSungVung",
    "TamSungKien","TamSungRan","FixTamSung","StabilizeAim","SolidAim",
    "FirmAim","HeavyAim","FixCung","CungHoa","CungFix","CungAim","CungLock",
    "CungTam","CungSung","CungHead","CungBody","CungTarget","FixCungAim",
    "FixCungLock","FixCungHead","FixCungBody","FixCungTarget","CungAimPro",
    "CungLockPro","CungHeadPro","CungBodyPro","CungFixPro","CungHoaAim",
    "CungHoaLock","CungHoaHead","CungHoaBody","CungHoaTarget","AimCung",
    "LockCung","HeadCung","BodyCung","TargetCung","ToiUuTam","ToiUuSung",
    "ToiUuAim","ToiUuLock","ToiUuHead","ToiUuHoa","OptimizeAim","OptimizeLock",
    "OptimizeHead","OptimizeBody","ToiGianTam","ToiGianSung","ToiGianAim",
    "ToiGianLock","ToiGianHead","TinhGonTam","TinhGonSung","TinhGonAim",
    "TinhGonLock","TinhGonHead","ThuGonTam","ThuGonSung","ThuGonAim",
    "ThuGonLock","ThuGonHead","SacNetTam","SacNetSung","SacNetAim",
    "SacNetLock","SacNetHead","CanChinhTam","CanChinhSung","CanChinhAim",
    "CanChinhLock","CanChinhHead","ChinhTam","ChinhSung","ChinhAim",
    "ChinhLock","ChinhHead","HieuChinh","AdjustAim","AdjustLock","AdjustHead",
    "AdjustBody","CalibrateAim","CalibrateLock","CalibrateHead","CalibrateBody",
    "CalibrateTarget","TinhChinh","FineTuneAim","FineTuneLock","FineTuneHead",
    "FineTuneBody","ChuanHoa","StandardizeAim","StandardizeLock","StandardizeHead",
    "StandardizeBody","CanBangTam","CanBangSung","CanBangAim","CanBangLock",
    "CanBangHead","ThangBang","BalanceAim","BalanceLock","BalanceHead",
    "BalanceBody","CanChinh","Equilibrium","StableAim","StableLock","StableHead",
    "VungVang","SteadyAim","SteadyLock","SteadyHead","SteadyBody","CungCap",
    "RobustAim","RobustLock","RobustHead","RobustBody","ChacChan","SolidLock",
    "SolidHead","SolidBody","SolidAim","BuTruTam","BuTruSung","BuTruAim",
    "BuTruLock","BuTruHead","BuDap","CompensateAim","CompensateLock",
    "CompensateHead","CompensateBody","BuGiat","RecoilComp","RecoilFix",
    "RecoilKill","RecoilStop","BuTre","LagComp","DelayComp","PingComp",
    "LatencyComp","BuSai","ErrorFix","ErrorComp","ErrorKill","ErrorStop",
    "BuChinh","OffsetFix","OffsetComp","OffsetKill","OffsetStop","TangTocTam",
    "TangTocSung","TangTocAim","TangTocLock","TangTocHead","TangTocDo",
    "SpeedBoost","FastAim","FastLock","FastHead","ButToc","TurboAim",
    "TurboLock","TurboHead","TurboBody","VutToc","RapidAim","RapidLock",
    "RapidHead","RapidBody","PhiToc","QuickAim","QuickLock","QuickHead",
    "QuickBody","SieuToc","UltraAim","UltraLock","UltraHead","UltraBody",
    "GiamTocTam","GiamTocSung","GiamTocAim","GiamTocLock","GiamTocHead",
    "HamToc","SlowAim","SlowLock","SlowHead","SlowBody","PhanhAim","BrakeAim",
    "BrakeLock","BrakeHead","BrakeBody","GiamNhay","LowerSensi","LowSensi",
    "SensiLow","SensiSlow","ChamLai","Decelerate","DecelAim","DecelLock",
    "DecelHead","NheNhang","GentleAim","GentleLock","GentleHead","GentleBody",
    "TangNhay","TangSensi","SensiUp","SensiHigh","SensiMax","NhayHon",
    "MoreSensi","ExtraSensi","SuperSensi","UltraSensi","NhayBen","SharpSensi",
    "CrispSensi","CleanSensi","PureSensi","BenNhay","Responsive","Reactive",
    "ReflexSensi","InstinctSensi","SieuNhay","HyperSensi","MegaSensi",
    "GigaSensi","TerraSensi","VoCuc","InfiniteSensi","GodSensi","KingSensi",
    "LegendSensi","GiamGiat","GiamLag","GiamRung","GiamTre","GiamDelay",
    "ChongGiat","ChongLag","ChongRung","ChongTre","ChongDelay","KhuGiat",
    "KhuLag","KhuRung","KhuTre","KhuDelay","DietGiat","DietLag","DietRung",
    "DietTre","DietDelay","SmoothPlay","SmoothGame","SmoothFPS","SmoothScreen",
    "SmoothAim","StableFPS","StableGame","StablePlay","StableAim","StableLock",
    "LagFixPro","LagKillPro","LagStopPro","LagZeroPro","LagOffPro","NoLagGod",
    "NoLagKing","NoLagMaster","NoLagUltra","NoLagMax","ToiUuHoa","OptimizeGame",
    "OptimizeFPS","OptimizeAim","OptimizeLock","ToiUuToanDien","FullOptimize",
    "MaxOptimize","UltraOptimize","ProOptimize","ToiGianHoa","Minimalize",
    "Lightweight","Compact","Streamline","TangHieuSuat","PerformanceBoost",
    "FPSBoost","SpeedBoost","PowerBoost","ToiDaHoa","Maximize","MaximizeFPS",
    "MaximizeAim","MaximizeLock","HoanHaoHoa","PerfectOptimize","PerfectAim",
    "PerfectLock","PerfectHead","CucMuot","UltraSmooth","SuperSmooth",
    "MegaSmooth","HyperSmooth","MuotNhuGio","SmoothLikeWind","FlowAim",
    "FlowLock","FlowHead","TangFPS","FPSBoost","FPSPro","FPSMax","FPSUltra",
    "TangTocGame","GameBoost","GamePro","GameMax","GameUltra","ToiDaFPS",
    "MaxFPS","UltraFPS","SuperFPS","MegaFPS","CucMuotGame","SmoothGamePro",
    "SmoothGameMax","SmoothGameUltra","SmoothGameGod","MuotNhuLua","SilkSmooth",
    "FlowGame","FluidGame","LiquidGame","SieuMuot","HyperSmooth","SuperSmooth",
    "MegaSmooth","UltraSmooth","FPSUnlock","FPSKill","FPSStop","FPSFix",
    "FPSBoostPro","TangTocDoHoa","GraphicBoost","GraphicPro","GraphicMax",
    "GraphicUltra","RenderBoost","RenderPro","RenderMax","RenderUltra",
    "RenderGod","GiamNhietCPU","CoolCPU","CPUCooler","TempDown","HeatKill",
    "ToiUuCPU","OptimizeCPU","CPUPro","CPUMax","CPUUltra","ToiUuPin",
    "BatterySaver","BatteryPro","BatteryMax","BatteryUltra","TietKiemPin",
    "PowerSave","PowerPro","PowerMax","PowerUltra","LamMatCPU","CoolDown",
    "ChillCPU","FrostCPU","IceCPU","GiamNong","HeatFix","HeatKill","HeatStop",
    "HeatZero","ToiUuNhiet","ThermalOptimize","ThermalPro","ThermalMax",
    "ThermalUltra","PinTrau","LongBattery","BatteryGod","BatteryKing",
    "BatteryMaster","CPUThongMinh","SmartCPU","AIOptimize","AIPro","AIMax",
    "CoolGame","ChillGame","FrostGame","IceGame","ColdGame","GiamPing",
    "PingDown","PingFix","PingKill","PingStop","TangTocMang","NetworkBoost",
    "NetworkPro","NetworkMax","NetworkUltra","FixLagMang","LagFixNetwork",
    "LagKillNetwork","LagStopNetwork","LagZeroNetwork","ToiUuMang",
    "OptimizeNetwork","NetworkPro","NetworkMax","NetworkUltra","GiamTreMang",
    "DelayFixNetwork","DelayKillNetwork","DelayStopNetwork","DelayZeroNetwork",
    "MangMuot","SmoothNetwork","FluidNetwork","FlowNetwork","StableNetwork",
    "PingThap","LowPing","MiniPing","MicroPing","NanoPing","FixMangPro",
    "NetworkGod","NetworkKing","NetworkMaster","NetworkLegend","TangTocDuongTruyen",
    "SpeedUpNetwork","TurboNetwork","HyperNetwork","MegaNetwork","ChongLagMang",
    "AntiLagNetwork","NoLagNetwork","LagOffNetwork","LagProofNetwork","XinSo",
    "HangXin","XinXo","XinPro","XinVip","XinMax","XinUltra","XinGod",
    "XinKing","XinMaster","XinCuc","XinChat","XinDinh","XinNhat","XinSieu",
    "XinSuper","XinMega","XinHyper","XinLegend","XinElite","ProGame",
    "ProPlayer","ProAim","ProLock","ProHead","ProMax","ProUltra","ProGod",
    "ProKing","ProMaster","ProVip","ProXin","ProChat","ProDinh","ProNhat",
    "ProSieu","ProSuper","ProMega","ProHyper","ProLegend"
];

function generateFiles() {
    clickSound();
    if (state.isGenerating) return;
    state.isGenerating = true;

    var count = parseInt(fileCountInput.value) || 100;
    if (count > 500) count = 500;
    if (count < 1) count = 1;
    fileCountInput.value = count;

    var prefix = prefixInput.value.trim() || 'Aim';
    log.textContent = '⏳ Dang tao ' + count + ' file...\n';
    state.startTime = performance.now();

    var funcs = Array.from(state.selected);
    if (!funcs.length) funcs = ['BamDau', 'Aimlock', 'FixRung'];

    state.files = [];
    state.totalSize = 0;
    var usedNames = new Set();
    var tagHtml = '';

    progressBar.style.display = 'block';
    progressFill.style.width = '0%';

    var BATCH_SIZE = 10;
    var index = 0;

    function processBatch() {
        var end = Math.min(index + BATCH_SIZE, count);
        
        for (var i = index; i < end; i++) {
            var name;
            var attempts = 0;
            do {
                name = nameArray[Math.floor(Math.random() * nameArray.length)] || (prefix + (i + 1000));
                attempts++;
                if (attempts > 100) { name = prefix + (i + 1000 + Math.floor(Math.random() * 9999)); break; }
            } while (usedNames.has(name));
            usedNames.add(name);
            
            var shuffled = funcs.slice().sort(function() { return Math.random() - 0.5; });
            var selected = shuffled.slice(0, Math.min(shuffled.length, 1 + Math.floor(Math.random() * 2)));
            var funcStr = selected.join('_');

            var speed = (Math.random() * 19.7 + 0.3);
            var fov = (Math.random() * 57 + 3);
            var smoothVal = (Math.random() * 1.99 + 0.01);
            var maxDist = (Math.random() * 145 + 5);

            var logic = 'Adaptive', bone = 'Head', lockMode = 'HardLock', recoil = 'SimpleRecoil', extra = '';

            if (funcStr.includes('BamDau') || funcStr.includes('LockHead') || funcStr.includes('HoldLock')) {
                bone = 'Head'; lockMode = 'HardLock'; logic = 'Snap'; extra = 'BamDau';
            }
            if (funcStr.includes('Aimlock')) { lockMode = 'HardLock'; logic = 'Precise'; extra = 'Aimlock'; }
            if (funcStr.includes('FixRung')) { recoil = 'DampingRecoil'; extra = 'FixRung'; }
            if (funcStr.includes('NheTam')) { smoothVal = 1.2 + Math.random() * 0.8; logic = 'Fluid'; extra = 'NheTam'; }
            if (funcStr.includes('DamTam')) { lockMode = 'HardLock'; logic = 'Aggressive'; extra = 'DamTam'; }
            if (funcStr.includes('ToiUuMay')) { extra = 'ToiUuMay'; }
            if (funcStr.includes('TangFPS')) { extra = 'TangFPS'; }
            if (funcStr.includes('FixLag')) { extra = 'FixLag'; }
            if (funcStr.includes('Optimizer')) { extra = 'Optimizer'; }
            if (funcStr.includes('FixShake')) { extra = 'FixShake'; }
            if (funcStr.includes('Stabilizer')) { extra = 'Stabilizer'; }
            if (funcStr.includes('ToiUuKeoTam')) { logic = 'Magnetic'; extra = 'ToiUuKeoTam'; }
            if (funcStr.includes('BamTam')) { lockMode = 'HardLock'; bone = 'Head'; extra = 'BamTam'; logic = 'Instant'; }
            if (!extra) extra = funcStr.split('_')[0] || 'Default';

            var code = buildClassCode(name, logic, bone, lockMode, recoil, extra, speed, fov, smoothVal, maxDist, funcStr);
            state.totalSize += code.length;
            state.files.push({ name: name + '.txt', content: code });
            tagHtml += '<span class="file-tag">' + name + '</span>';
        }

        progressFill.style.width = ((end / count) * 100) + '%';
        fileTags.innerHTML = tagHtml;
        totalDisplay.textContent = state.files.length;
        avgSize.textContent = (state.totalSize / state.files.length / 1024).toFixed(1) + ' KB';

        index = end;

        if (index < count) {
            requestAnimationFrame(processBatch);
        } else {
            progressBar.style.display = 'none';
            var elapsed = (performance.now() - state.startTime).toFixed(0);
            genTime.textContent = elapsed + ' ms';
            log.textContent = '✅ Da tao ' + state.files.length + ' file trong ' + elapsed + ' ms\n';
            log.textContent += '📦 Tong: ' + (state.totalSize / 1024).toFixed(1) + ' KB\n';
            log.textContent += '🧩 Chuc nang: ' + Array.from(state.selected).join(', ') + '\n';
            log.textContent += '📄 File: ' + state.files.map(function(f) { return f.name; }).join(', ');
            log.scrollTop = log.scrollHeight;
            state.isGenerating = false;
            successSound();
        }
    }

    requestAnimationFrame(processBatch);
}

function downloadZip() {
    clickSound();
    
    if (state.files.length === 0) {
        errorSound();
        alert('Chua co file nao. Hay tao file truoc.');
        return;
    }

    if (!isRealBrowser()) {
        errorSound();
        log.textContent += '\n❌ Khong the tai zip: Dang chay trong Koder/WebView. Hay mo bang trinh duyet that.';
        log.scrollTop = log.scrollHeight;
        alert('Khong the tai file zip. Vui long mo tool nay bang trinh duyet that (Chrome/Safari/Firefox).');
        return;
    }

    if (typeof JSZip === 'undefined') {
        errorSound();
        log.textContent += '\n⏳ Dang tai JSZip...';
        loadJSZip(function() { downloadZip(); });
        return;
    }

    var maxFiles = 200;
    var filesToZip = state.files;
    if (filesToZip.length > maxFiles) {
        if (!confirm('Co ' + filesToZip.length + ' file. Chi tai toi da ' + maxFiles + ' file. OK?')) return;
        filesToZip = filesToZip.slice(0, maxFiles);
    }

    try {
        var zip = new JSZip();
        for (var i = 0; i < filesToZip.length; i++) {
            zip.file(filesToZip[i].name, filesToZip[i].content);
        }

        log.textContent += '\n⏳ Dang nen ' + filesToZip.length + ' file...';

        zip.generateAsync({ type: 'blob' })
            .then(function(blob) {
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'AimlockSystem_Generated.zip';
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 3000);
                log.textContent += '\n✅ Da tai file zip thanh cong!';
                log.scrollTop = log.scrollHeight;
                downloadSound();
            })
            .catch(function(err) {
                errorSound();
                alert('Loi tao zip: ' + err.message);
                log.textContent += '\n❌ Loi: ' + err.message;
            });
    } catch (err) {
        errorSound();
        alert('Loi: ' + err.message);
        log.textContent += '\n❌ Loi: ' + err.message;
    }
}

function clearAll() {
    clickSound();
    state.files = [];
    state.totalSize = 0;
    state.isGenerating = false;
    log.textContent = '🗑️ Da xoa.';
    fileTags.innerHTML = '';
    totalDisplay.textContent = '0';
    avgSize.textContent = '0 KB';
    genTime.textContent = '0 ms';
    progressBar.style.display = 'none';
    progressFill.style.width = '0%';
}

function initTool() {
    initMusicPlayer();
    
    document.getElementById('btnGenerate').addEventListener('click', generateFiles);
    document.getElementById('btnDownload').addEventListener('click', downloadZip);
    document.getElementById('btnClear').addEventListener('click', clearAll);
    selectedDisplay.textContent = 'chua chon';
    console.log('DEV TRANDUC Tool Gen Code ready');
    log.textContent = 'Tool da kich hoat thanh cong! Chuc nang tao code. 🎵';
}

if (isLicensed()) {
    initTool();
} else {
    showLicenseDialog();
}