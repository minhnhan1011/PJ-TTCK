import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./DonThuocPage.css";

const INITIAL_DATA = [
  { madt: 1, mapk: "PK-001", hoten: "Nguyễn Văn An", tent: "Paracetamol", mat: 1, soluong: 10, lieudung: "Sau ăn", dongia: 5000, daThu: true },
  { madt: 2, mapk: "PK-002", hoten: "Trần Thị Bích", tent: "Amoxicillin", mat: 2, soluong: 7, lieudung: "Trước ăn", dongia: 10000, daThu: true },
  { madt: 3, mapk: "PK-001", hoten: "Nguyễn Văn An", tent: "Amoxicillin", mat: 2, soluong: 5, lieudung: "Sau ăn, 2 lần/ngày", dongia: 10000, daThu: true },
];

const THUOC_LIST = [
  { mat: 1, tent: "Paracetamol", dongia: 5000 },
  { mat: 2, tent: "Amoxicillin", dongia: 10000 },
];

export default function DonThuocPage() {
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ mapk: "", mat: "", soluong: "", lieudung: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);

  const filtered = data.filter((d) => {
    const q = search.toLowerCase();
    return d.mapk.toLowerCase().includes(q) || d.hoten.toLowerCase().includes(q) || d.tent.toLowerCase().includes(q);
  });

  const formatCurrency = (n) => n.toLocaleString("vi-VN");

  const openAdd = () => {
    setEditItem(null);
    setForm({ mapk: "", mat: String(THUOC_LIST[0].mat), soluong: "", lieudung: "" });
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    if (item.daThu) return;
    setEditItem(item);
    setForm({ mapk: item.mapk, mat: String(item.mat), soluong: String(item.soluong), lieudung: item.lieudung });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.mapk.trim()) errs.mapk = "Mã phiếu khám bắt buộc";
    if (!form.soluong || Number(form.soluong) <= 0) errs.soluong = "Số lượng phải > 0";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const thuoc = THUOC_LIST.find((t) => String(t.mat) === form.mat);
    if (editItem) {
      setData(data.map((d) => d.madt === editItem.madt ? { ...d, mapk: form.mapk, mat: Number(form.mat), tent: thuoc.tent, soluong: Number(form.soluong), lieudung: form.lieudung, dongia: thuoc.dongia } : d));
    } else {
      const newItem = {
        madt: data.length + 1,
        mapk: form.mapk,
        hoten: "-",
        tent: thuoc.tent,
        mat: Number(form.mat),
        soluong: Number(form.soluong),
        lieudung: form.lieudung,
        dongia: thuoc.dongia,
        daThu: false,
      };
      setData([...data, newItem]);
    }
    setShowModal(false);
  };

  const handleDelete = (madt) => {
    const item = data.find((d) => d.madt === madt);
    if (item && item.daThu) return;
    setData(data.filter((d) => d.madt !== madt));
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
              <h1>Quản lý Đơn thuốc</h1>
              <p>Kê đơn, cập nhật và quản lý đơn thuốc theo phiếu khám.</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-prescription-bottle-alt"></i> Kê đơn thuốc
            </button>
          </div>

          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm theo mã PK, tên BN, tên thuốc..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
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
                    <th>Thanh toán</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="10" className="empty-state"><p>Không tìm thấy đơn thuốc nào</p></td></tr>
                  ) : filtered.map((d) => (
                    <tr key={d.madt}>
                      <td className="code-cell">ĐT-{String(d.madt).padStart(3, "0")}</td>
                      <td style={{ fontWeight: 500 }}>{d.mapk}</td>
                      <td>{d.hoten}</td>
                      <td style={{ fontWeight: 500 }}>{d.tent}</td>
                      <td style={{ textAlign: "center" }}>{d.soluong}</td>
                      <td>{d.lieudung}</td>
                      <td style={{ textAlign: "right" }}>{formatCurrency(d.dongia)}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>{formatCurrency(d.soluong * d.dongia)}</td>
                      <td><span className={`badge-status ${d.daThu ? "badge-green" : "badge-orange"}`}>{d.daThu ? "Đã thu" : "Chưa thu"}</span></td>
                      <td>
                        <div className="action-btns">
                          {!d.daThu && (
                            <>
                              <button className="btn-edit" title="Sửa" onClick={() => openEdit(d)}><i className="fas fa-edit"></i></button>
                              <button className="btn-delete" title="Xóa" onClick={() => setShowConfirm(d.madt)}><i className="fas fa-trash-alt"></i></button>
                            </>
                          )}
                          <button className="btn-view" title="Xem"><i className="fas fa-eye"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>{filtered.length}</strong> trong tổng số <strong>{data.length}</strong> đơn thuốc</div>
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
                <input type="text" placeholder="VD: PK-001" value={form.mapk} onChange={(e) => setForm({ ...form, mapk: e.target.value })} className={formErrors.mapk ? "input-error" : ""} />
                {formErrors.mapk && <div className="error-text">{formErrors.mapk}</div>}
              </div>
              <div className="form-group">
                <label>Thuốc</label>
                <select value={form.mat} onChange={(e) => setForm({ ...form, mat: e.target.value })}>
                  {THUOC_LIST.map((t) => <option key={t.mat} value={t.mat}>{t.tent} ({formatCurrency(t.dongia)} VNĐ)</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Số lượng <span className="required">*</span></label>
                  <input type="number" placeholder="VD: 10" value={form.soluong} onChange={(e) => setForm({ ...form, soluong: e.target.value })} className={formErrors.soluong ? "input-error" : ""} />
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
            <p>Chỉ xóa được khi phiếu khám chưa thanh toán.</p>
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
