import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./BenhNhanPage.css";

const INITIAL_PATIENTS = [
  { mabn: "BN-001", hoten: "Nguyễn Văn An", gioitinh: "Nam", ngaysinh: "15/08/1980", sdt: "0901 234 567", diachi: "123 Nguyễn Văn Linh, Q7, TP.HCM" },
  { mabn: "BN-002", hoten: "Trần Thị Bích", gioitinh: "Nữ", ngaysinh: "22/03/1995", sdt: "0912 345 678", diachi: "456 Lê Văn Việt, Q9, TP.HCM" },
  { mabn: "BN-003", hoten: "Phạm Hồng Nhung", gioitinh: "Nữ", ngaysinh: "10/12/1988", sdt: "0988 765 432", diachi: "789 Phạm Văn Đồng, Thủ Đức, TP.HCM" },
  { mabn: "BN-004", hoten: "Lê Minh Tuấn", gioitinh: "Nam", ngaysinh: "05/06/1975", sdt: "0909 111 222", diachi: "321 Võ Văn Ngân, Thủ Đức, TP.HCM" },
  { mabn: "BN-005", hoten: "Hoàng Thị Mai", gioitinh: "Nữ", ngaysinh: "18/09/1992", sdt: "0977 888 999", diachi: "567 Nguyễn Thị Minh Khai, Q3, TP.HCM" },
];

export default function BenhNhanPage() {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ hoten: "", ngaysinh: "", gioitinh: "Nam", sdt: "", diachi: "" });
  const [formErrors, setFormErrors] = useState({});

  // Filter
  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return p.hoten.toLowerCase().includes(q) || p.sdt.replace(/\s/g, "").includes(q.replace(/\s/g, ""));
  });

  // Form handlers
  const openModal = () => {
    setForm({ hoten: "", ngaysinh: "", gioitinh: "Nam", sdt: "", diachi: "" });
    setFormErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!form.hoten.trim()) errs.hoten = "Họ tên bắt buộc";
    if (!form.sdt.trim()) {
      errs.sdt = "Số điện thoại bắt buộc";
    } else if (!/^0\d{9}$/.test(form.sdt.replace(/\s/g, ""))) {
      errs.sdt = "SĐT không hợp lệ (10 số, bắt đầu bằng 0)";
    }
    return errs;
  };

  const handleSave = () => {
    const errs = validateForm();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newPatient = {
      mabn: "BN-" + String(patients.length + 1).padStart(3, "0"),
      hoten: form.hoten,
      ngaysinh: form.ngaysinh ? new Date(form.ngaysinh).toLocaleDateString("vi-VN") : "",
      gioitinh: form.gioitinh,
      sdt: form.sdt,
      diachi: form.diachi,
    };
    setPatients([...patients, newPatient]);
    setShowModal(false);
  };

  return (
    <div className="benhnhan-layout">
      <Sidebar />
      <div className="benhnhan-main">
        <Header />
        <div className="benhnhan-content">
          {/* Top bar */}
          <div className="benhnhan-topbar">
            <div>
              <h1>Danh sách Bệnh nhân</h1>
              <p>Quản lý hồ sơ bệnh nhân và lịch sử khám chữa bệnh.</p>
            </div>
            <button className="btn-add-patient" onClick={openModal}>
              <i className="fas fa-user-plus"></i> Thêm Bệnh nhân mới
            </button>
          </div>

          {/* Stats */}
          <div className="stat-cards">
            <div className="stat-card blue">
              <div className="stat-label">Tổng BN</div>
              <div className="stat-number">{patients.length}</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">BN đang điều trị</div>
              <div className="stat-number">876</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Đăng ký mới hôm nay</div>
              <div className="stat-number">12</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Tái khám tuần này</div>
              <div className="stat-number">45</div>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Tìm theo tên, SĐT..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="patient-table">
                <thead>
                  <tr>
                    <th>Mã BN</th>
                    <th>Họ và Tên</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                        Không tìm thấy bệnh nhân nào
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => (
                      <tr key={p.mabn}>
                        <td className="mabn">{p.mabn}</td>
                        <td>
                          <div className="name-cell">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.hoten)}&background=e0f2fe&color=0284c7&size=32`}
                              alt={p.hoten}
                            />
                            <span className="name">{p.hoten}</span>
                          </div>
                        </td>
                        <td>{p.gioitinh}</td>
                        <td style={{ color: "#6b7280" }}>{p.ngaysinh}</td>
                        <td>{p.sdt}</td>
                        <td className="address-cell">{p.diachi}</td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-view" title="Xem hồ sơ"><i className="fas fa-eye"></i></button>
                            <button className="btn-edit" title="Chỉnh sửa"><i className="fas fa-edit"></i></button>
                            <button className="btn-history" title="Lịch sử khám"><i className="fas fa-history"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-pagination">
              <div>
                Hiển thị <strong>1-{filtered.length}</strong> trong tổng số <strong>{patients.length}</strong> bệnh nhân
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm bệnh nhân */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-user-plus" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>Thêm Bệnh nhân mới</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-form-body">
              <div className="form-group">
                <label>Họ và Tên <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Nhập họ tên..."
                  value={form.hoten}
                  onChange={(e) => setForm({ ...form, hoten: e.target.value })}
                  className={formErrors.hoten ? "input-error" : ""}
                />
                {formErrors.hoten && <div className="error-text">{formErrors.hoten}</div>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    value={form.ngaysinh}
                    onChange={(e) => setForm({ ...form, ngaysinh: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Giới tính</label>
                  <select
                    value={form.gioitinh}
                    onChange={(e) => setForm({ ...form, gioitinh: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Số điện thoại <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="VD: 0901234567"
                  value={form.sdt}
                  onChange={(e) => setForm({ ...form, sdt: e.target.value })}
                  className={formErrors.sdt ? "input-error" : ""}
                />
                {formErrors.sdt && <div className="error-text">{formErrors.sdt}</div>}
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  placeholder="Nhập địa chỉ..."
                  value={form.diachi}
                  onChange={(e) => setForm({ ...form, diachi: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-form-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-save" onClick={handleSave}>
                <i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
