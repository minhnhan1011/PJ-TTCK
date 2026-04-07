<<<<<<< HEAD
import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
=======
import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import Loading from "../component/loading/Loading";
import { toast } from "react-toastify";
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
import "./DonThuocPage.css";

export default function DonThuocPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ mapk: "", mat: "", soluong: "", lieudung: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: const res = await apiGet("/don-thuoc");
        toast.info("Sẵn sàng kết nối API Đơn thuốc");
      } catch {
        toast.error("Lỗi tải danh sách đơn thuốc!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a

  const openAdd = () => {
    setEditItem(null);
    setForm({ mapk: "", mat: "", soluong: "", lieudung: "" });
    setFormErrors({});
    setShowModal(true);
  };

  return (
    <div className="page-layout">
<<<<<<< HEAD
=======
      {loading && <Loading text="Đang tải đơn thuốc..." />}
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
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
                  <tr><td colSpan="10" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>0</strong> đơn thuốc</div>
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
                  <option value="">-- Chọn thuốc --</option>
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
<<<<<<< HEAD
              <button className="btn-save" onClick={() => setShowModal(false)}><i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu</button>
=======
              <button className="btn-save" onClick={() => { toast.success("Lưu đơn thuốc thành công!"); setShowModal(false); }}><i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu</button>
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
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
<<<<<<< HEAD
              <button className="btn-danger" onClick={() => setShowConfirm(null)}>Xóa</button>
=======
              <button className="btn-danger" onClick={() => { toast.success("Xóa đơn thuốc thành công!"); setShowConfirm(null); }}>Xóa</button>
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
