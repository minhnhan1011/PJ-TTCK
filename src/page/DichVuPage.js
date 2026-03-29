import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./DichVuPage.css";

export default function DichVuPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ tendv: "", gia: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);

  const openAdd = () => {
    setEditItem(null);
    setForm({ tendv: "", gia: "" });
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
              <h1>Danh mục Dịch vụ Khám & Xét nghiệm</h1>
              <p>Cấu hình tên dịch vụ và đơn giá làm cơ sở tính viện phí.</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-plus-circle"></i> Thêm Dịch vụ mới
            </button>
          </div>

          <div className="table-container">
            <div className="table-toolbar" style={{ justifyContent: "space-between" }}>
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm kiếm tên dịch vụ..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Tổng số: <strong style={{ color: "#2563eb" }}>0</strong> dịch vụ</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "6rem" }}>Mã DV</th>
                    <th>Tên Dịch vụ</th>
                    <th style={{ textAlign: "right", width: "12rem" }}>Giá Dịch vụ (VNĐ)</th>
                    <th style={{ textAlign: "center", width: "8rem" }}>Trạng thái</th>
                    <th style={{ textAlign: "right", width: "8rem" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan="5" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>0</strong> dịch vụ</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-microscope" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>{editItem ? "Cập nhật Dịch vụ" : "Thêm Dịch vụ mới"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-form-body">
              <div className="form-group">
                <label>Tên Dịch vụ <span className="required">*</span></label>
                <input type="text" placeholder="Nhập tên dịch vụ..." value={form.tendv} onChange={(e) => setForm({ ...form, tendv: e.target.value })} className={formErrors.tendv ? "input-error" : ""} />
                {formErrors.tendv && <div className="error-text">{formErrors.tendv}</div>}
              </div>
              <div className="form-group">
                <label>Giá Dịch vụ (VNĐ) <span className="required">*</span></label>
                <input type="number" placeholder="VD: 200000" value={form.gia} onChange={(e) => setForm({ ...form, gia: e.target.value })} className={formErrors.gia ? "input-error" : ""} />
                {formErrors.gia && <div className="error-text">{formErrors.gia}</div>}
              </div>
            </div>
            <div className="modal-form-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-save" onClick={() => setShowModal(false)}><i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon"><i className="fas fa-exclamation-triangle"></i></div>
            <h3>Xóa Dịch vụ?</h3>
            <p>Hành động này không thể hoàn tác. Dịch vụ đã liên kết phiếu xét nghiệm sẽ không thể xóa.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(null)}>Hủy</button>
              <button className="btn-danger" onClick={() => setShowConfirm(null)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
