import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import Loading from "../component/loading/Loading";
import { toast } from "react-toastify";
import "./NhanVienPage.css";

const ROLES = ["Bác sĩ", "Tiếp tân", "Kế toán", "Kỹ thuật viên", "Dược sĩ", "Admin"];

export default function NhanVienPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ hoten: "", chucvu: "Bác sĩ", sdt: "", diachi: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: const res = await apiGet("/nhan-vien");
        toast.info("Sẵn sàng kết nối API Nhân viên");
      } catch {
        toast.error("Lỗi tải danh sách nhân viên!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ hoten: "", chucvu: "Bác sĩ", sdt: "", diachi: "" });
    setFormErrors({});
    setShowModal(true);
  };

  return (
    <div className="page-layout">
      {loading && <Loading text="Đang tải danh sách nhân viên..." />}
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
                  <tr><td colSpan="6" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>0</strong> nhân viên</div>
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
              <button className="btn-save" onClick={() => { toast.success("Lưu nhân viên thành công!"); setShowModal(false); }}><i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu</button>
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
              <button className="btn-danger" onClick={() => { toast.success("Xóa nhân viên thành công!"); setShowConfirm(null); }}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
