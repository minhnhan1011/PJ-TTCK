# 📋 Hướng Dẫn Sử Dụng Hệ Thống Quản Lý Phòng Khám

**Phiên bản:** 1.0  
**Cập nhật:** April 2026  
**Hệ thống:** PJ-TTCK (Phòng Khám Tư Nhân)

---

## 📑 Mục Lục

1. [Tổng Quan Hệ Thống](#tổng-quan-hệ-thống)
2. [Đăng Nhập & Tài Khoản](#đăng-nhập--tài-khoản)
3. [Hướng Dẫn Theo Vai Trò](#hướng-dẫn-theo-vai-trò)
4. [Các Chức Năng Chính](#các-chức-năng-chính)
5. [Lỗi Thường Gặp & Giải Pháp](#lỗi-thường-gặp--giải-pháp)

---

## 🏥 Tổng Quan Hệ Thống

### Mục Đích
Hệ thống Quản lý Phòng khám (PJ-TTCK) được thiết kế để tin học hóa toàn bộ quy trình từ:
- ✅ Tiếp nhận bệnh nhân
- ✅ Khám bệnh
- ✅ Xét nghiệm & Cận lâm sàng
- ✅ Kê đơn thuốc
- ✅ Thanh toán hóa đơn

### Cấu Trúc Giao Diện

```
┌─────────────────────────────────────────┐
│  📱 THANH TIÊU ĐỀ (Header)              │
│  [Logo] Tên Hệ Thống  [Tài khoản] [❌]  │
├──────────────┬───────────────────────────┤
│              │                           │
│  SIDEBAR     │   NỘI DUNG CHÍNH         │
│  (Menu)      │   (Main Content Area)    │
│              │                           │
│ 📌 Bệnh nhân │   - Danh sách            │
│ 📋 Khám bệnh │   - Biểu mẫu             │
│ 🧪 Xét nghiệm│   - Dữ liệu chi tiết     │
│ 💊 Thuốc     │                           │
│ 💰 Thanh toán│                           │
│ 👥 Nhân viên │                           │
│              │                           │
└──────────────┴───────────────────────────┘
```

---

## 🔐 Đăng Nhập & Tài Khoản

### 1️⃣ Đăng Nhập

**Bước 1:** Mở ứng dụng, bạn sẽ thấy trang Đăng nhập

**Bước 2:** Nhập thông tin
- **Tên đăng nhập:** Tên do quản trị viên cấp
- **Mật khẩu:** Mật khẩu bảo mật

**Bước 3:** Nhấn nút **[Đăng Nhập]**

> ⚠️ **Lưu ý:** Bảo mật tài khoản là trách nhiệm của bạn. Không chia sẻ mật khẩu với người khác.

**Tài khoản mẫu hiện có:**
| Vai Trò | Username | Mật khẩu | Chức năng |
|---------|----------|----------|----------|
| Quản trị viên | admin | 123 | Quản lý toàn hệ thống |
| Bác sĩ | bacsi | 123 | Khám bệnh, kê đơn |
| Lễ tân | tieptan | 123 | Quản lý bệnh nhân, đăng ký khám |
| Dược sĩ | duocsi | 123 | Quản lý kho thuốc |
| Thu ngân | thungan | 123 | Xử lý thanh toán |
| Kỹ thuật viên | ktv | 123 | Xét nghiệm, cận lâm sàng |

### 2️⃣ Đăng Ký Tài Khoản Mới

**Bước 1:** Ở trang Đăng nhập, nhấn **[Đăng Ký]**

**Bước 2:** Điền đầy đủ thông tin:
- Họ tên (*)
- Email (*)
- Số điện thoại (*)
- Tên đăng nhập (*)
- Mật khẩu (*)
- Xác nhận mật khẩu (*)

(*) = Trường bắt buộc

**Bước 3:** Nhấn **[Tạo Tài Khoản]**

> ℹ️ Tài khoản mới sẽ cần được quản trị viên phê duyệt trước khi sử dụng.

### 3️⃣ Quên Mật Khẩu

**Bước 1:** Tại trang Đăng nhập, nhấn **[Quên Mật Khẩu?]**

**Bước 2:** Nhập email hoặc số điện thoại của bạn

**Bước 3:** Nhấn **[Gửi Hướng Dẫn Khôi Phục]**

**Bước 4:** Kiểm tra email/SMS, làm theo hướng dẫn đặt lại mật khẩu

---

## 👤 Hướng Dẫn Theo Vai Trò

### 🏛️ VAI TRÒ: LỄ TÂN (Tiếp Nhận)

#### Chức Năng Chính
Lề tân chịu trách nhiệm tiếp nhận bệnh nhân và tạo hồ sơ ban đầu.

#### 1. Quản Lý Bệnh Nhân (BenhNhanPage)

**📌 Mục đích:** Lưu trữ thông tin hành chính của bệnh nhân

**Xem Danh Sách Bệnh Nhân**
```
Sidebar → Bệnh Nhân
```
- Hiển thị tất cả bệnh nhân đã đăng ký
- Có thể tìm kiếm, sắp xếp theo tên hoặc mã BN

**Thêm Bệnh Nhân Mới**
```
[+ Thêm Bệnh Nhân] → Điền form → [Lưu]
```

| Trường | Bắt buộc | Ghi chú |
|--------|----------|---------|
| Họ tên | ✅ | VD: Nguyễn Văn A |
| Ngày sinh | ✅ | Định dạng: DD/MM/YYYY |
| Giới tính | ✅ | Nam / Nữ |
| Số điện thoại | ✅ | VD: 0912345678 |
| Địa chỉ | ✅ | Địa chỉ liên lạc đầy đủ |

**Tìm Kiếm Bệnh Nhân**
```
[🔍 Tìm kiếm] → Nhập tên hoặc mã BN → Enter
```

**Cập Nhật Thông Tin**
```
Chọn bệnh nhân → [✏️ Sửa] → Thay đổi thông tin → [Lưu]
```

**Xóa Bệnh Nhân**
```
Chọn bệnh nhân → [🗑️ Xóa] → Xác nhận xóa
```

> ⚠️ **Cảnh báo:** Xóa bệnh nhân sẽ xóa tất cả hồ sơ liên quan. Hãy thận trọng!

#### 2. Đăng Ký Khám (DangKyKhamPage)

**📌 Mục đích:** Tạo phiếu khám để bệnh nhân được phân luồng tới bác sĩ

**Quy Trình Đăng Ký**
```
[Thêm Đăng Ký] → Chọn Bệnh Nhân → Chọn Bác Sĩ → Nhập Lý Do Khám → [Lưu]
```

**Điền Form Đăng Ký**
| Trường | Bắt buộc | Mô tả |
|--------|----------|-------|
| Bệnh nhân | ✅ | Chọn từ danh sách |
| Bác sĩ | ✅ | Phân phòng khám |
| Lý do khám | ✅ | VD: "Sốt cao", "Đau bụng" |
| Ghi chú | ❌ | Thông tin bổ sung |

**Theo Dõi Trạng Thái**
- 📋 **Chờ khám:** Chưa đến gặp bác sĩ
- ✅ **Đang khám:** Đang được bác sĩ khám
- 🏥 **Hoàn thành:** Khám xong, chờ thanh toán

---

### 🏥 VAI TRÒ: BÁC SĨ (Khám Bệnh)

#### Chức Năng Chính
Bác sĩ chịu trách nhiệm khám bệnh, chẩn đoán và kê đơn thuốc.

#### 1. Khám Bệnh (KhamBenhPage)

**📌 Mục đích:** Ghi nhận triệu chứng và đưa ra chẩn đoán

**Bước 1: Chọn Bệnh Nhân**
```
Sidebar → Khám Bệnh → Chọn từ danh sách "Chờ Khám"
```

**Bước 2: Nhập Thông Tin Khám**
| Trường | Yêu cầu | Ghi chú |
|--------|---------|---------|
| Triệu chứng | ✅ | Chi tiết triệu chứng: Sốt cao, ho, đau đầu... |
| Nhịp tim | ✅ | Số lần/phút. VD: 72 |
| Huyết áp | ✅ | Định dạng: 120/80 |
| Chẩn đoán | ✅ | Tên bệnh hoặc sơ bộ chẩn đoán |

**Bước 3: Chỉ Định (Tùy Chọn)**
- ✅ **Xét nghiệm:** Chọn nếu cần làm xét nghiệm
- ✅ **Dịch vụ khác:** Siêu âm, X-Quang...
- ✅ **Kê đơn thuốc:** Chuyển sang bước sau

**Bước 4: Lưu Phiếu Khám**
```
[Lưu Phiếu Khám] → Xác nhận → Hoàn tất
```

#### 2. Xét Nghiệm & Cận Lâm Sàng (XetNghiemPage)

**📌 Mục đích:** Xem và phê duyệt kết quả xét nghiệm

**Xem Kết Quả**
```
Sidebar → Xét Nghiệm → Chọn phiếu xét nghiệm
```

**Kiểm Tra Thông Tin**
- 🔬 **Loại xét nghiệm:** Xét nghiệm máu, nước tiểu...
- 📊 **Kết quả:** Giá trị số
- ✅ **Trạng thái:** Bình thường / Bất thường
- 📄 **File kết quả:** Hình ảnh hoặc PDF nếu có

**Phê Duyệt Kết Quả**
```
[Phê Duyệt] → Lưu → Kết quả được lưu vào hồ sơ bệnh nhân
```

#### 3. Kê Đơn Thuốc (DonThuocPage)

**📌 Mục đích:** Lập đơn thuốc dựa trên chẩn đoán

**Quy Trình Kê Đơn**
```
[+ Thêm Thuốc] → Chọn Thuốc → Nhập Số Lượng → Ghi Chú Liều Dùng → [Lưu]
```

**Điền Chi Tiết Thuốc**
| Trường | Bắt buộc | Ví dụ |
|--------|----------|-------|
| Tên thuốc | ✅ | Paracetamol, Amoxicillin |
| Số lượng | ✅ | 10 (viên/hộp) |
| Liều dùng | ✅ | Sáng 1 viên, trưa 1 viên, chiều 1 viên |
| Ghi chú | ❌ | Uống sau khi ăn |

**Ví Dụ Kê Đơn**
```
Bệnh: Cảm cúm
───────────────────────────────
1. Paracetamol 500mg
   - Số lượng: 10 viên
   - Liều dùng: Sáng 1, chiều 1, tối 1
   - Ghi chú: Uống sau khi ăn

2. Amoxicillin 500mg
   - Số lượng: 20 viên
   - Liều dùng: Sáng 1, trưa 1, tối 1
   - Ghi chú: Uống với nước ấm

Tổng tiền: 150.000 VNĐ
───────────────────────────────
```

---

### 💊 VAI TRÒ: DƯỢC SĨ (Quản Lý Thuốc)

#### Chức Năng Chính
Dược sĩ quản lý kho thuốc, phân loại và cập nhật tình trạng kho.

#### 1. Quản Lý Loại Thuốc (LoaiThuocPage)

**📌 Mục đích:** Tạo và quản lý các danh mục thuốc

**Xem Danh Sách Loại Thuốc**
```
Sidebar → Loại Thuốc
```

**Thêm Loại Thuốc Mới**
```
[+ Thêm Loại] → Nhập Tên Loại → [Lưu]
```

**Danh Sách Loại Thuốc Tiêu Chuẩn**
- 🔴 Kháng sinh (Antibiotics)
- 🟠 Giảm đau (Painkillers)
- 🟡 Hạ sốt (Antifebrile)
- 🟢 Tiêu hóa (Digestive)
- 🔵 Hô hấp (Respiratory)
- 🟣 Khác (Others)

#### 2. Quản Lý Thuốc (ThuocPage)

**📌 Mục đích:** Quản lý kho thuốc, giá cả, hạn sử dụng

**Xem Danh Sách Thuốc**
```
Sidebar → Thuốc
```

**Thêm Thuốc Mới**
```
[+ Thêm Thuốc] → Điền Form → [Lưu]
```

**Form Thêm Thuốc**
| Trường | Bắt buộc | Ghi chú |
|--------|----------|---------|
| Tên thuốc | ✅ | VD: Paracetamol |
| Loại thuốc | ✅ | Chọn từ danh sách |
| Đơn vị tính | ✅ | Viên / Hộp / Vỉ |
| Đơn giá | ✅ | Giá tiền VNĐ |
| Số lượng | ✅ | Số lượng trong kho |
| Ngày sản xuất | ✅ | DD/MM/YYYY |
| Hạn sử dụng | ✅ | DD/MM/YYYY |

**Cập Nhật Tình Trạng Kho**
```
Chọn thuốc → [✏️ Sửa] → Cập nhật số lượng → [Lưu]
```

**Kiểm Tra Hạn Sử Dụng**
- ✅ **Con hạn:** Còn thời hạn sử dụng
- ⚠️ **Sắp hết hạn:** < 3 tháng
- ❌ **Hết hạn:** Không được sử dụng

> ℹ️ Hệ thống sẽ báo động nếu thuốc sắp hết hạn hoặc hết số lượng.

#### 3. Xuất Kho Thuốc

Khi bệnh nhân lấy thuốc:
```
[Xuất Kho] → Chọn Đơn Thuốc → Xác nhận → Số lượng tự động giảm
```

---

### 💰 VAI TRÒ: THU NGÂN (Thanh Toán)

#### Chức Năng Chính
Thu ngân xử lý thanh toán cho bệnh nhân.

#### 1. Xử Lý Thanh Toán (ThanhToanPage)

**📌 Mục đích:** Lập hóa đơn tổng hợp chi phí bệnh nhân

**Quy Trình Thanh Toán**
```
[+ Thanh Toán] → Chọn Bệnh Nhân → Xem Chi Tiết → Nhập Thanh Toán → [In Hóa Đơn]
```

**Bước 1: Chọn Bệnh Nhân**
```
Sidebar → Thanh Toán → [Chọn Bệnh Nhân]
```

**Bước 2: Xem Chi Tiết Hóa Đơn**
```
┌─────────────────────────────────────┐
│     HÓA ĐƠN THANH TOÁN              │
├─────────────────────────────────────┤
│ Bệnh nhân: Nguyễn Văn A             │
│ Ngày: 19/04/2026                    │
├─────────────────────────────────────┤
│ Chi Tiết:                           │
│ 1. Phí khám bệnh      200.000 VNĐ   │
│ 2. Xét nghiệm         150.000 VNĐ   │
│ 3. Thuốc              120.000 VNĐ   │
├─────────────────────────────────────┤
│ Tổng tiền:            470.000 VNĐ   │
│ Đã thanh toán:        470.000 VNĐ   │
│ Còn lại:                0 VNĐ       │
└─────────────────────────────────────┘
```

**Bước 3: Nhập Số Tiền Thanh Toán**
| Trường | Bắt buộc | Ghi chú |
|--------|----------|---------|
| Số tiền thanh toán | ✅ | Có thể = hoặc < tổng tiền |
| Hình thức thanh toán | ✅ | Tiền mặt / Chuyển khoản |
| Ghi chú | ❌ | VD: "Thanh toán tạm 50%" |

**Bước 4: Hoàn Tất & In Hóa Đơn**
```
[Thanh Toán] → [In Hóa Đơn] → In ra hoặc lưu PDF
```

**Hóa Đơn In Ra**
```
┌──────────────────────────────────────┐
│        PHÒNG KHÁM TƯ NHÂN PJ-TTCK    │
│  Địa chỉ: ... | ĐT: ... | MST: ...  │
├──────────────────────────────────────┤
│ HÓA ĐƠN SỐ: PT202604050001          │
│ Ngày: 19/04/2026 14:30               │
│ Bệnh nhân: Nguyễn Văn A              │
│ SĐT: 0912345678                      │
├──────────────────────────────────────┤
│ STT │ Nội Dung      │ Số Lượng │ Tiền │
├─────┼───────────────┼──────────┼──────┤
│ 1   │ Khám bệnh     │ 1        │ 200k │
│ 2   │ Xét nghiệm    │ 1        │ 150k │
│ 3   │ Thuốc         │ -        │ 120k │
├──────────────────────────────────────┤
│ TỔNG CỘNG:                  470.000  │
│ HÌNH THỨC: Tiền mặt                  │
│ Người thanh toán: Thu Ngân E         │
│ ─────────────────────────────────────│
│ Cảm ơn quý khách! Vui lòng giữ gìn  │
│ hóa đơn này để đối chiếu sau này.    │
└──────────────────────────────────────┘
```

**Tra Cứu Hóa Đơn Cũ**
```
[🔍 Tìm Kiếm] → Nhập Số Hóa Đơn / Tên Bệnh Nhân → Xem Chi Tiết
```

---

### 👨‍💼 VAI TRÒ: QUẢN TRỊ VIÊN (Admin)

#### Chức Năng Chính
Quản trị viên quản lý toàn bộ hệ thống, nhân viên và cấu hình.

#### 1. Quản Lý Nhân Viên (NhanVienPage)

**📌 Mục đích:** Quản lý danh sách bác sĩ, y tá, lễ tân...

**Xem Danh Sách Nhân Viên**
```
Sidebar → Nhân Viên
```

**Thêm Nhân Viên Mới**
```
[+ Thêm Nhân Viên] → Điền Form → [Lưu]
```

**Form Thêm Nhân Viên**
| Trường | Bắt buộc | Ghi chú |
|--------|----------|---------|
| Họ tên | ✅ | |
| Chức vụ | ✅ | Bác sĩ / Lễ tân / Dược sĩ... |
| Số điện thoại | ✅ | |
| Địa chỉ | ✅ | |
| Trạng thái | ✅ | Hoạt động / Tạm ngừng |

**Chức Vụ Tiêu Chuẩn**
- 👨‍⚕️ **Bác sĩ:** Khám bệnh, kê đơn
- 👩‍⚕️ **Y tá:** Hỗ trợ bác sĩ, chăm sóc bệnh nhân
- 👨‍💼 **Lễ tân:** Tiếp nhận bệnh nhân
- 💊 **Dược sĩ:** Quản lý thuốc
- 👨‍💰 **Kế toán / Thu ngân:** Thanh toán
- 🧪 **Kỹ thuật viên:** Xét nghiệm, cận lâm sàng

**Cập Nhật Thông Tin Nhân Viên**
```
Chọn nhân viên → [✏️ Sửa] → Cập nhật → [Lưu]
```

**Khóa / Mở Tài Khoản**
```
Chọn nhân viên → [Trạng thái: Tạm ngừng] → [Lưu]
→ Khi đó nhân viên không thể đăng nhập
```

#### 2. Quản Lý Dịch Vụ (DichVuPage)

**📌 Mục đích:** Quản lý các dịch vụ cận lâm sàng và giá cả

**Xem Danh Sách Dịch Vụ**
```
Sidebar → Dịch Vụ
```

**Thêm Dịch Vụ Mới**
```
[+ Thêm Dịch Vụ] → Nhập Thông Tin → [Lưu]
```

**Form Thêm Dịch Vụ**
| Trường | Bắt buộc | Ví dụ |
|--------|----------|-------|
| Tên dịch vụ | ✅ | Xét nghiệm máu, Siêu âm |
| Giá | ✅ | 200000 VNĐ |
| Trạng thái | ✅ | Hoạt động / Tạm ngừng |

**Danh Sách Dịch Vụ Tiêu Chuẩn**
- 🩸 **Xét nghiệm máu:** 200.000 VNĐ
- 🫀 **Siêu âm:** 300.000 VNĐ
- 🫁 **X-Quang:** 250.000 VNĐ
- 🧬 **Xét nghiệm nước tiểu:** 150.000 VNĐ
- 📋 **ECG:** 200.000 VNĐ

#### 3. Báo Cáo & Thống Kê

**📊 Xem Báo Cáo**
```
Sidebar → Báo Cáo (nếu có)
```

Có thể xem:
- 📈 Số bệnh nhân khám/tháng
- 💰 Doanh thu
- 📋 Tình trạng kho thuốc
- 👥 Hiệu suất nhân viên

---

## 🔧 Các Chức Năng Chính

### Bảng So Sánh Quyền Hạn Theo Vai Trò

| Chức Năng | Lễ Tân | Bác Sĩ | Dược Sĩ | Thu Ngân | Admin |
|-----------|:------:|:------:|:-------:|:--------:|:-----:|
| Quản lý bệnh nhân | ✅ | 🔍 | ❌ | 🔍 | ✅ |
| Đăng ký khám | ✅ | 🔍 | ❌ | ❌ | ✅ |
| Khám bệnh | ❌ | ✅ | ❌ | ❌ | ✅ |
| Xét nghiệm | 🔍 | ✅ | ❌ | 🔍 | ✅ |
| Kê đơn thuốc | ❌ | ✅ | 🔍 | ❌ | ✅ |
| Quản lý thuốc | ❌ | ❌ | ✅ | ❌ | ✅ |
| Thanh toán | 🔍 | ❌ | ❌ | ✅ | ✅ |
| Quản lý nhân viên | ❌ | ❌ | ❌ | ❌ | ✅ |

*Chú thích:* ✅ = Đầy đủ quyền | 🔍 = Chỉ xem | ❌ = Không có quyền

---

## ⚠️ Lỗi Thường Gặp & Giải Pháp

### 1. Không Thể Đăng Nhập

**❌ Vấn đề:** "Sai tên đăng nhập hoặc mật khẩu"

**✅ Giải pháp:**
- Kiểm tra chính tả tên đăng nhập (có phân biệt chữ hoa/thường)
- Kiểm tra Caps Lock có bật không
- Nhấn [Quên Mật Khẩu] để đặt lại
- Liên hệ quản trị viên để kiểm tra tài khoản

---

### 2. Trang Trắng Không Có Nội Dung

**❌ Vấn đề:** "Trang không hiển thị dữ liệu"

**✅ Giải pháp:**
- Nhấn **F5** để tải lại trang (Refresh)
- Xóa cache trình duyệt: Ctrl+Shift+Delete
- Kiểm tra kết nối Internet
- Đóng trình duyệt và mở lại

---

### 3. Không Thể Lưu Dữ Liệu

**❌ Vấn đề:** "Nhấn Lưu nhưng không có phản hồi"

**✅ Giải pháp:**
- Kiểm tra tất cả trường bắt buộc (*) đã điền đủ chưa
- Chọn mục từ dropdown (không được để trống)
- Kiểm tra định dạng dữ liệu:
  - Ngày tháng: DD/MM/YYYY
  - Số điện thoại: 10 số
  - Email: format@domain.com
- Đợi 2-3 giây, thường sẽ có thông báo kết quả

---

### 4. Lỗi Kết Nối Database

**❌ Vấn đề:** "Lỗi kết nối cơ sở dữ liệu"

**✅ Giải pháp:**
- Đảm bảo server MySQL đang chạy
- Kiểm tra kết nối Internet
- Đăng xuất rồi đăng nhập lại
- Liên hệ IT để khởi động lại server

---

### 5. Nút Không Hoạt Động

**❌ Vấn đề:** "Nút [Lưu] hoặc [Xóa] không có tác dụng"

**✅ Giải pháp:**
- Làm mới trang (F5)
- Kiểm tra quyền hạn của tài khoản (bạn có phép không?)
- Thử dùng trình duyệt khác (Chrome, Firefox...)
- Xóa cache: Ctrl+Shift+Delete

---

### 6. Dữ Liệu Cũ Không Cập Nhật

**❌ Vấn đề:** "Vừa lưu nhưng khi xem lại vẫn là dữ liệu cũ"

**✅ Giải pháp:**
- Làm mới trang bằng **F5** hoặc **Ctrl+F5**
- Xóa cache trình duyệt
- Đăng xuất và đăng nhập lại
- Chọn lại dữ liệu từ danh sách

---

### 7. Không Thể Xóa Dữ Liệu

**❌ Vấn đề:** "Khi xóa xuất hiện lỗi"

**✅ Giải pháp:**
- Dữ liệu có thể đang được sử dụng ở chỗ khác
  - Xóa phiếu khám trước khi xóa bệnh nhân
  - Xóa đơn thuốc trước khi xóa thuốc
- Kiểm tra quyền hạn
- Liên hệ quản trị viên nếu cần xóa dữ liệu quan trọng

---

## 📞 Hỗ Trợ & Liên Hệ

| Vấn Đề | Liên Hệ |
|--------|---------|
| Lỗi kỹ thuật, mất kết nối | **Bộ phận IT** |
| Quên mật khẩu | **Quản trị viên** |
| Về chức năng hệ thống | **Quản trị viên hoặc BQL** |
| Báo cáo lỗi | **IT Support** |

**Cách báo cáo lỗi hiệu quả:**
1. Mô tả chi tiết vấn đề xảy ra
2. Cho biết vai trò của bạn
3. Cung cấp ảnh chụp (screenshot) lỗi
4. Nêu thời điểm xảy ra lỗi

---

## 📋 Danh Sách Kiểm Tra Hàng Ngày

### 👤 Lễ Tân
- [ ] Kiểm tra bệnh nhân mới cần đăng ký
- [ ] Đảm bảo tất cả thông tin bệnh nhân đúng
- [ ] Đăng ký khám cho các bệnh nhân chờ

### 👨‍⚕️ Bác Sĩ
- [ ] Kiểm tra danh sách bệnh nhân chờ khám
- [ ] Khám bệnh và kê đơn thuốc đầy đủ
- [ ] Phê duyệt kết quả xét nghiệm

### 💊 Dược Sĩ
- [ ] Kiểm tra tình trạng kho thuốc
- [ ] Cảnh báo thuốc sắp hết hạn
- [ ] Cập nhật số lượng sau mỗi lần xuất kho

### 💰 Thu Ngân
- [ ] Xử lý thanh toán cho bệnh nhân
- [ ] In hóa đơn và gửi cho bệnh nhân
- [ ] Kiểm tra tổng doanh thu

### 👨‍💼 Admin
- [ ] Kiểm tra báo cáo hoạt động hằng ngày
- [ ] Cập nhật danh sách dịch vụ nếu cần
- [ ] Backup dữ liệu định kỳ

---

## 🎓 Mẹo & Thủ Thuật

### ⌨️ Phím Tắt
| Phím | Chức Năng |
|------|-----------|
| **F5** | Tải lại trang |
| **Ctrl+F5** | Tải lại toàn bộ (xóa cache) |
| **Ctrl+P** | In trang / hóa đơn |
| **Ctrl+F** | Tìm kiếm trên trang |
| **Escape** | Đóng form hoặc modal |

### 💾 Sao Lưu Dữ Liệu
- Hệ thống tự động lưu định kỳ
- Dữ liệu được lưu trên server MySQL
- Liên hệ IT để yêu cầu backup toàn bộ

### 🔒 Bảo Mật
- ✅ Đăng xuất sau khi sử dụng
- ✅ Không chia sẻ mật khẩu
- ✅ Cập nhật mật khẩu định kỳ (6 tháng/lần)
- ✅ Không lưu mật khẩu trên máy tính dùng chung

---

**Cảm ơn bạn đã sử dụng hệ thống Quản Lý Phòng Khám PJ-TTCK!** 🎉
