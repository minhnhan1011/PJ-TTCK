import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { message } from "antd";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./LoaiThuocPage.css";

export default function LoaiThuocPage() {
  const userRole = localStorage.getItem("userRole") || "";
  const canEdit = userRole === "admin";

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ tenlt: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);

  const loadData = () => {
    axios.get("http://localhost:4000/api/loai-thuoc", { withCredentials: true })
      .then(res => setData(Array.isArray(res.data) ? res.data : []))
      .catch(() => message.error("Lỗi tải danh sách loại thuốc!"));
  };
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter(i => i.tenlt.toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const openAdd = () => { setEditItem(null); setForm({ tenlt: "" }); setFormErrors({}); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ tenlt: item.tenlt }); setFormErrors({}); setShowModal(true); };

  const validate = () => {
    const errs = {};
    if (!form.tenlt.trim()) errs.tenlt = "Tên loại thuốc không được để trống";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const req = editItem
      ? axios.put(`http://localhost:4000/api/loai-thuoc/${editItem.malt}`, form, { withCredentials: true })
      : axios.post("http://localhost:4000/api/loai-thuoc", form, { withCredentials: true });
    req.then(() => { message.success(editItem ? "Cập nhật thành công!" : "Thêm thành công!"); setShowModal(false); loadData(); })
       .catch(err => message.error(err.response?.data?.message || "Có lỗi xảy ra!"));
  };

  const handleDelete = () => {
    if (!showConfirm) return;
    axios.delete(`http://localhost:4000/api/loai-thuoc/${showConfirm.malt}`, { withCredentials: true })
      .then(() => { message.success("Xóa thành công!"); setShowConfirm(null); loadData(); })
      .catch(err => message.error(err.response?.data?.message || "Không thể xóa!"));
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Danh mục Loại thuốc</h1>
              <p>Quản lý phân loại thuốc trong hệ thống phòng khám.</p>
            </div>
            {canEdit && <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-plus-circle"></i> Thêm Loại thuốc
            </button>}
          </div>

          <div className="table-container">
            <div className="table-toolbar" style={{ justifyContent: "space-between" }}>
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm kiếm theo tên loại thuốc..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Tổng: <strong style={{ color: "#2563eb" }}>{filtered.length}</strong> loại</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "8rem" }}>Mã loại</th>
                    <th>Tên loại thuốc</th>
                    <th style={{ textAlign: "center", width: "10rem" }}>Số lượng thuốc</th>
                    {canEdit && <th style={{ textAlign: "right", width: "10rem" }}>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="4" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                  ) : filtered.map(item => (
                    <tr key={item.malt}>
                      <td className="code-cell">LT-{String(item.malt).padStart(3,"0")}</td>
                      <td>{item.tenlt}</td>
                      <td style={{ textAlign: "center", fontWeight: 600, color: "#2563eb" }}>{item.so_thuoc ?? 0}</td>
                      {canEdit && <td>
                        <div className="action-btns">
                          <button className="btn-edit" title="Sửa" onClick={() => openEdit(item)}><i className="fas fa-pen"></i></button>
                          <button className="btn-delete" title="Xóa" onClick={() => setShowConfirm(item)}><i className="fas fa-trash"></i></button>
                        </div>
                      </td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>{filtered.length}</strong> loại thuốc</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-pills" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>{editItem ? "Cập nhật Loại thuốc" : "Thêm Loại thuốc mới"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-form-body">
              <div className="form-group">
                <label>Tên Loại thuốc <span className="required">*</span></label>
                <input type="text" placeholder="VD: Kháng sinh, Giảm đau..." value={form.tenlt} onChange={(e) => setForm({ tenlt: e.target.value })} className={formErrors.tenlt ? "input-error" : ""} />
                {formErrors.tenlt && <div className="error-text">{formErrors.tenlt}</div>}
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
            <h3>Xóa Loại thuốc?</h3>
            <p>Chỉ xóa được khi chưa có thuốc nào thuộc loại này.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(null)}>Hủy</button>
              <button className="btn-danger" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
