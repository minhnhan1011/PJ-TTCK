import { useState, useEffect, useMemo } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import Loading from "../component/loading/Loading";
import { toast } from "react-toastify";
import axios from "axios"; // Nhớ dùng axios cho đồng bộ với các trang khác
import "./DangKyKhamPage.css";

export default function DangKyKhamPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ hoten: "", lydokham: "", manv: "" });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- 1. KHAI BÁO CÁC BIẾN THIẾU ---
  const [listDangKy, setListDangKy] = useState([]);
  const [danhSachBS, setDanhSachBS] = useState([]);

  // --- 2. HÀM LẤY DANH SÁCH (fetchDanhSach) ---
  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/dang-ky-kham", { withCredentials: true });
      setListDangKy(res.data);
    } catch (err) {
      toast.error("Lỗi tải danh sách đăng ký!");
    } finally {
      setLoading(false);
    }
  };

  const fetchBacSi = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/nhan-vien/bac-si", { withCredentials: true });
      setDanhSachBS(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách bác sĩ");
    }
  };

  useEffect(() => {
    fetchDanhSach();
    fetchBacSi();
  }, []);

  // --- 3. HÀM VALIDATE ---
  const validate = () => {
    let errors = {};
    if (!form.hoten) errors.hoten = "Vui lòng nhập họ tên";
    if (!form.lydokham) errors.lydokham = "Vui lòng chọn lý do";
    if (!form.manv) errors.manv = "Vui lòng chọn bác sĩ";
    return errors;
  };

  // --- 4. TÍNH TOÁN STATS VÀ FILTER ---
  const stats = useMemo(() => {
    return {
      tong: listDangKy.length,
      choKham: listDangKy.filter(i => i.trangthai === 'Cho kham').length,
      dangKham: listDangKy.filter(i => i.trangthai === 'Dang kham').length,
      hoanThanh: listDangKy.filter(i => i.trangthai === 'Hoan thanh').length,
    };
  }, [listDangKy]);

  const filtered = listDangKy.filter(item => 
    item.hoten.toLowerCase().includes(search.toLowerCase()) || 
    (item.tenbs && item.tenbs.toLowerCase().includes(search.toLowerCase()))
  );

  // --- 5. CÁC HÀM XỬ LÝ (Mở Add, Edit, Delete...) ---
  const openAdd = () => {
    setForm({ hoten: "", lydokham: "", manv: "" });
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ hoten: item.hoten, lydokham: item.lydokham, manv: String(item.manv) });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSubmitting(true);
    try {
      await axios.post("http://localhost:4000/api/dang-ky-kham", form, { withCredentials: true });
      toast.success("Lập phiếu thành công!");
      setShowModal(false);
      fetchDanhSach();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi lưu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSubmitting(true);
    try {
      await axios.put(`http://localhost:4000/api/dang-ky-kham/${editItem.madk}`, form, { withCredentials: true });
      toast.success("Cập nhật thành công!");
      setShowEditModal(false);
      fetchDanhSach();
    } catch (err) {
      toast.error("Lỗi khi cập nhật");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (madk) => {
    if (!window.confirm("Bạn có chắc muốn xóa phiếu đăng ký này?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/dang-ky-kham/${madk}`, { withCredentials: true });
      toast.success("Đã xóa!");
      fetchDanhSach();
    } catch (err) {
      toast.error("Lỗi khi xóa");
    }
  };

  const trangThaiLabel = {
    "Cho kham": { text: "Chờ khám", className: "badge-orange" },
    "Dang kham": { text: "Đang khám", className: "badge-green" },
    "Hoan thanh": { text: "Hoàn thành", className: "badge-purple" },
  };

  return (
    <div className="page-layout">
      {loading && <Loading text="Đang tải danh sách đăng ký..." />}
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Quản lý Đăng ký khám</h1>
              <p>Lập phiếu đăng ký khám, hủy/đổi lịch khám bệnh nhân.</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-plus"></i> Lập phiếu khám mới
            </button>
          </div>

          {/* Hiển thị chỉ số Stats */}
          <div className="stat-cards">
            <div className="stat-card blue">
              <div className="stat-label">Tổng đăng ký</div>
              <div className="stat-number">{stats.tong}</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Chờ khám</div>
              <div className="stat-number">{stats.choKham}</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Đang khám</div>
              <div className="stat-number">{stats.dangKham}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Hoàn thành</div>
              <div className="stat-number">{stats.hoanThanh}</div>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  placeholder="Tìm theo tên BN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã ĐK</th>
                    <th>Bệnh nhân</th>
                    <th>Lý do khám</th>
                    <th>Bác sĩ phụ trách</th>
                    <th>Ngày đăng ký</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.madk}>
                      <td>{item.madk}</td>
                      <td>{item.hoten}</td>
                      <td>{item.lydokham}</td>
                      <td>{item.tenbs ?? "-"}</td>
                      <td>{new Date(item.ngaydangky).toLocaleDateString("vi-VN")}</td>
                      <td>
                        <span className={`badge ${trangThaiLabel[item.trangthai]?.className ?? ""}`}>
                          {trangThaiLabel[item.trangthai]?.text ?? item.trangthai}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn-icon btn-edit" onClick={() => openEdit(item)}><i className="fas fa-edit"></i></button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(item.madk)}><i className="fas fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Lập phiếu mới (Dùng chung cho cả Add và Edit cho gọn) */}
      {(showModal || showEditModal) && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setShowEditModal(false); }}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3>{showEditModal ? "Sửa phiếu khám" : "Lập phiếu đăng ký"}</h3>
            </div>
            <div className="modal-form-body">
              <div className="form-group">
                <label>Họ tên <span className="required">*</span></label>
                <input type="text" value={form.hoten} onChange={(e) => setForm({ ...form, hoten: e.target.value })} />
                {formErrors.hoten && <span className="error-text">{formErrors.hoten}</span>}
              </div>
              <div className="form-group">
                <label>Lý do <span className="required">*</span></label>
                <select value={form.lydokham} onChange={(e) => setForm({ ...form, lydokham: e.target.value })}>
                  <option value="">-- Chọn lý do --</option>
                  <option>Khám tổng quát</option>
                  <option>Sốt / Cảm cúm</option>
                  <option>Khác</option>
                </select>
                {formErrors.lydokham && <span className="error-text">{formErrors.lydokham}</span>}
              </div>
              <div className="form-group">
                <label>Bác sĩ <span className="required">*</span></label>
                <select value={form.manv} onChange={(e) => setForm({ ...form, manv: e.target.value })}>
                  <option value="">-- Chọn bác sĩ --</option>
                  {danhSachBS.map(bs => <option key={bs.manv} value={bs.manv}>{bs.hoten}</option>)}
                </select>
                {formErrors.manv && <span className="error-text">{formErrors.manv}</span>}
              </div>
            </div>
            <div className="modal-form-footer">
              <button onClick={() => { setShowModal(false); setShowEditModal(false); }}>Hủy</button>
              <button className="btn-save" onClick={showEditModal ? handleEdit : handleSubmit} disabled={submitting}>
                {submitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}