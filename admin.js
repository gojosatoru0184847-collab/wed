let adminPass = localStorage.getItem('tranduc_admin_pass') || '';

const loginBox = document.getElementById('loginBox');
const dashboard = document.getElementById('dashboard');
const adminPassInput = document.getElementById('adminPassInput');
const loginBtn = document.getElementById('loginBtn');
const loginMsg = document.getElementById('loginMsg');

const btnCreateKey = document.getElementById('btnCreateKey');
const newCustomKey = document.getElementById('newCustomKey');
const newKeyDays = document.getElementById('newKeyDays');
const newMaxDev = document.getElementById('newMaxDev');
const newNote = document.getElementById('newNote');
const createMsg = document.getElementById('createMsg');

const searchInput = document.getElementById('searchInput');
const btnRefresh = document.getElementById('btnRefresh');
const keyTableBody = document.getElementById('keyTableBody');
const keyTotalCount = document.getElementById('keyTotalCount');

let allKeysCache = [];

function init() {
    if (adminPass) {
        adminPassInput.value = adminPass;
        tryLogin();
    }
}

loginBtn.addEventListener('click', tryLogin);
adminPassInput.addEventListener('keydown', (e) => { 
    if (e.key === 'Enter') {
        e.preventDefault();
        tryLogin(); 
    }
});

async function tryLogin() {
    const pass = adminPassInput.value.trim();
    if (!pass) {
        loginMsg.style.color = '#ff4757';
        loginMsg.textContent = '❌ Vui lòng nhập mật khẩu Admin!';
        return;
    }

    loginMsg.style.color = '#00d4ff';
    loginMsg.textContent = '⏳ Đang xác thực mật khẩu với Server...';
    loginBtn.disabled = true;

    try {
        const res = await fetch('/api/admin/keys?pass=' + encodeURIComponent(pass), {
            method: 'GET',
            headers: { 'admin-pass': pass }
        });
        const data = await res.json();
        loginBtn.disabled = false;

        if (data.success) {
            adminPass = pass;
            localStorage.setItem('tranduc_admin_pass', pass);
            loginBox.style.display = 'none';
            dashboard.style.display = 'block';
            renderKeys(data.keys);
        } else {
            loginMsg.style.color = '#ff4757';
            loginMsg.textContent = '❌ ' + (data.msg || 'Mật khẩu sai!');
            localStorage.removeItem('tranduc_admin_pass');
        }
    } catch (e) {
        loginBtn.disabled = false;
        loginMsg.style.color = '#ff4757';
        loginMsg.textContent = '❌ Không thể kết nối đến Key Server! Vui lòng thử lại.';
    }
}

async function loadKeys() {
    if (!adminPass) return;
    try {
        const res = await fetch('/api/admin/keys?pass=' + encodeURIComponent(adminPass), {
            headers: { 'admin-pass': adminPass }
        });
        const data = await res.json();
        if (data.success) {
            renderKeys(data.keys);
        }
    } catch (e) {
        console.error('Lỗi tải danh sách key:', e);
    }
}

function renderKeys(keys) {
    allKeysCache = keys || [];
    keyTotalCount.textContent = allKeysCache.length;

    const query = searchInput.value.toLowerCase().trim();
    const filtered = allKeysCache.filter(k => 
        k.key.toLowerCase().includes(query) || 
        (k.note && k.note.toLowerCase().includes(query))
    );

    if (filtered.length === 0) {
        keyTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#7888a2;">Không tìm thấy key nào matching.</td></tr>`;
        return;
    }

    keyTableBody.innerHTML = filtered.map(k => {
        let statusBadge = `<span class="badge badge-active">Active</span>`;
        if (k.status === 'expired') statusBadge = `<span class="badge badge-expired">Hết Hạn</span>`;
        if (k.status === 'banned') statusBadge = `<span class="badge badge-banned">Đã Khoá</span>`;

        let expireStr = 'Vĩnh viễn';
        if (k.expireAt) {
            const exp = new Date(k.expireAt);
            expireStr = exp.toLocaleDateString('vi-VN') + ' ' + exp.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'});
        }

        const machineCount = (k.machines || []).length;
        const maxDev = k.maxDev || 5;

        let machinesHtml = '';
        if ((k.machines && k.machines.length > 0) || (k.bannedMachines && k.bannedMachines.length > 0)) {
            machinesHtml = '<div style="margin-top:6px;font-size:11px;background:#080c14;padding:6px;border-radius:4px;min-width:180px;">';
            
            if (k.machines && k.machines.length > 0) {
                k.machines.forEach((m, idx) => {
                    let dName = (k.deviceNames && k.deviceNames[m]) ? k.deviceNames[m] : m.substring(0,8);
                    machinesHtml += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;border-bottom:1px solid #1e2d4a;padding-bottom:2px;">
                        <span style="color:#00d4ff;" title="${m}">TB ${idx+1}: ${dName}</span>
                        <button class="btn-sm btn-sm-danger" data-action="banDevice" data-key="${k.key}" data-machine="${m}" style="padding:2px 4px;font-size:9px;" title="Cấm thiết bị này">🚫 Cấm</button>
                    </div>`;
                });
            }

            if (k.bannedMachines && k.bannedMachines.length > 0) {
                machinesHtml += `<div style="color:#ff4757;margin-top:5px;margin-bottom:3px;font-weight:bold;">Đã Cấm:</div>`;
                k.bannedMachines.forEach((m, idx) => {
                    let dName = (k.deviceNames && k.deviceNames[m]) ? k.deviceNames[m] : m.substring(0,8);
                    machinesHtml += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;border-bottom:1px solid #1e2d4a;padding-bottom:2px;opacity:0.7;">
                        <span style="color:#ff4757;text-decoration:line-through;font-size:10px;" title="${m}">${dName}</span>
                        <button class="btn-sm btn-sm-success" data-action="unbanDevice" data-key="${k.key}" data-machine="${m}" style="padding:2px 4px;font-size:9px;" title="Gỡ cấm thiết bị này">🔓 Mở</button>
                    </div>`;
                });
            }
            machinesHtml += '</div>';
        }

        return `
            <tr>
                <td class="key-code">${k.key}</td>
                <td>
                    ${machineCount}/${maxDev} máy
                    ${machinesHtml}
                </td>
                <td>${expireStr}</td>
                <td>${statusBadge}</td>
                <td style="color:#a0b0c0;font-size:12px;">${k.note || '—'}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-sm" data-action="reset" data-key="${k.key}" title="Xoá tất cả máy đang gắn với key này">🔄 Reset HWID</button>
                        <button class="btn-sm" data-action="ban" data-key="${k.key}" title="Khóa/Mở khóa key">${k.status === 'banned' ? '🔓 Mở khóa' : '🔒 Khóa'}</button>
                        <button class="btn-sm btn-sm-danger" data-action="delete" data-key="${k.key}" title="Xóa vĩnh viễn key">🗑️ Xóa</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Event Delegation for Table Buttons
keyTableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const key = btn.getAttribute('data-key');

    if (action === 'reset') resetHwid(key);
    if (action === 'ban') toggleBan(key);
    if (action === 'delete') deleteKey(key);
    if (action === 'banDevice') {
        const machine = btn.getAttribute('data-machine');
        banDevice(key, machine);
    }
    if (action === 'unbanDevice') {
        const machine = btn.getAttribute('data-machine');
        unbanDevice(key, machine);
    }
});

searchInput.addEventListener('input', () => renderKeys(allKeysCache));
btnRefresh.addEventListener('click', loadKeys);

btnCreateKey.addEventListener('click', async () => {
    createMsg.textContent = '⏳ Đang tạo...';
    createMsg.style.color = '#00d4ff';

    const payload = {
        adminPass: adminPass,
        customKey: newCustomKey.value.trim(),
        days: parseInt(newKeyDays.value) || 0,
        maxDev: parseInt(newMaxDev.value) || 5,
        note: newNote.value.trim()
    };

    try {
        const res = await fetch('/api/admin/create-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'admin-pass': adminPass },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            createMsg.style.color = '#2ed573';
            createMsg.textContent = `✅ ${data.msg} Mã: ${data.keyData.key}`;
            newCustomKey.value = '';
            newNote.value = '';
            loadKeys();
        } else {
            createMsg.style.color = '#ff4757';
            createMsg.textContent = `❌ ${data.msg}`;
        }
    } catch (e) {
        createMsg.style.color = '#ff4757';
        createMsg.textContent = '❌ Lỗi kết nối Server!';
    }
});

async function resetHwid(key) {
    if (!confirm(`Bạn có chắc muốn Reset HWID cho key: ${key}?`)) return;
    try {
        const res = await fetch('/api/admin/reset-hwid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'admin-pass': adminPass },
            body: JSON.stringify({ adminPass: adminPass, key: key })
        });
        const data = await res.json();
        alert(data.msg);
        loadKeys();
    } catch (e) { alert('Lỗi kết nối server!'); }
}

async function toggleBan(key) {
    try {
        const res = await fetch('/api/admin/toggle-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'admin-pass': adminPass },
            body: JSON.stringify({ adminPass: adminPass, key: key })
        });
        const data = await res.json();
        loadKeys();
    } catch (e) { alert('Lỗi kết nối server!'); }
}

async function deleteKey(key) {
    if (!confirm(`CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN key: ${key}?`)) return;
    try {
        const res = await fetch('/api/admin/delete-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'admin-pass': adminPass },
            body: JSON.stringify({ adminPass: adminPass, key: key })
        });
        const data = await res.json();
        alert(data.msg);
        loadKeys();
    } catch (e) { alert('Lỗi kết nối server!'); }
}

async function banDevice(key, machineId) {
    if (!confirm(`Bạn có chắc muốn CẤM thiết bị này sử dụng key ${key}?`)) return;
    try {
        const res = await fetch('/api/admin/ban-device', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'admin-pass': adminPass },
            body: JSON.stringify({ adminPass: adminPass, key: key, machineId: machineId })
        });
        const data = await res.json();
        alert(data.msg);
        loadKeys();
    } catch (e) { alert('Lỗi kết nối server!'); }
}

async function unbanDevice(key, machineId) {
    if (!confirm(`Bạn có chắc muốn MỞ KHÓA cho thiết bị này?`)) return;
    try {
        const res = await fetch('/api/admin/unban-device', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'admin-pass': adminPass },
            body: JSON.stringify({ adminPass: adminPass, key: key, machineId: machineId })
        });
        const data = await res.json();
        alert(data.msg);
        loadKeys();
    } catch (e) { alert('Lỗi kết nối server!'); }
}

init();
