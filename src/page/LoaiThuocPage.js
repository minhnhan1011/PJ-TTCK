import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./LoaiThuocPage.css";

const INITIAL_DATA = [
  { malt: 1, tenlt: "Kháng sinh" },
  { malt: 2, tenlt: "Giảm đau" },
  { malt: 3, tenlt: "Hạ sốt" },
  { malt: 4, tenlt: "Vitamin" },
  { malt: 5, tenlt: "Kháng viêm" },
];

export default function LoaiThuocPage() {
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ tenlt: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);

  const filtered = data.filter((d) => d.tenlt.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditItem(null);
    setForm({ tenlt: "" });
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ tenlt: item.tenlt });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.tenlt.trim()) {
      setFormErrors({ tenlt: "Tên loại thuốc bắt buộc" });
      return;
    }

    if (editItem) {
      setData(data.map((d) => d.malt === editItem.malt ? { ...d, tenlt: form.tenlt } : d));
    } else {
      setData([...data, { malt: data.length + 1, tenlt: form.tenlt }]);
    }
    setShowModal(false);
  };

  const handleDelete = (malt) => {
    setData(data.filter((d) => d.malt !== malt));
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
              <h1>Danh mục Loại thuốc</h1>
              <p>Quản lý phân loại thuốc trong hệ thống phòng khám.</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-plus-circle"></i> Thêm Loại thuốc
            </button>
          </div>

          <div className="table-container">
            <div className="table-toolbar" style={{ justifyContent: "space-between" }}>
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm kiếm theo tên loại thuốc..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Tổng: <strong style={{ color: "#2563eb" }}>{data.length}</strong> loại</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "8rem" }}>Mã loại</th>
                    <th>Tên loại thuốc</th>
                    <th style={{ textAlign: "right", width: "10rem" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="3" className="empty-state"><p>Không tìm thấy loại thuốc nào</p></td></tr>
                  ) : filtered.map((d) => (
                    <tr key={d.malt}>
                      <td className="code-cell">LT-{String(d.malt).padStart(3, "0")}</td>
                      <td style={{ fontWeight: 600 }}>{d.tenlt}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" title="Sửa" onClick={() => openEdit(d)}><i className="fas fa-edit"></i></button>
                          <button className="btn-delete" title="Xóa" onClick={() => setShowConfirm(d.malt)}><i className="fas fa-trash-alt"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>{filtered.length}</strong> trong tổng số <strong>{data.length}</strong> loại thuốc</div>
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
              <button className="btn-danger" onClick={() => handleDelete(showConfirm)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
