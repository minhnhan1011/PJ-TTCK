import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./DangKyKhamPage.css";

export default function DangKyKhamPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ hoten: "", lydokham: "", mabn: "" });
  const [formErrors, setFormErrors] = useState({});

  const openAdd = () => {
    setForm({ hoten: "", lydokham: "", mabn: "" });
    setFormErrors({});
    setShowModal(true);
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Quản lý Đăng ký khám</h1>
              <p>Lập phiếu đăng ký khám, hủy/đổi lịch khám bệnh nhân.</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-plus"></i> Lập phiếu khám mới
            </button>
          </div>

          <div className="stat-cards">
            <div className="stat-card blue">
              <div className="stat-label">Tổng đăng ký</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Chờ khám</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Đang khám</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Hoàn thành</div>
              <div className="stat-number">0</div>
            </div>
          </div>

          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm theo tên BN, mã BN, mã ĐK..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã ĐK</th>
                    <th>STT</th>
                    <th>Bệnh nhân</th>
                    <th>Lý do khám</th>
                    <th>Ngày đăng ký</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan="7" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>0</strong> đăng ký</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-clipboard-list" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>Lập phiếu đăng ký khám</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-form-body">
              <div className="form-group">
                <label>Mã Bệnh nhân (nếu có)</label>
                <input type="text" placeholder="VD: BN-001 (bỏ trống nếu BN mới)" value={form.mabn} onChange={(e) => setForm({ ...form, mabn: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Họ và Tên <span className="required">*</span></label>
                <input type="text" placeholder="Nhập họ tên bệnh nhân..." value={form.hoten} onChange={(e) => setForm({ ...form, hoten: e.target.value })} className={formErrors.hoten ? "input-error" : ""} />
                {formErrors.hoten && <div className="error-text">{formErrors.hoten}</div>}
              </div>
              <div className="form-group">
                <label>Lý do khám <span className="required">*</span></label>
                <select value={form.lydokham} onChange={(e) => setForm({ ...form, lydokham: e.target.value })} className={formErrors.lydokham ? "input-error" : ""}>
                  <option value="">-- Chọn lý do --</option>
                  <option>Khám tổng quát</option>
                  <option>Sốt / Cảm cúm</option>
                  <option>Đau bụng</option>
                  <option>Đau đầu</option>
                  <option>Tai mũi họng</option>
                  <option>Da liễu</option>
                  <option>Khác</option>
                </select>
                {formErrors.lydokham && <div className="error-text">{formErrors.lydokham}</div>}
              </div>
            </div>
            <div className="modal-form-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-save" onClick={() => setShowModal(false)}><i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu & Cấp STT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
