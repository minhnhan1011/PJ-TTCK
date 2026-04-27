# 📋 Hướng Dẫn Sử Dụng Hệ Thống Quản Lý Phòng Khám — ClinicFlow

**Phiên bản:** 2.0  
**Cập nhật:** 20/04/2026  
**Hệ thống:** PJ-TTCK — ClinicFlow (Quản lý Phòng khám)  
**Nền tảng:** React + Express.js + MySQL  
**Cổng truy cập:** Frontend `:3000` | Backend `:4000`

---

## 📑 Mục Lục

1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Đăng Nhập & Tài Khoản](#2-đăng-nhập--tài-khoản)
3. [Hướng Dẫn Theo Vai Trò](#3-hướng-dẫn-theo-vai-trò)
   - 3.1. [Quản Trị Viên (Admin)](#31-vai-trò-quản-trị-viên-admin)
   - 3.2. [Lễ Tân (Tiếp Nhận)](#32-vai-trò-lễ-tân-tiếp-nhận)
   - 3.3. [Bác Sĩ (Khám Bệnh)](#33-vai-trò-bác-sĩ-khám-bệnh)
   - 3.4. [Kỹ Thuật Viên (Xét Nghiệm)](#34-vai-trò-kỹ-thuật-viên-xét-nghiệm)
   - 3.5. [Dược Sĩ (Quản Lý Thuốc)](#35-vai-trò-dược-sĩ-quản-lý-thuốc)
4. [Bảng Phân Quyền Tổng Hợp](#4-bảng-phân-quyền-tổng-hợp)
5. [Danh Sách Trang & Đường Dẫn](#5-danh-sách-trang--đường-dẫn)
6. [Lỗi Thường Gặp & Giải Pháp](#6-lỗi-thường-gặp--giải-pháp)
7. [Checklist Hàng Ngày & Mẹo](#7-checklist-hàng-ngày--mẹo)

---

## 1. Tổng Quan Hệ Thống

### Mục Đích
Hệ thống ClinicFlow được thiết kế để tin học hóa toàn bộ quy trình phòng khám:
- ✅ Tiếp nhận & quản lý hồ sơ bệnh nhân
- ✅ Đăng ký khám & phân luồng bác sĩ
- ✅ Khám bệnh & chẩn đoán
- ✅ Chỉ định xét nghiệm & cận lâm sàng
- ✅ Kê đơn thuốc (hỗ trợ chọn theo loại thuốc)
- ✅ Quản lý kho thuốc & cảnh báo hạn sử dụng
- ✅ Thanh toán & in hóa đơn

### Cấu Trúc Giao Diện

**Trên Desktop (≥ 768px):**
```
┌──────────────────────────────────────────────┐
│  HEADER (64px) — Tên người dùng, Đăng xuất   │
├───────────────┬──────────────────────────────┤
│               │                              │
│   SIDEBAR     │    NỘI DUNG CHÍNH            │
│   (16rem)     │    (Cuộn được)               │
│               │                              │
│ 🏠 Dashboard  │  ┌─ Thẻ thống kê ──────┐    │
│ 👤 Bệnh nhân  │  │ 📊 4 ô thống kê     │    │
│ 📋 Đăng ký    │  └─────────────────────┘    │
│ 🩺 Khám bệnh  │  ┌─ Thanh tìm kiếm ───┐    │
│ 🧪 Xét nghiệm │  │ 🔍 + Bộ lọc        │    │
│ 💊 Thuốc      │  └─────────────────────┘    │
│ 📦 Loại thuốc  │  ┌─ Bảng dữ liệu ────┐    │
│ 💉 Đơn thuốc  │  │ Danh sách + CRUD   │    │
│ 🏥 Dịch vụ    │  └─────────────────────┘    │
│ 💰 Thanh toán │                              │
│ 👥 Nhân viên  │                              │
│               │                              │
│ 🚪 Đăng xuất  │                              │
└───────────────┴──────────────────────────────┘
```

**Trên Mobile (< 768px):**
```
┌──────────────────────────┐
│ ☰  HEADER (56px)   👤    │
├──────────────────────────┤
│                          │
│   NỘI DUNG CHÍNH        │
│   (Toàn màn hình)       │
│                          │
│  Thẻ thống kê (2 cột)   │
│  Thanh tìm kiếm         │
│  Bảng cuộn ngang ←→     │
│                          │
└──────────────────────────┘

  Nhấn ☰ → Sidebar trượt vào từ trái
  Nhấn overlay → Đóng sidebar
```

> **Lưu ý:** Sidebar trên mobile là dạng drawer (trượt), có nút ☰ hamburger ở góc trái Header.

---

## 2. Đăng Nhập & Tài Khoản

### 2.1. Đăng Nhập (`/login`)

**Giao diện:** Thẻ đăng nhập nằm giữa màn hình (350px, mobile thu nhỏ 90vw)

**Bước 1:** Truy cập hệ thống → trang Login hiển thị

**Bước 2:** Nhập thông tin:
- **Tên đăng nhập** (`tendn`) — do quản trị viên cấp
- **Mật khẩu** (`matkhau`)

**Bước 3:** Nhấn **[Đăng Nhập]** → hệ thống xác thực qua JWT cookie → chuyển đến trang chủ

> ⚠️ Khi đang xử lý, nút Đăng nhập sẽ hiển thị vòng tròn loading (Ant Design Spin).

**Tài khoản có sẵn trong hệ thống:**
| Vai Trò | Username | Chức năng chính |
|---------|----------|----------------|
| Quản trị viên | `admin` | Dashboard, Bệnh nhân, Nhân viên, Dịch vụ, Loại thuốc, Thuốc, Thanh toán |
| Lễ tân | `tieptan` | Bệnh nhân, Nhân viên, Đăng ký khám, Dịch vụ, Đơn thuốc, Thanh toán |
| Bác sĩ | `bacsi` | Khám bệnh, Đơn thuốc, Xét nghiệm |
| Dược sĩ | `duocsi` | Loại thuốc, Thuốc, Đơn thuốc |
| Kỹ thuật viên | `ktv` | Khám bệnh, Xét nghiệm |

### 2.2. Đăng Ký (`/register`)

**Giao diện:** Thẻ đăng ký nằm giữa (400px, mobile thu nhỏ 90vw)

**Các trường cần điền:**
| Trường | Bắt buộc | Validation |
|--------|:--------:|-----------|
| Họ tên | ✅ | Không để trống |
| Tên đăng nhập | ✅ | Trùng → báo lỗi |
| Email | ✅ | Định dạng email |
| Số điện thoại | ✅ | |
| Mật khẩu | ✅ | Tối thiểu 6 ký tự |
| Xác nhận mật khẩu | ✅ | Phải trùng mật khẩu |

Sau khi đăng ký thành công → tự động chuyển về trang Login sau 2 giây.

### 2.3. Quên Mật Khẩu (`/forgot-password`)

**Giao diện:** Thẻ khôi phục (380px, mobile thu nhỏ 90vw)

Nhập email đã đăng ký → Nhấn **[Gửi]** → Chờ hướng dẫn qua email.

> ℹ️ Tính năng này hiện đang phát triển. Nếu cần đặt lại mật khẩu, liên hệ quản trị viên.

---

## 3. Hướng Dẫn Theo Vai Trò

---

### 3.1. VAI TRÒ: QUẢN TRỊ VIÊN (Admin)

**Menu hiển thị:** Dashboard, Bệnh nhân, Nhân viên, Dịch vụ, Loại thuốc, Thuốc, Thanh toán

#### A. Trang chủ — Dashboard (`/`)

Hiển thị "Bảng điều khiển Giám đốc" gồm:
- **4 thẻ thống kê:** Bệnh nhân hôm nay, Đang chờ khám, Đã khám xong, Doanh thu hôm nay
- **Bảng hàng đợi khám:** Danh sách bệnh nhân chờ khám với cột: STT, Tên BN, Bác sĩ, Trạng thái
- **Nút "Đăng ký khám mới":** Chuyển đến trang Đăng ký khám

#### B. Quản Lý Nhân Viên (`/nhan-vien`)

**📌 Mục đích:** Quản lý danh sách nhân sự phòng khám

**Giao diện:** Sử dụng Ant Design — bảng có phân trang, tìm kiếm tức thì

**Thêm Nhân Viên:**
```
[+ Thêm nhân viên] → Modal form hiện lên → Điền → [Lưu]
```

| Trường | Bắt buộc | Ghi chú |
|--------|:--------:|---------|
| Họ tên | ✅ | |
| Chức vụ | ✅ | Chọn: Bác sĩ / Y tá / Kế toán / Kỹ thuật viên |
| Số điện thoại | ✅ | Đúng 10 số |
| Địa chỉ | ❌ | |

**Sửa/Xóa:** Nhấn nút hành động trên từng dòng → Modal sửa hoặc xác nhận xóa

#### C. Quản Lý Dịch Vụ (`/dich-vu`)

**📌 Mục đích:** CRUD dịch vụ cận lâm sàng (Siêu âm, X-Quang, Xét nghiệm máu...)

**Bảng hiển thị:** Mã DV (tự tạo: DV1, DV2...), Tên DV, Giá (định dạng tiền tệ VNĐ), Trạng thái (badge màu), Hành động

**Thêm/Sửa Dịch vụ** qua modal riêng:
| Trường | Bắt buộc | Ví dụ |
|--------|:--------:|-------|
| Tên dịch vụ | ✅ | Xét nghiệm máu |
| Giá | ✅ | 200000 |
| Trạng thái | ✅ | Hoạt động / Ngừng hoạt động |

**Xóa:** Nhấn nút 🗑️ → hộp thoại xác nhận → nhấn Đồng ý

#### D. Quản Lý Loại Thuốc (`/loai-thuoc`)

**📌 Mục đích:** Tạo và quản lý danh mục phân loại thuốc

**Bảng:** Mã loại (LT-001, LT-002...), Tên loại, Số lượng thuốc thuộc loại này

> ⚠️ **Chỉ Admin** mới có quyền thêm/sửa/xóa loại thuốc. Vai trò khác chỉ xem.
> ❌ Không thể xóa loại thuốc nếu còn thuốc thuộc loại đó.

#### E. Quản Lý Thuốc (`/thuoc`)

**📌 Mục đích:** Quản lý kho thuốc, theo dõi hạn sử dụng, số lượng tồn

**Giao diện:** Sử dụng Ant Design — 4 badge thống kê phía trên + bảng + bộ lọc

**4 Badge thống kê:**
- 📦 Tổng thuốc
- ⚠️ Sắp hết hàng (tồn kho ≤ 5)
- 🟡 Sắp hết hạn (< 6 tháng)
- 🔴 Đã hết hạn

**Bộ lọc:** Tìm kiếm theo tên + dropdown: Tất cả / Sắp hết hàng / Sắp hết hạn / Đã hết hạn

**Form Thêm/Sửa thuốc:**
| Trường | Bắt buộc | Ghi chú |
|--------|:--------:|---------|
| Tên thuốc | ✅ | VD: Paracetamol |
| Loại thuốc | ✅ | Chọn từ danh sách loại thuốc |
| Đơn giá | ✅ | VNĐ |
| Số lượng | ✅ | Số nguyên |
| Đơn vị tính | ✅ | Viên / Hộp / Lọ |
| Ngày sản xuất | ✅ | |
| Hạn sử dụng | ✅ | |

**Mã màu trạng thái:**
- 🟢 **Xanh:** Còn hạn, đủ số lượng
- 🟠 **Cam:** Sắp hết hạn (< 6 tháng)
- 🔴 **Đỏ:** Đã hết hạn

#### F. Thanh Toán (`/thanh-toan`)

*(Xem chi tiết tại mục 3.2.E — Lễ Tân)*

---

### 3.2. VAI TRÒ: LỄ TÂN (Tiếp Nhận)

**Menu hiển thị:** Bệnh nhân, Nhân viên, Đăng ký khám, Dịch vụ, Đơn thuốc, Thanh toán

#### A. Quản Lý Bệnh Nhân (`/benh-nhan`)

**📌 Mục đích:** CRUD hồ sơ bệnh nhân

**Giao diện riêng:** Layout tùy chỉnh (không dùng Ant Design) — 4 thẻ thống kê + tìm kiếm + bảng + modal

**4 Thẻ thống kê:**
- 👥 Tổng bệnh nhân
- 🏥 Đang điều trị
- 🆕 Mới hôm nay
- 🔄 Tái khám

**Bảng hiển thị:** Mã BN, Họ tên, Giới tính, Ngày sinh, SĐT, Địa chỉ (rút gọn nếu dài), Sửa/Xóa

**Thêm Bệnh Nhân:**
```
[+ Thêm Bệnh Nhân] → Modal → Điền form → [Lưu]
```

| Trường | Bắt buộc | Ghi chú |
|--------|:--------:|---------|
| Mã BN | ✅ | Tự sinh hoặc nhập tay |
| Họ tên | ✅ | |
| Ngày sinh | ✅ | Chọn ngày |
| Giới tính | ✅ | Nam / Nữ |
| SĐT | ✅ | |
| Địa chỉ | ✅ | |

**Sửa:** Nhấn ✏️ → Modal sửa (Mã BN chỉ đọc) → [Lưu]

**Xóa:** Nhấn 🗑️ → Xác nhận → Xóa

> ⚠️ Xóa bệnh nhân sẽ ảnh hưởng đến phiếu đăng ký khám liên quan.

#### B. Đăng Ký Khám (`/dang-ky-kham`)

**📌 Mục đích:** Tạo phiếu đăng ký khám, phân luồng bệnh nhân tới bác sĩ

**4 Thẻ thống kê:** Tổng đăng ký, Chờ khám, Đang khám, Hoàn thành

**Tính năng đặc biệt:**
- **Tìm kiếm bệnh nhân thông minh:** Gõ tên → dropdown hiện danh sách BN khớp → chọn → hiện hộp thông tin BN (họ tên, ngày sinh, SĐT, địa chỉ)
- **Lý do khám có sẵn:** Dropdown chọn nhanh — Khám tổng quát, Sốt/Cảm cúm, Đau bụng, Đau đầu, Tai mũi họng, Da liễu, Khác
- **Tự động cập nhật:** Khi chuyển tab rồi quay lại, danh sách tự refresh

**Form Đăng Ký:**
| Trường | Bắt buộc | Mô tả |
|--------|:--------:|-------|
| Bệnh nhân | ✅ | Tìm kiếm và chọn |
| Bác sĩ | ✅ | Chọn từ danh sách bác sĩ |
| Lý do khám | ✅ | Chọn hoặc nhập tay |

**Sửa đăng ký:** Nhấn ✏️ → Cập nhật lý do, bác sĩ, trạng thái

**Trạng thái (badge màu):**
- 🟠 **Chờ khám** (Cho kham)
- 🟢 **Đang khám** (Dang kham)
- 🟣 **Hoàn thành** (Hoan thanh)

> ℹ️ Khi trạng thái chuyển sang "Đang khám", hệ thống **tự động tạo phiếu khám** cho bác sĩ.

#### C. Đơn Thuốc (`/don-thuoc`) — Chỉ Xem

Lễ tân có quyền xem danh sách đơn thuốc nhưng **không thể** thêm/sửa/xóa.

#### E. Thanh Toán (`/thanh-toan`)

**📌 Mục đích:** Lập hóa đơn, thu tiền, in phiếu thu

**Giao diện 2 phần:**

**Phần trên — 4 Thẻ Thống Kê Hôm Nay:**
- 📝 Số hóa đơn hôm nay
- 💰 Tổng doanh thu hôm nay
- ⏳ Chờ thanh toán
- ✅ Đã thanh toán

**Phần dưới — 2 cột:**

| Cột trái: Form tạo phiếu thu | Cột phải: Xem trước hóa đơn |
|-------------------------------|------------------------------|
| Chọn phiếu khám (dropdown) | Tự động render hóa đơn |
| Tổng tiền (tự tính) | Hiển thị chi tiết: dịch vụ + thuốc |
| Phương thức: Tiền mặt | Bệnh nhân, mã phiếu, ngày |
| Ghi chú (tùy chọn) | Tổng tiền |
| [Tạo phiếu thu] [In hóa đơn] | |

**Mã phiếu thu tự sinh:** `PT{YYYYMMDD}{4 số cuối}` — VD: `PT202604200001`

**Bảng lịch sử phiếu thu:** Mã PT, Phiếu khám, NV thu, Tổng tiền, Ngày, Trạng thái, Hành động

**Hủy phiếu thu:** Nhấn nút hủy → Trạng thái chuyển sang "Đã hủy"

**In hóa đơn:** Mở cửa sổ mới → HTML hóa đơn format chuẩn → Ctrl+P để in

---

### 3.3. VAI TRÒ: BÁC SĨ (Khám Bệnh)

**Menu hiển thị:** Khám bệnh, Đơn thuốc, Xét nghiệm

#### A. Khám Bệnh (`/kham-benh`)

**📌 Mục đích:** Quản lý phiếu khám — cập nhật trạng thái, chỉ định xét nghiệm, xem chi phí

**Giao diện:** Thanh tìm kiếm + dropdown lọc trạng thái + bảng

**Bảng hiển thị:** Mã phiếu, STT, Bệnh nhân, Bác sĩ, Ngày đăng ký, Trạng thái, Hành động

**3 nút hành động trên mỗi dòng:**

1. **💰 Xem chi phí** → Modal hiện bảng chi phí:
   - Dịch vụ cận lâm sàng đã chỉ định + giá
   - Thuốc đã kê + giá
   - **Tổng cộng**

2. **✏️ Cập nhật trạng thái** → Modal với radio buttons:
   - ⚪ Chờ khám
   - 🟢 Đang khám
   - ✅ Hoàn thành

3. **🧪 Chỉ định xét nghiệm** → Modal:
   - Chọn dịch vụ xét nghiệm từ dropdown (danh sách dịch vụ)
   - Nhấn **[Xác nhận]** → Phiếu xét nghiệm được đẩy vào hàng đợi cho Kỹ thuật viên

> ℹ️ Hàng đợi xét nghiệm được lưu qua `localStorage` — chỉ hoạt động trên cùng trình duyệt.

#### B. Kê Đơn Thuốc (`/don-thuoc`)

**📌 Mục đích:** Lập đơn thuốc cho bệnh nhân sau khi chẩn đoán

**Giao diện đặc biệt:**
- **Thanh tính tiền:** Chọn phiếu khám → Nhấn **[Tính tiền]** → Hiển thị tổng tiền thuốc
- **Bảng nhóm:** Đơn thuốc được nhóm theo mã đơn (mở rộng/thu gọn bằng chevron ▶)
  - **Dòng cha:** Mã ĐT, Mã PK, Tên BN, Số thuốc
  - **Dòng con:** Loại thuốc, Tên thuốc, Số lượng, Liều dùng, Đơn giá, Thành tiền, Sửa/Xóa

**Thêm đơn thuốc:**
```
[+ Thêm đơn thuốc] → Modal rộng (700px) hiện lên
```

| Trường | Bắt buộc | Ghi chú |
|--------|:--------:|---------|
| Phiếu khám | ✅ | Chọn từ dropdown (hiển thị mã PK + tên BN) |
| Loại thuốc | ✅ | **Cascading select** — chọn loại → lọc thuốc |
| Tên thuốc | ✅ | Tự động lọc theo loại đã chọn |
| Số lượng | ✅ | Số nguyên |
| Liều dùng | ✅ | VD: "Sáng 1, trưa 1, tối 1 — sau ăn" |

**Có thể thêm nhiều dòng thuốc** trong cùng 1 đơn → Nhấn **[+ Thêm thuốc]** bên trong modal

> ⚠️ Vai trò `tieptan` và `duocsi` chỉ có quyền **xem** đơn thuốc, không sửa/xóa.

#### C. Xét Nghiệm (`/xet-nghiem`) — Xem

Bác sĩ có thể xem danh sách xét nghiệm, phê duyệt kết quả.

---

### 3.4. VAI TRÒ: KỸ THUẬT VIÊN (Xét Nghiệm)

**Menu hiển thị:** Khám bệnh, Xét nghiệm

#### A. Xét Nghiệm (`/xet-nghiem`)

**📌 Mục đích:** Nhận phiếu xét nghiệm từ bác sĩ, nhập kết quả, in phiếu kết quả

**Giao diện 2 cột:**

| Cột trái (Hàng đợi) | Cột phải (Form nhập kết quả) |
|---------------------|------------------------------|
| Các thẻ bệnh nhân chờ xét nghiệm | Textarea nhập kết quả (bắt buộc) |
| Hiển thị: Tên BN, Mã, Dịch vụ XN | Textarea ghi chú (tùy chọn) |
| Click vào thẻ → chọn (viền xanh) | Nút [Hoàn thành & In kết quả] |

**Quy trình:**
1. Xem danh sách phiếu chờ ở cột trái
2. Click vào phiếu cần xử lý
3. Nhập kết quả xét nghiệm ở cột phải
4. Nhấn **[Hoàn thành & In kết quả]**
5. → Hệ thống lưu kết quả vào DB + Cập nhật trạng thái = "Đã xét nghiệm"
6. → Mở cửa sổ mới in phiếu kết quả (PDF format)
7. → Phiếu tự động xóa khỏi hàng đợi

**Phiếu kết quả in ra bao gồm:**
- Thông tin phòng khám
- Tên bệnh nhân, mã phiếu
- Tên dịch vụ xét nghiệm
- Kết quả chi tiết
- Ghi chú
- Ngày giờ thực hiện

---

### 3.5. VAI TRÒ: DƯỢC SĨ (Quản Lý Thuốc)

**Menu hiển thị:** Loại thuốc, Thuốc, Đơn thuốc

#### A. Loại Thuốc (`/loai-thuoc`) — Chỉ Xem

Dược sĩ xem danh sách loại thuốc nhưng **không có quyền thêm/sửa/xóa** (chỉ Admin có).

#### B. Quản Lý Thuốc (`/thuoc`)

*(Xem chi tiết tại mục 3.1.E — Admin)*

Dược sĩ có đầy đủ quyền CRUD thuốc:
- Thêm thuốc mới vào kho
- Cập nhật số lượng, giá, hạn sử dụng
- Theo dõi cảnh báo hết hàng / hết hạn

#### C. Đơn Thuốc (`/don-thuoc`) — Chỉ Xem

Dược sĩ xem đơn thuốc để cấp phát, nhưng **không thể sửa/xóa**.

---

## 4. Bảng Phân Quyền Tổng Hợp

| Trang | Đường dẫn | Admin | Lễ Tân | Bác Sĩ | Dược Sĩ | KTV |
|-------|-----------|:-----:|:------:|:------:|:-------:|:---:|
| Dashboard | `/` | ✅ | ❌ | ❌ | ❌ | ❌ |
| Bệnh nhân | `/benh-nhan` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Đăng ký khám | `/dang-ky-kham` | ❌ | ✅ | ❌ | ❌ | ❌ |
| Khám bệnh | `/kham-benh` | ❌ | ❌ | ✅ | ❌ | ✅ |
| Xét nghiệm | `/xet-nghiem` | ❌ | ❌ | ✅ | ❌ | ✅ |
| Dịch vụ | `/dich-vu` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Loại thuốc | `/loai-thuoc` | ✅ CRUD | ❌ | ❌ | 🔍 Xem | ❌ |
| Thuốc | `/thuoc` | ✅ | ❌ | ❌ | ✅ | ❌ |
| Đơn thuốc | `/don-thuoc` | ❌ | 🔍 Xem | ✅ CRUD | 🔍 Xem | ❌ |
| Thanh toán | `/thanh-toan` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Nhân viên | `/nhan-vien` | ✅ | ✅ | ❌ | ❌ | ❌ |

*Chú thích:* ✅ = Đầy đủ quyền | 🔍 = Chỉ xem | ❌ = Không hiện trên sidebar

> ⚠️ Phân quyền hiện tại **chỉ ẩn menu trên sidebar** (client-side). Các đường dẫn URL vẫn có thể truy cập trực tiếp.

---

## 5. Danh Sách Trang & Đường Dẫn

| # | Trang | Đường dẫn | Mô tả ngắn |
|---|-------|-----------|-------------|
| 1 | Dashboard | `/` | Trang chủ, thống kê, hàng đợi khám |
| 2 | Đăng nhập | `/login` | Xác thực người dùng (JWT) |
| 3 | Đăng ký | `/register` | Tạo tài khoản mới |
| 4 | Quên mật khẩu | `/forgot-password` | Khôi phục mật khẩu qua email |
| 5 | Bệnh nhân | `/benh-nhan` | CRUD hồ sơ bệnh nhân |
| 6 | Đăng ký khám | `/dang-ky-kham` | Tạo phiếu khám, phân bác sĩ |
| 7 | Khám bệnh | `/kham-benh` | Quản lý phiếu khám, chỉ định XN |
| 8 | Xét nghiệm | `/xet-nghiem` | Nhập kết quả, in phiếu XN |
| 9 | Dịch vụ | `/dich-vu` | CRUD dịch vụ cận lâm sàng |
| 10 | Loại thuốc | `/loai-thuoc` | CRUD danh mục loại thuốc |
| 11 | Thuốc | `/thuoc` | CRUD kho thuốc + cảnh báo |
| 12 | Đơn thuốc | `/don-thuoc` | Kê đơn, tính tiền thuốc |
| 13 | Thanh toán | `/thanh-toan` | Lập hóa đơn, in phiếu thu |
| 14 | Nhân viên | `/nhan-vien` | CRUD nhân viên phòng khám |

---

## 6. Lỗi Thường Gặp & Giải Pháp

### 6.1. Không Thể Đăng Nhập

**❌ Vấn đề:** "Sai tên đăng nhập hoặc mật khẩu"

**✅ Giải pháp:**
- Kiểm tra chính tả tên đăng nhập
- Kiểm tra Caps Lock
- Xóa cookie trình duyệt rồi thử lại
- Liên hệ quản trị viên

### 6.2. Trang Trắng / Không Có Dữ Liệu

**❌ Vấn đề:** Vào trang nhưng không hiển thị gì

**✅ Giải pháp:**
- Nhấn **F5** hoặc **Ctrl+F5** để tải lại
- Kiểm tra backend đang chạy (port 4000)
- Kiểm tra MySQL đang chạy
- Xóa cache: **Ctrl+Shift+Delete**

### 6.3. Không Thể Lưu Dữ Liệu

**❌ Vấn đề:** Nhấn Lưu nhưng không có phản hồi

**✅ Giải pháp:**
- Kiểm tra tất cả trường bắt buộc đã điền đủ
- Kiểm tra định dạng:
  - Số điện thoại: 10 số
  - Mật khẩu: ≥ 6 ký tự
  - Email: định dạng hợp lệ
- Mở Developer Tools (F12) → tab Console xem lỗi cụ thể

### 6.4. Xét Nghiệm Không Thấy Phiếu Chờ

**❌ Vấn đề:** Kỹ thuật viên vào trang Xét nghiệm nhưng hàng đợi trống

**✅ Giải pháp:**
- Phiếu xét nghiệm được lưu qua **localStorage** của trình duyệt
- Đảm bảo bác sĩ đã chỉ định xét nghiệm **trên cùng trình duyệt/máy tính**
- Nếu dùng máy khác, phiếu sẽ không hiện → cần chỉ định lại

### 6.5. Không Thể Xóa Dữ Liệu

**❌ Vấn đề:** Xóa báo lỗi

**✅ Giải pháp:**
- Dữ liệu đang được tham chiếu bởi bảng khác:
  - Xóa phiếu khám/đăng ký khám trước khi xóa bệnh nhân
  - Xóa đơn thuốc trước khi xóa thuốc
  - Xóa thuốc thuộc loại trước khi xóa loại thuốc
- Kiểm tra quyền hạn vai trò

### 6.6. Modal Bị Che Bởi Sidebar (Mobile)

**❌ Vấn đề:** Trên điện thoại, mở modal nhưng sidebar đè lên

**✅ Giải pháp:**
- Đóng sidebar trước khi thao tác trên modal
- Nhấn overlay (vùng tối) để đóng sidebar
- Nếu vẫn bị che → tải lại trang

### 6.7. Bảng Dữ Liệu Tràn Ngang (Mobile)

**❌ Vấn đề:** Bảng hiển thị quá rộng trên điện thoại, bị cắt

**✅ Giải pháp:**
- Vuốt ngang trên bảng để xem các cột ẩn
- Xoay ngang điện thoại (landscape)
- Sử dụng tablet hoặc máy tính cho thao tác phức tạp

---

## 7. Checklist Hàng Ngày & Mẹo

### 📋 Checklist theo vai trò

**👤 Lễ Tân:**
- [ ] Kiểm tra bệnh nhân mới cần đăng ký
- [ ] Đăng ký khám cho bệnh nhân chờ
- [ ] Phân luồng bệnh nhân đến đúng bác sĩ

**👨‍⚕️ Bác Sĩ:**
- [ ] Kiểm tra danh sách bệnh nhân chờ khám
- [ ] Cập nhật trạng thái phiếu khám
- [ ] Chỉ định xét nghiệm nếu cần
- [ ] Kê đơn thuốc cho bệnh nhân đã khám

**🧪 Kỹ Thuật Viên:**
- [ ] Kiểm tra hàng đợi xét nghiệm
- [ ] Nhập kết quả và in phiếu kết quả
- [ ] Đảm bảo tất cả phiếu đã hoàn thành

**💊 Dược Sĩ:**
- [ ] Kiểm tra cảnh báo thuốc sắp hết hạn
- [ ] Kiểm tra thuốc sắp hết tồn kho (≤ 5)
- [ ] Cập nhật số lượng sau mỗi lần xuất kho

**‍💼 Admin:**
- [ ] Xem dashboard thống kê
- [ ] Kiểm tra nhân sự và dịch vụ
- [ ] Backup dữ liệu định kỳ

### ⌨️ Phím Tắt Hữu Ích

| Phím | Chức Năng |
|------|-----------|
| **F5** | Tải lại trang |
| **Ctrl+F5** | Tải lại + xóa cache |
| **Ctrl+P** | In trang / hóa đơn |
| **Ctrl+F** | Tìm kiếm trên trang |
| **Escape** | Đóng modal / popup |
| **F12** | Mở Developer Tools (xem lỗi) |

### 🔒 Bảo Mật

- ✅ Đăng xuất sau khi sử dụng (nút Đăng xuất ở sidebar hoặc header)
- ✅ Không chia sẻ mật khẩu
- ✅ Không lưu mật khẩu trên máy tính dùng chung
- ✅ Báo quản trị viên nếu nghi ngờ tài khoản bị xâm nhập

### 📞 Hỗ Trợ

| Vấn đề | Liên hệ |
|--------|---------|
| Lỗi kỹ thuật / mất kết nối | Bộ phận IT |
| Quên mật khẩu | Quản trị viên |
| Phân quyền / tài khoản | Quản trị viên |
| Báo cáo bug | IT Support — kèm ảnh chụp lỗi |

---

**Cảm ơn bạn đã sử dụng hệ thống ClinicFlow — Quản Lý Phòng Khám PJ-TTCK!** 🎉
