import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./NhanVienPage.css";

const INITIAL_STAFF = [
  { manv: "NV-001", hoten: "BS. Trần Hoài Nam", chucvu: "Bác sĩ", sdt: "0901 234 567", tendn: "namth_bs", diachi: "HCM" },
  { manv: "NV-002", hoten: "Nguyễn Thị Lan", chucvu: "Tiếp tân", sdt: "0912 345 678", tendn: "lannt_tt", diachi: "HCM" },
  { manv: "NV-003", hoten: "Lê Văn Khải", chucvu: "Kế toán", sdt: "0988 765 432", tendn: "khailv_kt", diachi: "HN" },
  { manv: "NV-004", hoten: "KTV. Phạm Văn B", chucvu: "Kỹ thuật viên", sdt: "0907 111 222", tendn: "bpv_ktv", diachi: "HCM" },
];

const ROLES = ["Bác sĩ", "Tiếp tân", "Kế toán", "Kỹ thuật viên", "Dược sĩ", "Admin"];

export default function NhanVienPage() {
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ hoten: "", chucvu: "Bác sĩ", sdt: "", diachi: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);

  const filtered = staff.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = s.hoten.toLowerCase().includes(q) || s.manv.toLowerCase().includes(q);
    const matchRole = !filterRole || s.chucvu === filterRole;
    return matchSearch && matchRole;
  });

  const getBadge = (cv) => {
    if (cv === "Bác sĩ") return "badge-status badge-blue";
    if (cv === "Tiếp tân") return "badge-status badge-purple";
    if (cv === "Kế toán") return "badge-status badge-green";
    if (cv === "Kỹ thuật viên") return "badge-status badge-teal";
    if (cv === "Dược sĩ") return "badge-status badge-orange";
    return "badge-status badge-gray";
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ hoten: "", chucvu: "Bác sĩ", sdt: "", diachi: "" });
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ hoten: item.hoten, chucvu: item.chucvu, sdt: item.sdt, diachi: item.diachi });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.hoten.trim()) errs.hoten = "Họ tên bắt buộc";
    if (!form.sdt.trim()) errs.sdt = "Số điện thoại bắt buộc";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (editItem) {
      setStaff(staff.map((s) => s.manv === editItem.manv ? { ...s, hoten: form.hoten, chucvu: form.chucvu, sdt: form.sdt, diachi: form.diachi } : s));
    } else {
      const newItem = {
        manv: "NV-" + String(staff.length + 1).padStart(3, "0"),
        hoten: form.hoten,
        chucvu: form.chucvu,
        sdt: form.sdt,
        diachi: form.diachi,
        tendn: "",
      };
      setStaff([...staff, newItem]);
    }
    setShowModal(false);
  };

  const handleDelete = (manv) => {
    setStaff(staff.filter((s) => s.manv !== manv));
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
              <h1>Danh mục Nhân viên</h1>
              <p>Quản lý hồ sơ Bác sĩ, Kế toán, Tiếp tân và phân quyền tài khoản.</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-user-plus"></i> Thêm Nhân viên
            </button>
          </div>

          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm theo tên hoặc mã NV..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="filter-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="">Tất cả chức vụ</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã NV</th>
                    <th>Họ và Tên</th>
                    <th>Chức vụ</th>
                    <th>Số điện thoại</th>
                    <th>Tài khoản (tendn)</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="6" className="empty-state"><p>Không tìm thấy nhân viên nào</p></td></tr>
                  ) : filtered.map((s) => (
                    <tr key={s.manv}>
                      <td style={{ fontWeight: 500 }}>{s.manv}</td>
                      <td>
                        <div className="data-table name-cell">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.hoten)}&background=e0f2fe&color=0284c7&size=32`} alt={s.hoten} />
                          <span className="name">{s.hoten}</span>
                        </div>
                      </td>
                      <td><span className={getBadge(s.chucvu)}>{s.chucvu}</span></td>
                      <td>{s.sdt}</td>
                      <td style={{ color: "#6b7280" }}>{s.tendn || "-"}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" title="Chỉnh sửa" onClick={() => openEdit(s)}><i className="fas fa-edit"></i></button>
                          <button className="btn-delete" title="Xóa" onClick={() => setShowConfirm(s.manv)}><i className="fas fa-trash-alt"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>{filtered.length}</strong> trong tổng số <strong>{staff.length}</strong> nhân viên</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-user-md" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>{editItem ? "Cập nhật Nhân viên" : "Thêm Nhân viên mới"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-form-body">
              <div className="form-group">
                <label>Họ và Tên <span className="required">*</span></label>
                <input type="text" placeholder="Nhập họ tên..." value={form.hoten} onChange={(e) => setForm({ ...form, hoten: e.target.value })} className={formErrors.hoten ? "input-error" : ""} />
                {formErrors.hoten && <div className="error-text">{formErrors.hoten}</div>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Chức vụ</label>
                  <select value={form.chucvu} onChange={(e) => setForm({ ...form, chucvu: e.target.value })}>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Số điện thoại <span className="required">*</span></label>
                  <input type="text" placeholder="VD: 0901234567" value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} className={formErrors.sdt ? "input-error" : ""} />
                  {formErrors.sdt && <div className="error-text">{formErrors.sdt}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input type="text" placeholder="Nhập địa chỉ..." value={form.diachi} onChange={(e) => setForm({ ...form, diachi: e.target.value })} />
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
            <h3>Xóa Nhân viên?</h3>
            <p>Chỉ xóa được nhân viên chưa liên kết phiếu khám hoặc tài khoản.</p>
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
