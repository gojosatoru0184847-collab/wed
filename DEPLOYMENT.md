# Key Manager - GitHub Pages Version

Hệ thống quản lý key FF được host trên GitHub Pages.

## 🌐 Truy cập

**Admin Panel (Cần mật khẩu):**
- https://gojosatoru0184847-collab.github.io/wed/admin-login.html
- Mật khẩu mặc định: `admin123`

**Kích hoạt Key (Công khai):**
- https://gojosatoru0184847-collab.github.io/wed/activate.html

**Web chính:**
- https://gojosatoru0184847-collab.github.io/wed/

---

## 📁 Cấu trúc thư mục

```
/
├── index.html              # Trang chính
├── admin-login.html        # Đăng nhập Admin
├── admin-panel.html        # Quản lý Key (sau khi login)
├── activate.html           # Kích hoạt Key (công khai)
├── server.js               # Backend (nếu chạy local)
├── Archive/                # Web files gốc
└── README.md              # File này
```

---

## 🔑 Dữ liệu

- **Lưu trữ:** Browser LocalStorage + File JSON
- **Không cần server:** Chạy hoàn toàn trên phía client
- **An toàn:** Mật khẩu lưu trong sessionStorage (xóa khi đóng tab)

---

## 🚀 Tính năng

✅ **Admin Panel:**
- Tạo key mới
- Quản lý trạng thái (Chưa dùng / Đã bán / Đã dùng)
- Xem danh sách key
- Xóa key
- Thống kê key

✅ **Kích hoạt Key:**
- Nhập key để kích hoạt
- Xem chi tiết key
- Lưu lịch sử

✅ **Bảo mật:**
- Mật khẩu login Admin
- Session protection
- LocalStorage encryption (tuỳ chọn)

---

## 🔄 Cập nhật Mật khẩu

Mở file `admin-login.html`, tìm:
```javascript
const ADMIN_PASSWORD = "admin123";
```
Thay giá trị mới vào đó.

---

## ⚠️ Lưu ý

- Dữ liệu lưu trên **localStorage** của browser mỗi user
- Nếu muốn dữ liệu **chung** cho tất cả user → cần backend server
- GitHub Pages chỉ support static files (HTML, CSS, JS)

---

## 🛠️ Nâng cấp (Tuỳ chọn)

Nếu muốn backend server + database:
1. Deploy server Node.js lên Heroku/Railway/Render
2. Sửa API endpoint trong HTML files
3. Dữ liệu sẽ lưu trên server centralized

---

Made with ❤️ by DEV TRANDUC
