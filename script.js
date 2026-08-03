(function() {
    'use strict';

    var DEFAULT_ONLINE_SERVER = 'https://server-key-knbr.onrender.com';
    
    var SERVER_API = (function() {
        if (typeof window === 'undefined' || !window.location) return 'http://localhost:3000';
        var host = window.location.hostname || '';
        if (!host || window.location.protocol === 'file:') {
            document.body.innerHTML = '<h1 style="color:red;text-align:center;margin-top:50px;background:#111;padding:20px;">🚨 PHÁT HIỆN GIAN LẬN: KHÔNG THỂ CHẠY FILE NÀY OFFLINE (LOCAL)! 🚨</h1>';
            return 'http://localhost:3000';
        }
        if (host === 'localhost' || host === '127.0.0.1' || host.indexOf('onrender.com') !== -1 || host.indexOf('vercel.app') !== -1 || host.indexOf('loca.lt') !== -1) {
            return window.location.origin;
        }
        return DEFAULT_ONLINE_SERVER;
    })();

    var LICENSE_KEY = 'tranduc_tool_license_v2';

    function getMachineId() {
        var hwid = localStorage.getItem('tranduc_hwid');
        if (!hwid) {
            var randHex = function() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1).toUpperCase(); };
            hwid = randHex() + randHex() + '-' + randHex() + '-' + randHex() + '-' + randHex();
            localStorage.setItem('tranduc_hwid', hwid);
        }
        return hwid;
    }

    function getDeviceName() {
        var ua = navigator.userAgent;
        var os = "Unknown";
        var browser = "Unknown";
        
        if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
        else if (ua.indexOf("Safari") !== -1) browser = "Safari";
        else if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
        else if (ua.indexOf("Edge") !== -1) browser = "Edge";
        
        if (ua.indexOf("Win") !== -1) os = "Windows";
        else if (ua.indexOf("Mac") !== -1 && ua.indexOf("iPhone") === -1 && ua.indexOf("iPad") === -1) os = "MacOS";
        else if (ua.indexOf("iPhone") !== -1) os = "iPhone";
        else if (ua.indexOf("iPad") !== -1) os = "iPad";
        
        var androidMatch = ua.match(/Android\s+[\d\.]+;\s+([^;)]+)/);
        if (androidMatch && androidMatch[1]) {
            var model = androidMatch[1].trim();
            if (model.indexOf("Build") !== -1) model = model.split("Build")[0].trim();
            if (model.startsWith("SM-")) model = "Samsung " + model;
            else if (model.startsWith("CPH")) model = "Oppo " + model;
            else if (model.startsWith("RMX")) model = "Realme " + model;
            else if (model.startsWith("V2")) model = "Vivo " + model;
            os = model;
        } else if (ua.indexOf("Android") !== -1) {
            os = "Android";
        }
        
        return os + " - " + browser;
    }

    function getLicenseData() {
        try {
            var raw = localStorage.getItem(LICENSE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch(e) { return null; }
    }

    function isLicensed() {
        var data = getLicenseData();
        if (!data || !data.key) return false;
        var mid = getMachineId();
        if (!data.machines || data.machines.indexOf(mid) === -1) return false;
        return true;
    }

    function showLicenseDialog() {
        var oldOverlay = document.querySelector('.license-overlay');
        if (oldOverlay) oldOverlay.remove();

        var overlay = document.createElement('div');
        overlay.className = 'license-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);display:flex;justify-content:center;align-items:center;z-index:99999;backdrop-filter:blur(10px);';

        var box = document.createElement('div');
        box.style.cssText = 'background:#0b1322;border:2px solid #00d4ff;border-radius:16px;padding:35px 30px;max-width:460px;width:90%;text-align:center;box-shadow:0 0 50px rgba(0,212,255,0.3);position:relative;';

        var mid = getMachineId();
        box.innerHTML = `
            <button id="closeLicenseBtn" style="position:absolute;top:12px;right:15px;background:none;border:none;color:#00d4ff;font-size:22px;cursor:pointer;font-weight:bold;">✕</button>
            <div style="font-size:40px;margin-bottom:10px;">🔑</div>
            <h2 style="color:#fff;margin-bottom:6px;font-size:22px;font-weight:800;letter-spacing:1px;">KÍCH HOẠT KEY ONLINE</h2>
            <p style="color:#7888a2;font-size:13px;margin-bottom:15px;">Nhập Key bản quyền để xác thực với Server</p>
            <div style="background:#050811;padding:10px 14px;border-radius:8px;margin-bottom:15px;border:1px solid #1a2a40;display:flex;align-items:center;justify-content:center;gap:8px;">
                <span style="color:#7888a2;font-size:12px;">🖥️ HWID:</span>
                <span style="color:#00d4ff;font-size:13px;font-family:monospace;font-weight:bold;">${mid}</span>
            </div>
            <input type="text" id="licenseInput" placeholder="Nhập mã Key (VD: TRANDUC-XXXX-XXXX)" 
                   style="width:100%;padding:12px 14px;background:#050811;border:1px solid #1a2a40;color:#fff;border-radius:8px;font-size:15px;text-align:center;font-family:monospace;margin-bottom:15px;outline:none;">
            <button id="activateBtn" 
                    style="width:100%;padding:12px;background:linear-gradient(135deg,#0088cc,#00d4ff);border:none;border-radius:8px;color:#000;font-size:15px;font-weight:bold;cursor:pointer;margin-bottom:10px;transition:0.2s;">
                ⚡ KÍCH HOẠT ONLINE
            </button>
            <p id="licenseMsg" style="font-size:13px;margin-bottom:10px;min-height:20px;"></p>
            <div style="border-top:1px solid #1a2a40;padding-top:12px;margin-top:10px;">
                <a href="https://zalo.me/0584429837" target="_blank" style="color:#00d4ff;text-decoration:none;font-size:13px;font-weight:bold;">💬 Chưa có Key? Liên hệ Zalo: 0584429837</a>
            </div>
        `;
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        var input = document.getElementById('licenseInput');
        var msg = document.getElementById('licenseMsg');
        var btn = document.getElementById('activateBtn');

        function doVerify(key, retriesLeft) {
            msg.style.color = '#00d4ff';
            msg.textContent = retriesLeft < 3 ? '⏳ Server đang khởi động (~15s)... Thử lại (' + (3 - retriesLeft) + '/3)...' : '⏳ Đang xác thực với Key Server...';
            btn.disabled = true;

            fetch(SERVER_API + '/api/verify-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'bypass-tunnel-reminder': 'true', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ key: key, machineId: mid, deviceName: getDeviceName() })
            })
            .then(function(res) { return res.json(); })
            .then(function(result) {
                btn.disabled = false;
                if (result.success) {
                    msg.style.color = '#2ed573';
                    msg.textContent = '✅ ' + result.msg;
                    var data = { key: key, machines: [mid] };
                    localStorage.setItem(LICENSE_KEY, JSON.stringify(data));
                    setTimeout(function() {
                        overlay.remove();
                    }, 1200);
                } else {
                    msg.style.color = '#ff4757';
                    msg.textContent = '❌ ' + result.msg;
                }
            })
            .catch(function(err) {
                if (retriesLeft > 0) {
                    setTimeout(function() { doVerify(key, retriesLeft - 1); }, 3500);
                } else {
                    btn.disabled = false;
                    msg.style.color = '#ff4757';
                    msg.textContent = '❌ Không thể kết nối đến Server (' + SERVER_API + ')! Kiểm tra lại mạng hoặc URL Server.';
                }
            });
        }

        btn.addEventListener('click', function() {
            var key = input.value.trim();
            if (!key) {
                msg.style.color = '#ff4757';
                msg.textContent = '❌ Vui lòng nhập Key!';
                return;
            }
            doVerify(key, 3);
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') btn.click();
        });

        var closeBtn = document.getElementById('closeLicenseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                overlay.remove();
            });
        }

        setTimeout(function() { input.focus(); }, 300);
    }

    var state = {
        selected: new Set(),
        files: [],
        totalSize: 0,
        startTime: 0,
        isGenerating: false
    };

    function generateFiles() {
        if (typeof clickSound === 'function') clickSound();
        if (state.isGenerating) return;

        var license = getLicenseData();
        var mid = getMachineId();

        if (!license || !license.key) {
            if (typeof errorSound === 'function') errorSound();
            alert('❌ Bạn phải kích hoạt Key bản quyền để sử dụng Tool!');
            showLicenseDialog();
            return;
        }

        state.isGenerating = true;

        var menu5Content = document.getElementById('menuContent5');
        var isCppMenu = (menu5Content && menu5Content.style.display !== 'none');

        var fileCountInput = isCppMenu ? document.getElementById('cppFileCount') : document.getElementById('fileCount');
        var prefixInput = isCppMenu ? document.getElementById('cppClassPrefix') : document.getElementById('classPrefix');
        var fileExtInput = isCppMenu ? document.getElementById('cppFileExt') : document.getElementById('fileExt');
        var log = document.getElementById('logArea');
        var fileTags = document.getElementById('fileTags');
        var totalDisplay = document.getElementById('totalFilesDisplay');
        var avgSize = document.getElementById('avgSize');
        var genTime = document.getElementById('genTime');
        var progressBar = document.getElementById('progressBar');
        var progressFill = document.getElementById('progressFill');

        var count = parseInt(fileCountInput ? fileCountInput.value : 100) || 100;
        if (count > 500) count = 500;
        if (count < 1) count = 1;
        if (fileCountInput) fileCountInput.value = count;

        var prefix = (prefixInput && prefixInput.value.trim()) ? prefixInput.value.trim() : (isCppMenu ? 'DevHook' : 'Aim');
        var fileExt = isCppMenu ? (fileExtInput ? fileExtInput.value : '.cpp') : (fileExtInput ? fileExtInput.value : '.cs');
        if (log) log.textContent = '⏳ Đang yêu cầu Server tạo ' + count + ' file code (' + (isCppMenu ? 'C++ Native' : 'C# Unity') + ')...\n';
        state.startTime = performance.now();

        var funcs = Array.from(state.selected);
        if (!funcs.length) funcs = isCppMenu ? ['NativeHook', 'Aimlock', 'XuyenKeoVIP'] : ['BamDau', 'Aimlock', 'FixRung'];
        if (isCppMenu && funcs.indexOf('NativeHook') === -1) funcs.push('NativeHook');

        state.files = [];
        state.totalSize = 0;

        if (progressBar) progressBar.style.display = 'block';
        if (progressFill) progressFill.style.width = '50%';

        function doFetch(retriesLeft) {
            fetch(SERVER_API + '/api/generate-files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'bypass-tunnel-reminder': 'true', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({
                    key: license.key,
                    machineId: mid,
                    deviceName: getDeviceName(),
                    count: count,
                    prefix: prefix,
                    selectedFuncs: funcs,
                    fileExt: fileExt
                })
            })
            .then(function(res) {
                if (!res.ok) throw new Error('Key chưa được kích hoạt cho máy này hoặc đã hết hạn!');
                return res.json();
            })
            .then(function(data) {
                if (progressFill) progressFill.style.width = '100%';
                setTimeout(function() { if (progressBar) progressBar.style.display = 'none'; }, 500);

                if (data.success && data.files) {
                    state.files = data.files;
                    state.totalSize = data.totalSize || 0;
                    var elapsed = (performance.now() - state.startTime).toFixed(0);

                    var tagHtml = data.files.map(function(f) { return '<span class="file-tag">' + f.name.replace('.cs', '').replace('.txt', '') + '</span>'; }).join('');
                    if (fileTags) fileTags.innerHTML = tagHtml;
                    if (totalDisplay) totalDisplay.textContent = state.files.length;
                    if (avgSize) avgSize.textContent = (state.totalSize / state.files.length / 1024).toFixed(1) + ' KB';
                    if (genTime) genTime.textContent = elapsed + ' ms';

                    if (log) {
                        log.textContent = '✅ Server đã tạo ' + state.files.length + ' file thành công trong ' + elapsed + ' ms\n';
                        log.textContent += '📦 Tổng: ' + (state.totalSize / 1024).toFixed(1) + ' KB\n';
                        log.textContent += '🧩 Chức năng: ' + funcs.join(', ') + '\n';
                        log.textContent += '📄 File: ' + state.files.map(function(f) { return f.name; }).join(', ');
                        log.scrollTop = log.scrollHeight;
                    }
                    state.isGenerating = false;
                    if (typeof successSound === 'function') successSound();
                } else {
                    state.isGenerating = false;
                    if (typeof errorSound === 'function') errorSound();
                    alert('❌ ' + (data.msg || 'Key không hợp lệ'));
                    if (log) log.textContent = '❌ Lỗi: ' + (data.msg || 'Key không hợp lệ');
                    showLicenseDialog();
                }
            })
            .catch(function(err) {
                if (retriesLeft > 0 && (err.message.indexOf('fetch') !== -1 || err.message.indexOf('Failed') !== -1)) {
                    if (log) log.textContent = '⏳ Server Render đang khởi động (Render Free Tier mất ~20s)... Tự động kết nối lại sau 4s (' + retriesLeft + '/3)...';
                    setTimeout(function() { doFetch(retriesLeft - 1); }, 4000);
                } else {
                    state.isGenerating = false;
                    if (progressBar) progressBar.style.display = 'none';
                    if (typeof errorSound === 'function') errorSound();
                    alert('❌ ' + err.message);
                    if (log) log.textContent = '❌ Lỗi kết nối Server: ' + err.message;
                }
            });
        }
        doFetch(3);
    }

    function downloadZip() {
        if (typeof downloadSound === 'function') downloadSound();
        if (!state.files.length) {
            alert('⚠️ Chưa có file nào được tạo! Hãy bấm TẠO trước.');
            return;
        }

        if (typeof JSZip === 'undefined') {
            alert('⏳ Đang tải thư viện JSZip... Vui lòng thử lại sau 2 giây.');
            return;
        }

        var zip = new JSZip();
        var folder = zip.folder('Generated_Classes');

        state.files.forEach(function(f) {
            folder.file(f.name, f.content);
        });

        zip.generateAsync({ type: 'blob' }).then(function(content) {
            var link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'Tranduc_Classes_' + Date.now() + '.zip';
            link.click();
        });
    }

    function clearAll() {
        if (typeof toggleSound === 'function') toggleSound();
        state.files = [];
        state.totalSize = 0;
        state.selected.clear();
        document.querySelectorAll('.btn-func').forEach(function(btn) { btn.classList.remove('active'); });
        
        var fileTags = document.getElementById('fileTags');
        var totalDisplay = document.getElementById('totalFilesDisplay');
        var avgSize = document.getElementById('avgSize');
        var genTime = document.getElementById('genTime');
        var selectedDisplay = document.getElementById('selectedFuncs');
        var log = document.getElementById('logArea');

        if (fileTags) fileTags.innerHTML = '';
        if (totalDisplay) totalDisplay.textContent = '0';
        if (avgSize) avgSize.textContent = '0 KB';
        if (genTime) genTime.textContent = '0 ms';
        if (selectedDisplay) selectedDisplay.textContent = 'chưa chọn';
        if (log) log.textContent = '▶️ Chọn chức năng → Tạo → Tải ZIP.';
    }

    // ================= MUSIC PLAYER SYSTEM =================
    var playlist = [
        { name: '🎵 Chill Music 1', src: 'music/music-1.mp4' },
        { name: '🎵 Chill Music 2', src: 'music/music-2.mp4' }
    ];
    var currentTrack = 0;
    var audioObj = new Audio();
    audioObj.volume = 0.7;

    function loadTrack(index) {
        if (index < 0 || index >= playlist.length) index = 0;
        currentTrack = index;
        audioObj.src = playlist[currentTrack].src;
        audioObj.load();

        var songNameEl = document.getElementById('songName');
        var songStatusEl = document.getElementById('songStatus');
        var songCounterEl = document.getElementById('songCounter');

        if (songNameEl) songNameEl.textContent = playlist[currentTrack].name;
        if (songStatusEl) songStatusEl.textContent = '⏸ Tạm dừng';
        if (songCounterEl) songCounterEl.textContent = (currentTrack + 1) + '/' + playlist.length;
    }

    function playMusic() {
        audioObj.play().then(function() {
            var playBtn = document.getElementById('playBtn');
            var songStatusEl = document.getElementById('songStatus');
            var bgStatusEl = document.getElementById('bgStatus');
            var toggleBtn = document.getElementById('musicToggleBtn');

            if (playBtn) playBtn.textContent = '⏸';
            if (songStatusEl) songStatusEl.textContent = '▶ Đang phát';
            if (bgStatusEl) { bgStatusEl.textContent = '▶ ON'; bgStatusEl.style.color = '#4aff88'; }
            if (toggleBtn) toggleBtn.innerHTML = '🔊 Tắt nhạc';
        }).catch(function(e) {
            var songStatusEl = document.getElementById('songStatus');
            if (songStatusEl) songStatusEl.textContent = '⏸ Nhấn Bật nhạc';
        });
    }

    function pauseMusic() {
        audioObj.pause();
        var playBtn = document.getElementById('playBtn');
        var songStatusEl = document.getElementById('songStatus');
        var bgStatusEl = document.getElementById('bgStatus');
        var toggleBtn = document.getElementById('musicToggleBtn');

        if (playBtn) playBtn.textContent = '▶';
        if (songStatusEl) songStatusEl.textContent = '⏸ Tạm dừng';
        if (bgStatusEl) { bgStatusEl.textContent = '⏸ OFF'; bgStatusEl.style.color = '#ff4757'; }
        if (toggleBtn) toggleBtn.innerHTML = '🔊 Bật nhạc';
    }

    function toggleMusic() {
        if (audioObj.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    }

    function nextTrack() {
        var next = (currentTrack + 1) % playlist.length;
        loadTrack(next);
        playMusic();
    }

    audioObj.addEventListener('ended', function() {
        nextTrack();
    });

    audioObj.addEventListener('timeupdate', function() {
        if (audioObj.duration) {
            var pct = (audioObj.currentTime / audioObj.duration) * 100;
            var fill = document.getElementById('progressFillPlayer');
            if (fill) fill.style.width = pct + '%';
        }
    });

    function initMusicPlayer() {
        var playBtn = document.getElementById('playBtn');
        var nextBtn = document.getElementById('nextBtn');
        var toggleBtn = document.getElementById('musicToggleBtn');
        var volumeCtrl = document.getElementById('volumeControl');
        var progressPlayer = document.getElementById('progressBarPlayer');

        if (playBtn) playBtn.addEventListener('click', toggleMusic);
        if (nextBtn) nextBtn.addEventListener('click', nextTrack);
        if (toggleBtn) toggleBtn.addEventListener('click', toggleMusic);
        if (volumeCtrl) {
            volumeCtrl.addEventListener('input', function() {
                audioObj.volume = this.value / 100;
            });
        }
        if (progressPlayer) {
            progressPlayer.addEventListener('click', function(e) {
                var rect = this.getBoundingClientRect();
                var pct = (e.clientX - rect.left) / rect.width;
                if (audioObj.duration) {
                    audioObj.currentTime = pct * audioObj.duration;
                }
            });
        }
        loadTrack(0);
    }

    // ================= GLOBAL EVENT DELEGATION FOR ALL BUTTONS =================
    document.addEventListener('click', function(e) {
        var target = e.target;

        // 1. Function Selection Grid Buttons
        var funcBtn = target.closest('.btn-func');
        if (funcBtn) {
            if (typeof toggleSound === 'function') toggleSound();
            var func = funcBtn.getAttribute('data-func') || funcBtn.dataset.func;
            if (!func) return;

            if (state.selected.has(func)) {
                state.selected.delete(func);
                funcBtn.classList.remove('active');
            } else {
                state.selected.add(func);
                funcBtn.classList.add('active');
            }
            var selectedDisplay = document.getElementById('selectedFuncs');
            if (selectedDisplay) {
                selectedDisplay.textContent = state.selected.size ? Array.from(state.selected).join(', ') : 'chưa chọn';
            }
            return;
        }

        // 2. Generate Button
        var genBtn = target.closest('#btnGenerate');
        if (genBtn) {
            generateFiles();
            return;
        }

        // 3. Download Zip Button
        var dlBtn = target.closest('#btnDownload');
        if (dlBtn) {
            downloadZip();
            return;
        }

        // 4. Clear Button
        var clrBtn = target.closest('#btnClear');
        if (clrBtn) {
            clearAll();
            return;
        }

        // 5. Open Guide Modal
        var openGuideBtn = target.closest('#btnOpenGuide');
        if (openGuideBtn) {
            if (typeof toggleSound === 'function') toggleSound();
            var guideModal = document.getElementById('guideModal');
            if (guideModal) guideModal.style.display = 'flex';
            return;
        }

        // 6. Close Guide Modal
        var closeGuideBtn = target.closest('#btnCloseGuide') || target.closest('#btnCloseGuideBottom');
        if (closeGuideBtn) {
            if (typeof toggleSound === 'function') toggleSound();
            var guideModal = document.getElementById('guideModal');
            if (guideModal) guideModal.style.display = 'none';
            return;
        }
    });

    function checkLicenseOnlineOnStart() {
        var data = getLicenseData();
        var mid = getMachineId();
        if (!data || !data.key) return;

        fetch(SERVER_API + '/api/check-license', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'bypass-tunnel-reminder': 'true', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({ key: data.key, machineId: mid, deviceName: getDeviceName() })
        })
        .then(function(res) { return res.json(); })
        .then(function(result) {
            if (!result.valid) {
                localStorage.removeItem(LICENSE_KEY);
                showLicenseDialog();
            }
        })
        .catch(function(err) {});
    }

    function initUI() {
        initMusicPlayer();
        initMenuTabs();
        initMenu1Search();
        initMenu2Skin();
        initCopyPathButtons();
        initMenu3Sensi();
        initMenu4Config();
        checkLicenseOnlineOnStart();
    }

    // ================= MENU 2: IMAGE UPLOAD & MOD SKIN GENERATOR =================
    var uploadedImageBase64 = null;

    function initMenuTabs() {
        var categoryMenuBtn = document.getElementById('categoryMenuBtn');
        var categoryMenuDropdown = document.getElementById('categoryMenuDropdown');

        if (categoryMenuBtn && categoryMenuDropdown) {
            categoryMenuBtn.addEventListener('click', function() {
                if (typeof toggleSound === 'function') toggleSound();
                if (categoryMenuDropdown.style.display === 'none') {
                    categoryMenuDropdown.style.display = 'flex';
                } else {
                    categoryMenuDropdown.style.display = 'none';
                }
            });
        }

        var tabBtns = [
            document.getElementById('tabBtn1'),
            document.getElementById('tabBtn5'),
            document.getElementById('tabBtn2'),
            document.getElementById('tabBtn3'),
            document.getElementById('tabBtn4')
        ];
        var contents = [
            document.getElementById('menuContent1'),
            document.getElementById('menuContent5'),
            document.getElementById('menuContent2'),
            document.getElementById('menuContent3'),
            document.getElementById('menuContent4')
        ];

        tabBtns.forEach(function(btn, idx) {
            if (!btn) return;
            btn.addEventListener('click', function() {
                if (typeof toggleSound === 'function') toggleSound();
                tabBtns.forEach(function(b, i) {
                    if (b) {
                        if (i === idx) {
                            if (i === 1) {
                                b.style.background = 'linear-gradient(135deg,#ff4757,#ff6b81)';
                                b.style.color = '#fff';
                                b.style.borderColor = '#ff4757';
                                b.style.boxShadow = '0 0 20px rgba(255,71,87,0.4)';
                            } else {
                                b.style.background = 'linear-gradient(135deg,#0066aa,#00d4ff)';
                                b.style.color = '#000';
                                b.style.borderColor = '#00d4ff';
                                b.style.boxShadow = '0 0 20px rgba(0,212,255,0.3)';
                            }
                        } else {
                            b.style.background = '#09121d';
                            b.style.color = (i === 1) ? '#ff4757' : (i === 3 ? '#2ed573' : '#7899b5');
                            b.style.borderColor = (i === 1) ? '#ff4757' : (i === 3 ? '#2ed573' : '#1a3344');
                            b.style.boxShadow = 'none';
                        }
                    }
                    if (contents[i]) {
                        contents[i].style.display = (i === idx) ? 'block' : 'none';
                    }
                });
            });
        });
    }

    function initMenu3Sensi() {
        var btn = document.getElementById('btnCalcSensi');
        var deviceInput = document.getElementById('sensiDeviceInput') || document.getElementById('sensiDevice');
        var styleEl = document.getElementById('sensiStyle');
        var resultBox = document.getElementById('sensiResultBox');
        var gridDetails = document.getElementById('sensiGridDetails');

        if (!btn || !deviceInput || !styleEl || !gridDetails) return;

        btn.addEventListener('click', function() {
            if (typeof clickSound === 'function') clickSound();
            var license = getLicenseData();
            if (!license || !license.key) {
                if (typeof errorSound === 'function') errorSound();
                alert('❌ QUYỀN VIP BỊ KHÓA!\n\nBạn phải MUA & KÍCH HOẠT KEY BẢN QUYỀN để sử dụng Bộ Tính Độ Nhạy VIP.\n\n💬 Liên hệ Zalo Admin: 0584429837 để mua Key VIP.');
                showLicenseDialog();
                return;
            }
            var rawDev = deviceInput.value ? deviceInput.value.trim() : '';
            var dev = rawDev.toLowerCase();
            var style = styleEl.value;

            // Smart Phone Model Detection & Calculation (Scale 0 - 200)
            var look = 192, redDot = 184, scope2x = 176, scope4x = 168, awm = 100, dpi = '540 DPI', buttonSize = '45%';
            var deviceDisplayName = rawDev || 'Điện thoại thông minh';

            if (dev.indexOf('iphone') !== -1 || dev.indexOf('ipad') !== -1 || dev.indexOf('ios') !== -1) {
                look = 198; redDot = 192; scope2x = 184; scope4x = 176; awm = 115; dpi = 'Mặc định iOS (Tối ưu 120Hz)'; buttonSize = '42%';
            } else if (dev.indexOf('rog') !== -1 || dev.indexOf('redmagic') !== -1 || dev.indexOf('blackshark') !== -1 || dev.indexOf('gaming') !== -1 || dev.indexOf('iqoo') !== -1) {
                look = 200; redDot = 196; scope2x = 190; scope4x = 184; awm = 125; dpi = '720 DPI (144Hz Super Smooth)'; buttonSize = '40%';
            } else if (dev.indexOf('samsung') !== -1 || dev.indexOf('galaxy') !== -1) {
                look = 188; redDot = 180; scope2x = 172; scope4x = 164; awm = 98; dpi = '600 DPI (OneUI Tuned)'; buttonSize = '48%';
            } else if (dev.indexOf('xiaomi') !== -1 || dev.indexOf('poco') !== -1 || dev.indexOf('redmi') !== -1) {
                look = 194; redDot = 186; scope2x = 178; scope4x = 170; awm = 104; dpi = '560 DPI (HyperOS Mode)'; buttonSize = '44%';
            } else if (dev.indexOf('oppo') !== -1 || dev.indexOf('realme') !== -1 || dev.indexOf('vivo') !== -1) {
                look = 190; redDot = 182; scope2x = 174; scope4x = 166; awm = 96; dpi = '520 DPI (ColorOS Tuned)'; buttonSize = '46%';
            }

            if (style === 'fast') { look += 4; redDot += 4; }
            if (style === 'steady') { look -= 6; redDot -= 6; scope2x -= 4; }

            if (look > 200) look = 200;
            if (redDot > 200) redDot = 200;
            if (scope2x > 200) scope2x = 200;
            if (scope4x > 200) scope4x = 200;
            if (awm > 200) awm = 200;

            gridDetails.innerHTML = `
                <div style="grid-column:span 2;background:#050811;padding:8px 12px;border-radius:6px;border:1px solid #1a3344;text-align:center;">
                    📱 Tên Thiết Bị: <strong style="color:#ff9f43;">${deviceDisplayName}</strong>
                </div>
                <div style="background:#09121d;padding:8px 12px;border-radius:6px;border:1px solid #1a3344;">👀 Nhìn Quanh: <strong style="color:#00d4ff;">${look} / 200</strong></div>
                <div style="background:#09121d;padding:8px 12px;border-radius:6px;border:1px solid #1a3344;">🔴 Red Dot Sight: <strong style="color:#00d4ff;">${redDot} / 200</strong></div>
                <div style="background:#09121d;padding:8px 12px;border-radius:6px;border:1px solid #1a3344;">🔍 Scope 2X: <strong style="color:#00d4ff;">${scope2x} / 200</strong></div>
                <div style="background:#09121d;padding:8px 12px;border-radius:6px;border:1px solid #1a3344;">🔭 Scope 4X: <strong style="color:#00d4ff;">${scope4x} / 200</strong></div>
                <div style="background:#09121d;padding:8px 12px;border-radius:6px;border:1px solid #1a3344;">🎯 Scope AWM: <strong style="color:#00d4ff;">${awm} / 200</strong></div>
                <div style="background:#09121d;padding:8px 12px;border-radius:6px;border:1px solid #1a3344;">🔘 Nút Bắn Nút Dưới: <strong style="color:#2ed573;">${buttonSize}</strong></div>
                <div style="grid-column:span 2;background:#09121d;padding:10px;border-radius:6px;border:1px solid #00d4ff;text-align:center;margin-top:5px;">
                    💡 <strong>DPI Khuyên Dùng:</strong> <span style="color:#ff4757;font-weight:bold;">${dpi}</span>
                </div>
            `;

            if (resultBox) resultBox.style.display = 'block';
        });
    }

    function initMenu4Config() {
        var btn = document.getElementById('btnGenerateConfig');
        var profileEl = document.getElementById('configProfile');
        var formatEl = document.getElementById('configFormat');

        if (!btn || !profileEl || !formatEl) return;

        btn.addEventListener('click', function() {
            if (typeof clickSound === 'function') clickSound();
            var license = getLicenseData();
            if (!license || !license.key) {
                if (typeof errorSound === 'function') errorSound();
                alert('❌ QUYỀN VIP BỊ KHÓA!\n\nBạn phải MUA & KÍCH HOẠT KEY BẢN QUYỀN để sử dụng Config Fix Lag VIP.\n\n💬 Liên hệ Zalo Admin: 0584429837 để mua Key VIP.');
                showLicenseDialog();
                return;
            }

            var profile = profileEl.value;
            var format = formatEl.value;

            var configObj = {
                version: "2.0.0",
                author: "DEV TRANDUC TOOL",
                timestamp: new Date().toISOString(),
                profile: profile,
                settings: {
                    target_fps: profile === 'max_fps' ? 120 : 60,
                    graphic_quality: "ultra_low",
                    shadows_enabled: false,
                    particles_quality: "minimal",
                    texture_resolution: "compact",
                    anti_aliasing: "disabled",
                    cpu_governor: "performance",
                    gpu_clock_boost: profile === 'max_fps' ? true : false,
                    thermal_protection: profile === 'cool_cpu' ? "aggressive" : "standard",
                    network_tcp_nodelay: true,
                    network_dns_primary: "1.1.1.1",
                    network_dns_secondary: "1.0.0.1"
                }
            };

            var fileContent = format === 'json' ? JSON.stringify(configObj, null, 2) : 
                `[DEV TRANDUC CONFIG FIX LAG]\nPROFILE=${profile}\nTARGET_FPS=${configObj.settings.target_fps}\nGRAPHICS=ULTRA_LOW\nSHADOWS=OFF\nCPU_BOOST=ON\nTHERMAL_COOL=${configObj.settings.thermal_protection}\nDNS=1.1.1.1,1.0.0.1\nTIMESTAMP=${configObj.timestamp}`;

            var fileName = 'Tranduc_FixLag_' + profile + '_' + Date.now() + '.' + format;
            var blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();

            if (typeof successSound === 'function') successSound();
            alert('🎉 ĐÃ TẠO VÀ TẢI FILE CONFIG FIX LAG THÀNH CÔNG!\n\nDán tệp (' + fileName + ') vào thư mục game để tận hưởng!');
        });
    }

    function initMenu2Skin() {

        var dropzone = document.getElementById('uploadDropzone');
        var fileInput = document.getElementById('skinImageFile');
        var placeholder = document.getElementById('uploadPlaceholder');
        var previewBox = document.getElementById('uploadPreviewBox');
        var previewImg = document.getElementById('skinImagePreview');
        var imageName = document.getElementById('skinImageName');
        var removeBtn = document.getElementById('btnRemoveImage');
        var transparencyInput = document.getElementById('skinTransparency');
        var colorFilterInput = document.getElementById('skinColorFilter');

        function updatePreviewStyle() {
            if (!previewImg) return;
            var trans = transparencyInput ? transparencyInput.value : 'transparent';
            var filter = colorFilterInput ? colorFilterInput.value : 'original';

            var opacityVal = '1.0';
            if (trans === 'transparent') opacityVal = '0.65';
            else if (trans === 'high_transparent') opacityVal = '0.35';
            else if (trans === 'invisible') opacityVal = '0.12';
            else if (trans === 'glow') opacityVal = '0.85';

            var filterStyle = '';
            if (filter === 'neon_blue') filterStyle = 'drop-shadow(0 0 15px #00d4ff) hue-rotate(180deg)';
            else if (filter === 'red_magma') filterStyle = 'drop-shadow(0 0 15px #ff4757) sepia(0.8) saturate(4) hue-rotate(320deg)';
            else if (filter === 'purple_ultra') filterStyle = 'drop-shadow(0 0 15px #a55eea) hue-rotate(250deg)';
            else if (filter === 'gold_royal') filterStyle = 'drop-shadow(0 0 15px #ffd700) sepia(1) saturate(3)';
            else if (filter === 'toxic_green') filterStyle = 'drop-shadow(0 0 15px #2ed573) hue-rotate(90deg)';
            
            if (trans === 'glow') filterStyle += ' drop-shadow(0 0 25px #00d4ff)';

            previewImg.style.opacity = opacityVal;
            previewImg.style.filter = filterStyle;
        }

        if (transparencyInput) transparencyInput.addEventListener('change', updatePreviewStyle);
        if (colorFilterInput) colorFilterInput.addEventListener('change', updatePreviewStyle);

        if (dropzone && fileInput) {
            dropzone.addEventListener('click', function(e) {
                if (e.target !== removeBtn && !removeBtn.contains(e.target)) {
                    fileInput.click();
                }
            });

            fileInput.addEventListener('change', function() {
                if (fileInput.files && fileInput.files[0]) {
                    var file = fileInput.files[0];
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        uploadedImageBase64 = e.target.result;
                        if (previewImg) previewImg.src = uploadedImageBase64;
                        if (imageName) imageName.textContent = '✅ ' + file.name;
                        if (placeholder) placeholder.style.display = 'none';
                        if (previewBox) previewBox.style.display = 'flex';
                        updatePreviewStyle();
                    };
                    reader.readAsDataURL(file);
                }
            });

            if (removeBtn) {
                removeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    uploadedImageBase64 = null;
                    fileInput.value = '';
                    if (placeholder) placeholder.style.display = 'block';
                    if (previewBox) previewBox.style.display = 'none';
                });
            }
        }

        var obbSelect = document.getElementById('obbSkinKey');
        var customRow = document.getElementById('customObbRow');
        var customInput = document.getElementById('customObbInput');

        if (obbSelect && customRow) {
            obbSelect.addEventListener('change', function() {
                if (obbSelect.value === 'custom') {
                    customRow.style.display = 'flex';
                    if (customInput) customInput.focus();
                } else {
                    customRow.style.display = 'none';
                }
            });
        }

        function processImageCanvas(base64Src, opacityVal, filterType, fitMode, callback) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                var canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 512;
                var ctx = canvas.getContext('2d');

                ctx.globalAlpha = parseFloat(opacityVal);

                if (filterType === 'neon_blue') ctx.filter = 'hue-rotate(180deg) saturate(2)';
                else if (filterType === 'red_magma') ctx.filter = 'sepia(0.8) saturate(4) hue-rotate(320deg)';
                else if (filterType === 'purple_ultra') ctx.filter = 'hue-rotate(250deg) saturate(2.5)';
                else if (filterType === 'gold_royal') ctx.filter = 'sepia(1) saturate(3)';
                else if (filterType === 'toxic_green') ctx.filter = 'hue-rotate(90deg) saturate(3)';

                if (fitMode === 'rotate_90') {
                    ctx.translate(256, 256);
                    ctx.rotate(90 * Math.PI / 180);
                    ctx.drawImage(img, -256, -256, 512, 512);
                } else if (fitMode === 'contain') {
                    ctx.fillStyle = '#050811';
                    ctx.fillRect(0, 0, 512, 512);
                    var scale = Math.min(512 / img.width, 512 / img.height);
                    var w = img.width * scale;
                    var h = img.height * scale;
                    var x = (512 - w) / 2;
                    var y = (512 - h) / 2;
                    ctx.drawImage(img, x, y, w, h);
                } else if (fitMode === 'center_crop') {
                    var scale = Math.max(512 / img.width, 512 / img.height);
                    var w = img.width * scale;
                    var h = img.height * scale;
                    var x = (512 - w) / 2;
                    var y = (512 - h) / 2;
                    ctx.drawImage(img, x, y, w, h);
                } else {
                    ctx.drawImage(img, 0, 0, 512, 512);
                }

                var processedBase64 = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
                callback(processedBase64);
            };
            img.onerror = function() {
                var rawData = base64Src.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, '');
                callback(rawData);
            };
            img.src = base64Src;
        }

        var uploadedObbFileBase64 = null;
        var uploadedObbFileName = null;

        var obbSourcePreset = document.getElementById('obbSourcePreset');
        var obbSourceUpload = document.getElementById('obbSourceUpload');
        var presetObbBox = document.getElementById('presetObbBox');
        var uploadObbBox = document.getElementById('uploadObbBox');
        var btnChooseObbFile = document.getElementById('btnChooseObbFile');
        var customObbFileInput = document.getElementById('customObbFileInput');
        var customObbFileInfo = document.getElementById('customObbFileInfo');

        if (obbSourcePreset && obbSourceUpload) {
            obbSourcePreset.addEventListener('change', function() {
                if (presetObbBox) presetObbBox.style.display = 'flex';
                if (uploadObbBox) uploadObbBox.style.display = 'none';
            });
            obbSourceUpload.addEventListener('change', function() {
                if (presetObbBox) presetObbBox.style.display = 'none';
                if (uploadObbBox) uploadObbBox.style.display = 'block';
            });
        }

        var btnVerifyObbServer = document.getElementById('btnVerifyObbServer');
        var serverVerificationResult = document.getElementById('serverVerificationResult');

        if (btnChooseObbFile && customObbFileInput) {
            btnChooseObbFile.addEventListener('click', function() {
                customObbFileInput.click();
            });

            customObbFileInput.addEventListener('change', function(e) {
                var file = e.target.files[0];
                if (!file) return;

                uploadedObbFileName = file.name;
                var reader = new FileReader();
                reader.onload = function(evt) {
                    uploadedObbFileBase64 = evt.target.result;
                    if (customObbFileInfo) {
                        customObbFileInfo.style.display = 'block';
                        customObbFileInfo.textContent = '✅ Đã chọn file OBB: ' + file.name + ' (' + Math.round(file.size / 1024) + ' KB)';
                    }
                    if (btnVerifyObbServer) {
                        btnVerifyObbServer.style.display = 'inline-block';
                    }
                };
                reader.readAsDataURL(file);
            });
        }

        if (btnVerifyObbServer) {
            btnVerifyObbServer.addEventListener('click', function() {
                var license = getLicenseData();
                var mid = getMachineId();

                if (!uploadedObbFileBase64) {
                    alert('⚠️ Vui lòng chọn file OBB từ máy trước!');
                    return;
                }

                btnVerifyObbServer.disabled = true;
                btnVerifyObbServer.textContent = '⏳ Đang gửi file lên Server kiểm tra mã code...';

                fetch(SERVER_API + '/api/verify-and-upload-obb', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'bypass-tunnel-reminder': 'true', 'ngrok-skip-browser-warning': 'true' },
                    body: JSON.stringify({
                        key: (license && license.key) ? license.key : '',
                        machineId: mid,
                        deviceName: getDeviceName(),
                        obbData: uploadedObbFileBase64,
                        fileName: uploadedObbFileName
                    })
                })
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    btnVerifyObbServer.disabled = false;
                    btnVerifyObbServer.textContent = '🛡️ GỬI FILE OBB LÊN SERVER XÁC NHẬN KEY & CHECK CODE';

                    if (serverVerificationResult) {
                        serverVerificationResult.style.display = 'block';
                        if (data.success && data.verified) {
                            var info = data.fileInfo || {};
                            serverVerificationResult.style.borderColor = '#00d4ff';
                            serverVerificationResult.style.background = '#050a14';
                            serverVerificationResult.innerHTML = `
                                <div style="color:#00d4ff;font-weight:bold;font-size:12px;margin-bottom:6px;">${data.msg}</div>
                                <div style="color:#e0e6ed;line-height:1.6;">
                                    🔑 <strong>Loại Kiểm Tra:</strong> <span style="color:#2ed573;">MIỄN PHÍ TRÊN SERVER (FREE OBB CHECK)</span><br>
                                    🖥️ <strong>HWID Máy:</strong> <span style="color:#00d4ff;">${mid}</span><br>
                                    📦 <strong>Tên File OBB:</strong> <span style="color:#ff9f43;">${info.name || 'custom_file.dat'}</span><br>
                                    📏 <strong>Dung Lượng:</strong> ${info.sizeFormatted || 'N/A'}<br>
                                    🎨 <strong>Số Khối Texture JPEG:</strong> <span style="color:#2ed573;">${info.textureBlocksCount || 0} Khối tìm thấy</span><br>
                                    👻 <strong>Unity Shader Mode:</strong> <span style="color:#2ed573;">${info.hasShaderMode ? 'Có cờ _Mode (Xuyên Keo 100%)' : 'Chuẩn'}</span><br>
                                    ⚡ <strong>Trạng Thái Mã Code:</strong> <span style="color:#2ed573;font-weight:bold;">${info.codeIntegrity || 'OK'}</span>
                                </div>
                            `;
                            if (typeof successSound === 'function') successSound();
                        } else {
                            serverVerificationResult.style.borderColor = '#ff4757';
                            serverVerificationResult.innerHTML = `<div style="color:#ff4757;font-weight:bold;">${data.msg || 'Không thể kiểm tra từ Server!'}</div>`;
                            if (typeof errorSound === 'function') errorSound();
                        }
                    }
                })
                .catch(function(err) {
                    btnVerifyObbServer.disabled = false;
                    btnVerifyObbServer.textContent = '🛡️ GỬI FILE OBB LÊN SERVER XÁC NHẬN KEY & CHECK CODE';
                    if (serverVerificationResult) {
                        serverVerificationResult.style.display = 'block';
                        serverVerificationResult.style.borderColor = '#ff4757';
                        serverVerificationResult.innerHTML = `<div style="color:#ff4757;font-weight:bold;">❌ Lỗi kết nối Server: ${err.message}</div>`;
                    }
                });
            });
        }

        var buildBtn = document.getElementById('btnBuildSkinFromImage');
        if (buildBtn) {
            buildBtn.addEventListener('click', function() {
                var license = getLicenseData();
                var mid = getMachineId();

                if (!license || !license.key) {
                    if (typeof errorSound === 'function') errorSound();
                    alert('❌ Bạn phải kích hoạt Key bản quyền để tạo Skin!');
                    showLicenseDialog();
                    return;
                }

                var isUploadObbMode = obbSourceUpload && obbSourceUpload.checked;
                if (isUploadObbMode && !uploadedObbFileBase64) {
                    alert('⚠️ Bạn chọn chế độ nạp file OBB riêng nhưng chưa chọn file OBB từ máy! Vui lòng chọn file OBB Bom Keo từ máy bạn.');
                    if (customObbFileInput) customObbFileInput.click();
                    return;
                }

                var gameVersionInput = document.getElementById('ffGameVersion');
                var obbKeyInput = document.getElementById('obbSkinKey');

                var gVersion = gameVersionInput ? gameVersionInput.value : 'ffth';
                var obbKey = 'optionalab_weapon_054.PZEaSpjxrnFlozy~2Bs9hos3qj6xo~3D';
                if (obbKeyInput) {
                    if (obbKeyInput.value === 'custom' && customInput && customInput.value.trim()) {
                        obbKey = customInput.value.trim();
                    } else if (obbKeyInput.value !== 'custom') {
                        obbKey = obbKeyInput.value.trim();
                    }
                }

                if (gVersion === 'ffm' && obbKey.indexOf('optionalab_weapon_') === 0) {
                    obbKey = obbKey.replace('optionalab_weapon_', 'optionalab_max_weapon_');
                }

                var mode = transparencyInput ? transparencyInput.value : 'transparent';
                var filterType = colorFilterInput ? colorFilterInput.value : 'original';
                var fitModeInput = document.getElementById('skinFitMode');
                var fitMode = fitModeInput ? fitModeInput.value : 'center_crop';

                if (!uploadedImageBase64) {
                    alert('⚠️ Bạn chưa tải ảnh lên! Hãy chọn 1 bức ảnh để làm Skin Bom Keo.');
                    if (fileInput) fileInput.click();
                    return;
                }

                if (typeof clickSound === 'function') clickSound();
                buildBtn.disabled = true;
                buildBtn.textContent = '⏳ Đang xử lý ảnh & chuyển hóa thành Skin Bom Keo Xuyên Keo...';

                var selectedFuncsList = ['ModSkinBomKeo'];
                if (mode !== 'none') selectedFuncsList.push('BomKeoTrongSuot', 'XuyenKeoVIP');

                var alphaVal = '1.0';
                if (mode === 'transparent') alphaVal = '0.65';
                else if (mode === 'high_transparent') alphaVal = '0.35';
                else if (mode === 'invisible') alphaVal = '0.10';
                else if (mode === 'glow') alphaVal = '0.85';

                processImageCanvas(uploadedImageBase64, alphaVal, filterType, fitMode, function(finalImageBase64) {
                    function doFetchSkin(retriesLeft) {
                        var reqPayload = {
                            key: license.key,
                            machineId: mid,
                            deviceName: getDeviceName(),
                            files: state.files,
                            isCppMenu: false,
                            count: 1,
                            prefix: obbKey,
                            selectedFuncs: selectedFuncsList,
                            fileExt: 'none',
                            uploadedImage: finalImageBase64
                        };

                        if (isUploadObbMode && uploadedObbFileBase64) {
                            reqPayload.customObbData = uploadedObbFileBase64;
                            reqPayload.customObbName = uploadedObbFileName || obbKey;
                        }

                        fetch(SERVER_API + '/api/generate-files', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'bypass-tunnel-reminder': 'true', 'ngrok-skip-browser-warning': 'true' },
                            body: JSON.stringify(reqPayload)
                        })
                        .then(function(res) { return res.json(); })
                        .then(function(data) {
                            buildBtn.disabled = false;
                            buildBtn.textContent = '🚀 CHUYỂN ẢNH THÀNH SKIN BOM KEO & TẢI VỀ';

                            if (data.success && data.files && data.files.length) {
                                if (typeof successSound === 'function') successSound();

                                if (typeof JSZip !== 'undefined') {
                                    var zip = new JSZip();
                                    var f = data.files[0];
                                    if (f.isBase64) {
                                        zip.file(f.name, f.content, { base64: true });
                                    } else {
                                        zip.file(f.name, f.content);
                                    }

                                    var guideText = `=====================================================\n` +
                                        `📜 HƯỚNG DẪN CÀI ĐẶT SKIN BOM KEO & XUYÊN KEO CUSTOM (${gVersion.toUpperCase()})\n` +
                                        `=====================================================\n\n` +
                                        `🎨 CHẾ ĐỘ SKIN: ${filterType.toUpperCase()}\n` +
                                        `👻 CHẾ ĐỘ XUYÊN KEO: ${mode.toUpperCase()}\n\n` +
                                        `1. ĐỐI VỚI FREE FIRE THƯỜNG (FFTH - com.dts.freefireth):\n` +
                                        `   👉 Chép file (${f.name}) vào đường dẫn:\n` +
                                        `   Android/data/com.dts.freefireth/files/contentcache/Compulsory/android/gameassetbundles/\n\n` +
                                        `2. ĐỐI VỚI FREE FIRE MAX (FFM - com.dts.freefiremax):\n` +
                                        `   👉 Chép file (${f.name}) vào đường dẫn:\n` +
                                        `   Android/data/com.dts.freefiremax/files/contentcache/Compulsory/android/gameassetbundles/\n\n` +
                                        `=====================================================`;
                                    zip.file('HUONG_DAN_CAI_DAT.txt', guideText);

                                    zip.generateAsync({ type: 'blob' }).then(function(content) {
                                        var link = document.createElement('a');
                                        link.href = URL.createObjectURL(content);
                                        link.download = 'Skin_BomKeo_XuyenKeo_' + gVersion.toUpperCase() + '_' + Date.now() + '.zip';
                                        link.click();
                                        alert('🎉 ĐÃ TẠO SKIN BOM KEO XUYÊN KEO (' + gVersion.toUpperCase() + ') THÀNH CÔNG!\n\nMở file ZIP và dán tệp (' + f.name + ') vào game theo Hướng dẫn đi kèm!');
                                    });
                                }
                            } else {
                                if (typeof errorSound === 'function') errorSound();
                                alert('❌ Lỗi tạo skin: ' + (data.msg || 'Thất bại'));
                                if (data.msg && data.msg.indexOf('kích hoạt') !== -1) showLicenseDialog();
                            }
                        })
                        .catch(function(err) {
                            if (retriesLeft > 0) {
                                buildBtn.textContent = '⏳ Server đang kết nối... Thử lại (' + (3 - retriesLeft + 1) + '/3)...';
                                setTimeout(function() { doFetchSkin(retriesLeft - 1); }, 2000);
                            } else {
                                buildBtn.textContent = '⚡ Đang tạo Skin Bom Keo trực tiếp trên Trình duyệt (Browser)...';
                                generateSkinClientSide(finalImageBase64, obbKey, isUploadObbMode, uploadedObbFileBase64, uploadedObbFileName, mode, filterType, gVersion, buildBtn);
                            }
                        });
                    }
                    doFetchSkin(2);
                });
            });
        }
    }
    function base64ToUint8Array(b64) {
        var cleanB64 = b64.replace(/^data:.*;base64,/, '');
        var binaryStr = atob(cleanB64);
        var len = binaryStr.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }
        return bytes;
    }

    function clientSidePatchObb(u8Array, userJpgUint8, isTransparent) {
        var mod = new Uint8Array(u8Array);
        var p = 0;
        
        while (p < mod.length - 3) {
            if (mod[p] === 0xFF && mod[p+1] === 0xD8 && mod[p+2] === 0xFF) {
                var endPos = -1;
                for (var e = p; e < mod.length - 1; e++) {
                    if (mod[e] === 0xFF && mod[e+1] === 0xD9) {
                        endPos = e;
                        break;
                    }
                }
                if (endPos !== -1) {
                    var origLen = endPos + 2 - p;
                    if (origLen > 5000 && userJpgUint8 && userJpgUint8.length > 0) {
                        var copyLen = Math.min(userJpgUint8.length, origLen);
                        mod.set(userJpgUint8.subarray(0, copyLen), p);
                        if (copyLen < origLen) {
                            mod.fill(0, p + copyLen, p + origLen);
                        }
                    }
                }
            }
            p++;
        }

        if (isTransparent) {
            var modeStr = "_Mode";
            for (var i = 0; i < mod.length - modeStr.length; i++) {
                if (mod[i] === 95 && mod[i+1] === 77 && mod[i+2] === 111 && mod[i+3] === 100 && mod[i+4] === 101) {
                    if (i + 6 < mod.length) {
                        mod[i + 6] = 3;
                    }
                }
            }
        }

        return mod;
    }

    function generateSkinClientSide(finalImageBase64, obbKey, isUploadObbMode, uploadedObbFileBase64, uploadedObbFileName, mode, filterType, gVersion, buildBtn) {
        if (isUploadObbMode && uploadedObbFileBase64) {
            processClientObbBuffer(base64ToUint8Array(uploadedObbFileBase64), uploadedObbFileName || obbKey);
        } else {
            var templateName = obbKey;
            var pathOptions = [
                './templates/gloo_wall_templates/' + templateName,
                './Tool_Code/templates/gloo_wall_templates/' + templateName,
                '../Tool_Code/templates/gloo_wall_templates/' + templateName,
                './templates/gloo_wall_template.dat'
            ];

            function tryFetchPath(idx) {
                if (idx >= pathOptions.length) {
                    buildBtn.disabled = false;
                    buildBtn.textContent = '🚀 CHUYỂN ẢNH THÀNH SKIN BOM KEO & TẢI VỀ';
                    alert('❌ Không thể nạp file OBB Template! Vui lòng tải file OBB riêng từ máy bạn lên.');
                    return;
                }
                fetch(pathOptions[idx])
                .then(function(res) {
                    if (!res.ok) throw new Error('Not found');
                    return res.arrayBuffer();
                })
                .then(function(ab) {
                    processClientObbBuffer(new Uint8Array(ab), templateName);
                })
                .catch(function() {
                    tryFetchPath(idx + 1);
                });
            }
            tryFetchPath(0);
        }

        function processClientObbBuffer(uint8, fileName) {
            try {
                var userJpgBytes = base64ToUint8Array(finalImageBase64);
                var isTransparent = (mode !== 'none');
                var mod = clientSidePatchObb(uint8, userJpgBytes, isTransparent);

                buildBtn.disabled = false;
                buildBtn.textContent = '🚀 CHUYỂN ẢNH THÀNH SKIN BOM KEO & TẢI VỀ';

                if (typeof successSound === 'function') successSound();

                if (typeof JSZip !== 'undefined') {
                    var zip = new JSZip();
                    zip.file(fileName, mod);

                    var guideText = `=====================================================\n` +
                        `📜 HƯỚNG DẪN CÀI ĐẶT SKIN BOM KEO & XUYÊN KEO CUSTOM (${gVersion.toUpperCase()})\n` +
                        `=====================================================\n\n` +
                        `🎨 CHẾ ĐỘ SKIN: ${filterType.toUpperCase()}\n` +
                        `👻 CHẾ ĐỘ XUYÊN KEO: ${mode.toUpperCase()}\n\n` +
                        `1. ĐỐI VỚI FREE FIRE THƯỜNG (FFTH - com.dts.freefireth):\n` +
                        `   👉 Chép file (${fileName}) vào đường dẫn:\n` +
                        `   Android/data/com.dts.freefireth/files/contentcache/Compulsory/android/gameassetbundles/\n\n` +
                        `2. ĐỐI VỚI FREE FIRE MAX (FFM - com.dts.freefiremax):\n` +
                        `   👉 Chép file (${fileName}) vào đường dẫn:\n` +
                        `   Android/data/com.dts.freefiremax/files/contentcache/Compulsory/android/gameassetbundles/\n\n` +
                        `=====================================================`;
                    zip.file('HUONG_DAN_CAI_DAT.txt', guideText);

                    zip.generateAsync({ type: 'blob' }).then(function(content) {
                        var link = document.createElement('a');
                        link.href = URL.createObjectURL(content);
                        link.download = 'Skin_BomKeo_XuyenKeo_' + gVersion.toUpperCase() + '_' + Date.now() + '.zip';
                        link.click();
                        alert('🎉 ĐÃ TẠO SKIN BOM KEO XUYÊN KEO (' + gVersion.toUpperCase() + ') THÀNH CÔNG (TỰ ĐỘNG CHẠY TRÊN BROWSER)!\n\nMở file ZIP và dán tệp (' + fileName + ') vào game theo Hướng dẫn đi kèm!');
                    });
                }
            } catch(err) {
                buildBtn.disabled = false;
                buildBtn.textContent = '🚀 CHUYỂN ẢNH THÀNH SKIN BOM KEO & TẢI VỀ';
                alert('❌ Lỗi xử lý skin client: ' + err.message);
            }
        }
    }

    function showToast(message, type) {
        var oldToast = document.querySelector('.custom-toast-notification');
        if (oldToast) oldToast.remove();

        var toast = document.createElement('div');
        toast.className = 'custom-toast-notification';
        toast.style.cssText = 'position:fixed;bottom:25px;right:25px;background:rgba(11,19,34,0.95);border:1px solid ' + (type === 'error' ? '#ff4757' : '#00d4ff') + ';color:#fff;padding:12px 22px;border-radius:50px;font-size:13px;font-weight:bold;box-shadow:0 0 30px ' + (type === 'error' ? 'rgba(255,71,87,0.4)' : 'rgba(0,212,255,0.4)') + ';z-index:999999;backdrop-filter:blur(10px);transition:all 0.3s ease;transform:translateY(20px);opacity:0;pointer-events:none;';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(function() {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 50);

        setTimeout(function() {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
            setTimeout(function() { toast.remove(); }, 300);
        }, 3200);
    }

    function initMenu1Search() {
        var searchInput = document.getElementById('funcSearchInput');
        var selectAllBtn = document.getElementById('btnSelectAllFuncs');
        var deselectAllBtn = document.getElementById('btnDeselectAllFuncs');

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                var query = this.value.toLowerCase().trim();
                var funcBtns = document.querySelectorAll('#funcGrid .btn-func');
                funcBtns.forEach(function(btn) {
                    var text = btn.textContent.toLowerCase();
                    var func = (btn.getAttribute('data-func') || '').toLowerCase();
                    if (!query || text.indexOf(query) !== -1 || func.indexOf(query) !== -1) {
                        btn.style.display = 'inline-block';
                    } else {
                        btn.style.display = 'none';
                    }
                });
            });
        }

        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', function() {
                if (typeof toggleSound === 'function') toggleSound();
                var funcBtns = document.querySelectorAll('#funcGrid .btn-func');
                funcBtns.forEach(function(btn) {
                    var func = btn.getAttribute('data-func');
                    if (func) {
                        state.selected.add(func);
                        btn.classList.add('active');
                    }
                });
                var selectedDisplay = document.getElementById('selectedFuncs');
                if (selectedDisplay) selectedDisplay.textContent = state.selected.size ? Array.from(state.selected).join(', ') : 'chưa chọn';
                showToast('⚡ Đã chọn tất cả ' + state.selected.size + ' chức năng!');
            });
        }

        if (deselectAllBtn) {
            deselectAllBtn.addEventListener('click', function() {
                if (typeof toggleSound === 'function') toggleSound();
                state.selected.clear();
                var funcBtns = document.querySelectorAll('#funcGrid .btn-func');
                funcBtns.forEach(function(btn) { btn.classList.remove('active'); });
                var selectedDisplay = document.getElementById('selectedFuncs');
                if (selectedDisplay) selectedDisplay.textContent = 'chưa chọn';
                showToast('🗑️ Đã xóa chọn tất cả chức năng!');
            });
        }
    }

    function initCopyPathButtons() {
        var btnFFTH = document.getElementById('btnCopyFFTHPath');
        var btnFFM = document.getElementById('btnCopyFFMPath');

        var pathFFTH = 'Android/data/com.dts.freefireth/files/contentcache/Compulsory/android/gameassetbundles/';
        var pathFFM = 'Android/data/com.dts.freefiremax/files/contentcache/Compulsory/android/gameassetbundles/';

        function copyToClipboard(text, msg) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function() {
                    if (typeof successSound === 'function') successSound();
                    showToast('📋 ' + msg);
                });
            } else {
                var ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
                if (typeof successSound === 'function') successSound();
                showToast('📋 ' + msg);
            }
        }

        if (btnFFTH) {
            btnFFTH.addEventListener('click', function() {
                copyToClipboard(pathFFTH, 'Đã copy đường dẫn dán game Free Fire Thường!');
            });
        }

        if (btnFFM) {
            btnFFM.addEventListener('click', function() {
                copyToClipboard(pathFFM, 'Đã copy đường dẫn dán game Free Fire MAX!');
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }
    
    // --- ANTI DEVTOOLS SCRIPT ---
    (function() {
        var isViolated = false;
        var maxTolerance = 0;

        function reportViolation(reason) {
            if (isViolated) return;
            var license = getLicenseData();
            var key = license ? license.key : 'UNKNOWN';
            var mid = getMachineId();
            
            isViolated = true;
            fetch(SERVER_API + '/api/report-violation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'bypass-tunnel-reminder': 'true', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ key: key, machineId: mid, deviceName: getDeviceName(), reason: reason })
            }).then(function() {
                document.body.innerHTML = '<div style="background:#ff4757;color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:24px;font-weight:bold;text-align:center;padding:20px;"><div>CẢNH BÁO VI PHẠM BẢO MẬT!</div><div style="font-size:16px;margin-top:10px;">Thiết bị của bạn đã bị CẤM vĩnh viễn do cố tình mở F12/DevTools.</div></div>';
            }).catch(function() {
                document.body.innerHTML = '<h1>BANNED</h1>';
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'F12' || 
               (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) || 
               (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's' || e.key === 'P' || e.key === 'p'))) {
                e.preventDefault();
                reportViolation('Sử dụng phím tắt DevTools/Crack (' + e.key + ')');
                return false;
            }
        });

        setInterval(function() {
            var widthThreshold = window.outerWidth - window.innerWidth > 180;
            var heightThreshold = window.outerHeight - window.innerHeight > 180;
            if (widthThreshold || heightThreshold) {
                maxTolerance++;
                if (maxTolerance > 2) reportViolation('Mở DevTools (Kích thước cửa sổ thay đổi)');
            } else {
                maxTolerance = 0;
            }
        }, 1000);

        setInterval(function() {
            var before = new Date().getTime();
            debugger;
            var after = new Date().getTime();
            if (after - before > 100) {
                reportViolation('Sử dụng trình gỡ lỗi (Debugger)');
            }
        }, 1000);

        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        document.addEventListener('selectstart', function(e) { e.preventDefault(); return false; });
        document.addEventListener('dragstart', function(e) { e.preventDefault(); return false; });
    })();
})();