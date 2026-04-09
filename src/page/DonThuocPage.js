import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { message } from "antd";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./DonThuocPage.css";

export default function DonThuocPage() {
  const [data, setData] = useState([]);
  const [thuocList, setThuocList] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ mapk: "", mat: "", soluong: "", lieudung: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);
  const [tongTienMapk, setTongTienMapk] = useState("");
  const [tongTien, setTongTien] = useState(null);

  const loadData = () => {
    axios.get("http://localhost:4000/api/don-thuoc", { withCredentials: true })
      .then(res => setData(Array.isArray(res.data) ? res.data : []))
      .catch(() => message.error("Lỗi tải danh sách đơn thuốc!"));
    axios.get("http://localhost:4000/api/thuoc", { withCredentials: true })
      .then(res => setThuocList(Array.isArray(res.data) ? res.data : []))
      .catch(() => message.error("Lỗi tải danh sách thuốc!"));
  };
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const s = search.toLowerCase();
    return data.filter(i => String(i.mapk).includes(s) || (i.tenbn||"").toLowerCase().includes(s) || (i.tent||"").toLowerCase().includes(s));
  }, [data, search]);

  const openAdd = () => { setEditItem(null); setForm({ mapk: "", mat: "", soluong: "", lieudung: "" }); setFormErrors({}); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ mapk: item.mapk, mat: item.mat, soluong: item.soluong, lieudung: item.lieudung || "" }); setFormErrors({}); setShowModal(true); };

  const validate = () => {
    const errs = {};
    if (!form.mapk) errs.mapk = "Mã phiếu khám là bắt buộc";
    if (!form.mat) errs.mat = "Vui lòng chọn thuốc";
    if (!form.soluong || Number(form.soluong) <= 0) errs.soluong = "Số lượng phải > 0";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload = { mapk: Number(form.mapk), mat: Number(form.mat), soluong: Number(form.soluong), lieudung: form.lieudung };
    const req = editItem
      ? axios.put(`http://localhost:4000/api/don-thuoc/${editItem.madt}`, payload, { withCredentials: true })
      : axios.post("http://localhost:4000/api/don-thuoc", payload, { withCredentials: true });
    req.then(() => { message.success(editItem ? "Cập nhật thành công!" : "Kê đơn thành công!"); setShowModal(false); loadData(); })
       .catch(err => message.error(err.response?.data?.message || "Có lỗi xảy ra!"));
  };

  const handleDelete = () => {
    if (!showConfirm) return;
    axios.delete(`http://localhost:4000/api/don-thuoc/${showConfirm.madt}`, { withCredentials: true })
      .then(() => { message.success("Xóa thành công!"); setShowConfirm(null); loadData(); })
      .catch(err => message.error(err.response?.data?.message || "Không thể xóa!"));
  };

  const handleTinhTien = () => {
    if (!tongTienMapk) { message.warning("Nhập mã PK để tính tiền!"); return; }
    axios.get(`http://localhost:4000/api/don-thuoc/tong-tien/${tongTienMapk}`, { withCredentials: true })
      .then(res => setTongTien(res.data.tongtien))
      .catch(() => message.error("Lỗi tính tiền!"));
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Quản lý Đơn thuốc</h1>
              <p>Kê đơn, cập nhật và quản lý đơn thuốc theo phiếu khám.</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-prescription-bottle-alt"></i> Kê đơn thuốc
            </button>
          </div>

          {/* Tính tiền thuốc theo mã PK */}
          <div className="tinh-tien-bar">
            <div className="tinh-tien-group">
              <input type="number" placeholder="Nhập mã PK..." value={tongTienMapk} onChange={e => setTongTienMapk(e.target.value)} />
              <button className="btn-green" onClick={handleTinhTien}><i className="fas fa-calculator"></i> Tính tiền thuốc</button>
            </div>
            {tongTien !== null && (
              <div className="tinh-tien-result">
                Tổng tiền thuốc PK <strong>#{tongTienMapk}</strong>: <span className="tong-tien-value">{Number(tongTien).toLocaleString()} đ</span>
              </div>
            )}
          </div>

          <div className="table-container">
            <div className="table-toolbar" style={{ justifyContent: "space-between" }}>
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm theo mã PK, tên BN, tên thuốc..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Tổng: <strong style={{ color: "#2563eb" }}>{filtered.length}</strong> đơn thuốc</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã ĐT</th>
                    <th>Mã PK</th>
                    <th>Bệnh nhân</th>
                    <th>Tên thuốc</th>
                    <th style={{ textAlign: "center" }}>Số lượng</th>
                    <th>Liều dùng</th>
                    <th style={{ textAlign: "right" }}>Đơn giá</th>
                    <th style={{ textAlign: "right" }}>Thành tiền</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="9" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                  ) : filtered.map(item => (
                    <tr key={item.madt}>
                      <td className="code-cell">ĐT-{String(item.madt).padStart(3,"0")}</td>
                      <td className="code-cell">PK-{String(item.mapk).padStart(3,"0")}</td>
                      <td>{item.tenbn || "—"}</td>
                      <td>{item.tent || "—"}</td>
                      <td style={{ textAlign: "center" }}>{item.soluong}</td>
                      <td>{item.lieudung || "—"}</td>
                      <td style={{ textAlign: "right", color: "#059669", fontWeight: 600 }}>{item.dongia ? Number(item.dongia).toLocaleString() + " đ" : "—"}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#2563eb" }}>{item.dongia ? (item.soluong * item.dongia).toLocaleString() + " đ" : "—"}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" title="Sửa" onClick={() => openEdit(item)}><i className="fas fa-pen"></i></button>
                          <button className="btn-delete" title="Xóa" onClick={() => setShowConfirm(item)}><i className="fas fa-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>{filtered.length}</strong> đơn thuốc</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-prescription-bottle-alt" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>{editItem ? "Cập nhật Đơn thuốc" : "Kê đơn thuốc mới"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-form-body">
              <div className="form-group">
                <label>Mã Phiếu khám <span className="required">*</span></label>
                <input type="number" placeholder="VD: 1" value={form.mapk} onChange={(e) => setForm({ ...form, mapk: e.target.value })} className={formErrors.mapk ? "input-error" : ""} />
                {formErrors.mapk && <div className="error-text">{formErrors.mapk}</div>}
              </div>
              <div className="form-group">
                <label>Thuốc <span className="required">*</span></label>
                <select value={form.mat} onChange={(e) => setForm({ ...form, mat: e.target.value })} className={formErrors.mat ? "input-error" : ""}>
                  <option value="">-- Chọn thuốc --</option>
                  {thuocList.map(t => <option key={t.mat} value={t.mat}>{t.tent} ({t.donvi} — {Number(t.dongia).toLocaleString()}đ)</option>)}
                </select>
                {formErrors.mat && <div className="error-text">{formErrors.mat}</div>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Số lượng <span className="required">*</span></label>
                  <input type="number" min="1" placeholder="VD: 10" value={form.soluong} onChange={(e) => setForm({ ...form, soluong: e.target.value })} className={formErrors.soluong ? "input-error" : ""} />
                  {formErrors.soluong && <div className="error-text">{formErrors.soluong}</div>}
                </div>
                <div className="form-group">
                  <label>Liều dùng</label>
                  <input type="text" placeholder="VD: Sau ăn, 2 lần/ngày" value={form.lieudung} onChange={(e) => setForm({ ...form, lieudung: e.target.value })} />
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
            <h3>Xóa thuốc khỏi đơn?</h3>
            <p>Bạn có chắc muốn xóa <strong>{showConfirm.tent}</strong> khỏi đơn?</p>
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
