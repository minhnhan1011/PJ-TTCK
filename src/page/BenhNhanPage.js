import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./BenhNhanPage.css";

export default function BenhNhanPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ hoten: "", ngaysinh: "", gioitinh: "Nam", sdt: "", diachi: "" });
  const [formErrors, setFormErrors] = useState({});

  return (
    <div className="benhnhan-layout">
      <Sidebar />1
      <div className="benhnhan-main">
        <Header />
        <div className="benhnhan-content">
          {/* Top bar */}
          <div className="benhnhan-topbar">
            <div>
              <h1>Danh sách Bệnh nhân</h1>
              <p>Quản lý hồ sơ bệnh nhân và lịch sử khám chữa bệnh.</p>
            </div>
            <button className="btn-add-patient" onClick={() => { setForm({ hoten: "", ngaysinh: "", gioitinh: "Nam", sdt: "", diachi: "" }); setFormErrors({}); setShowModal(true); }}>
              <i className="fas fa-user-plus"></i> Thêm Bệnh nhân mới
            </button>
          </div>

          {/* Stats */}
          <div className="stat-cards">
            <div className="stat-card blue">
              <div className="stat-label">Tổng BN</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">BN đang điều trị</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Đăng ký mới hôm nay</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Tái khám tuần này</div>
              <div className="stat-number">0</div>
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
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                      Chưa có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="table-pagination">
              <div>
                Hiển thị <strong>0</strong> bệnh nhân
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
              <button className="btn-save" onClick={() => setShowModal(false)}>
                <i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
