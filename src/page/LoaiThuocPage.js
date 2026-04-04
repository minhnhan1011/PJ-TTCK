import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import Loading from "../component/loading/Loading";
import { toast } from "react-toastify";
import "./LoaiThuocPage.css";

export default function LoaiThuocPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ tenlt: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: const res = await apiGet("/loai-thuoc");
        toast.info("Sẵn sàng kết nối API Loại thuốc");
      } catch {
        toast.error("Lỗi tải danh sách loại thuốc!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ tenlt: "" });
    setFormErrors({});
    setShowModal(true);
  };

  return (
    <div className="page-layout">
      {loading && <Loading text="Đang tải loại thuốc..." />}
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
              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Tổng: <strong style={{ color: "#2563eb" }}>0</strong> loại</div>
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
                  <tr><td colSpan="3" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>0</strong> loại thuốc</div>
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
              <button className="btn-save" onClick={() => { toast.success("Lưu loại thuốc thành công!"); setShowModal(false); }}><i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu</button>
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
              <button className="btn-danger" onClick={() => { toast.success("Xóa loại thuốc thành công!"); setShowConfirm(null); }}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
