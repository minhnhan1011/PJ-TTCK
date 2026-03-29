import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./ThuocPage.css";

const LOAI_THUOC = [
  { malt: 1, tenlt: "Kháng sinh" },
  { malt: 2, tenlt: "Giảm đau" },
  { malt: 3, tenlt: "Hạ sốt" },
  { malt: 4, tenlt: "Vitamin" },
];

const INITIAL_DATA = [
  { mat: 1, tent: "Paracetamol", malt: 2, tenlt: "Giảm đau", dongia: 5000 },
  { mat: 2, tent: "Amoxicillin", malt: 1, tenlt: "Kháng sinh", dongia: 10000 },
  { mat: 3, tent: "Ibuprofen", malt: 2, tenlt: "Giảm đau", dongia: 8000 },
  { mat: 4, tent: "Vitamin C 500mg", malt: 4, tenlt: "Vitamin", dongia: 3000 },
  { mat: 5, tent: "Cefalexin", malt: 1, tenlt: "Kháng sinh", dongia: 12000 },
];

export default function ThuocPage() {
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [filterLoai, setFilterLoai] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ tent: "", malt: "1", dongia: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);

  const filtered = data.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = d.tent.toLowerCase().includes(q);
    const matchLoai = !filterLoai || String(d.malt) === filterLoai;
    return matchSearch && matchLoai;
  });

  const formatCurrency = (n) => n.toLocaleString("vi-VN");

  const openAdd = () => {
    setEditItem(null);
    setForm({ tent: "", malt: "1", dongia: "" });
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ tent: item.tent, malt: String(item.malt), dongia: String(item.dongia) });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.tent.trim()) errs.tent = "Tên thuốc bắt buộc";
    if (!form.dongia || Number(form.dongia) <= 0) errs.dongia = "Đơn giá phải > 0";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const loai = LOAI_THUOC.find((l) => String(l.malt) === form.malt);
    if (editItem) {
      setData(data.map((d) => d.mat === editItem.mat ? { ...d, tent: form.tent, malt: Number(form.malt), tenlt: loai?.tenlt || "", dongia: Number(form.dongia) } : d));
    } else {
      setData([...data, {
        mat: data.length + 1,
        tent: form.tent,
        malt: Number(form.malt),
        tenlt: loai?.tenlt || "",
        dongia: Number(form.dongia),
      }]);
    }
    setShowModal(false);
  };

  const handleDelete = (mat) => {
    setData(data.filter((d) => d.mat !== mat));
    setShowConfirm(null);
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
                {LOAI_THUOC.map((l) => <option key={l.malt} value={l.malt}>{l.tenlt}</option>)}
              </select>
              <div style={{ fontSize: "0.85rem", color: "#6b7280", marginLeft: "auto" }}>Tổng: <strong style={{ color: "#2563eb" }}>{data.length}</strong> thuốc</div>
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
                  {filtered.length === 0 ? (
                    <tr><td colSpan="5" className="empty-state"><p>Không tìm thấy thuốc nào</p></td></tr>
                  ) : filtered.map((d) => (
                    <tr key={d.mat}>
                      <td className="code-cell">T-{String(d.mat).padStart(3, "0")}</td>
                      <td style={{ fontWeight: 600 }}>{d.tent}</td>
                      <td><span className="badge-status badge-blue">{d.tenlt}</span></td>
                      <td style={{ textAlign: "right", fontWeight: 500 }}>{formatCurrency(d.dongia)}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" title="Sửa" onClick={() => openEdit(d)}><i className="fas fa-edit"></i></button>
                          <button className="btn-delete" title="Xóa" onClick={() => setShowConfirm(d.mat)}><i className="fas fa-trash-alt"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>{filtered.length}</strong> trong tổng số <strong>{data.length}</strong> thuốc</div>
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
                    {LOAI_THUOC.map((l) => <option key={l.malt} value={l.malt}>{l.tenlt}</option>)}
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
              <button className="btn-save" onClick={handleSave}><i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu</button>
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
              <button className="btn-danger" onClick={() => handleDelete(showConfirm)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
