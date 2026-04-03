import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./ThuocPage.css";

export default function ThuocPage() {
  const [search, setSearch] = useState("");
  const [filterLoai, setFilterLoai] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ tent: "", malt: "", dongia: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);

  const openAdd = () => {
    setEditItem(null);
    setForm({ tent: "", malt: "", dongia: "" });
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
              <h1>Danh mục Thuốc</h1>
              <p>Quản lý danh sách thuốc, loại thuốc và đơn giá trong hệ thống.</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-plus-circle"></i> Thêm Thuốc mới
            </button>
          </div>

          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm kiếm theo tên thuốc..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="filter-select" value={filterLoai} onChange={(e) => setFilterLoai(e.target.value)}>
                <option value="">Tất cả loại</option>
              </select>
              <div style={{ fontSize: "0.85rem", color: "#6b7280", marginLeft: "auto" }}>Tổng: <strong style={{ color: "#2563eb" }}>0</strong> thuốc</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "6rem" }}>Mã thuốc</th>
                    <th>Tên thuốc</th>
                    <th>Loại thuốc</th>
                    <th style={{ textAlign: "right", width: "12rem" }}>Đơn giá (VNĐ)</th>
                    <th style={{ textAlign: "right", width: "10rem" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan="5" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>0</strong> thuốc</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-capsules" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>{editItem ? "Cập nhật Thuốc" : "Thêm Thuốc mới"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-form-body">
              <div className="form-group">
                <label>Tên thuốc <span className="required">*</span></label>
                <input type="text" placeholder="Nhập tên thuốc..." value={form.tent} onChange={(e) => setForm({ ...form, tent: e.target.value })} className={formErrors.tent ? "input-error" : ""} />
                {formErrors.tent && <div className="error-text">{formErrors.tent}</div>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Loại thuốc</label>
                  <select value={form.malt} onChange={(e) => setForm({ ...form, malt: e.target.value })}>
                    <option value="">-- Chọn loại thuốc --</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Đơn giá (VNĐ) <span className="required">*</span></label>
                  <input type="number" placeholder="VD: 10000" value={form.dongia} onChange={(e) => setForm({ ...form, dongia: e.target.value })} className={formErrors.dongia ? "input-error" : ""} />
                  {formErrors.dongia && <div className="error-text">{formErrors.dongia}</div>}
                </div>
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
            <h3>Xóa Thuốc?</h3>
            <p>Chỉ xóa được thuốc chưa từng được kê đơn (bảng DonThuoc).</p>
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
