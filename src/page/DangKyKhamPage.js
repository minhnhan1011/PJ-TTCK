<<<<<<< HEAD
import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./DangKyKhamPage.css";

// --- COMPONENT CON: Tách ra ngoài để tránh lỗi reset khi gõ (Re-mounting) ---
const ModalForm = ({ 
  title, 
  onSubmit, 
  onClose, 
  form, 
  setForm, 
  formErrors, 
  danhSachBS, 
  submitting 
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <h3>
            <i className="fas fa-clipboard-list" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>
            {title}
          </h3>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-form-body">
          <div className="form-group">
            <label>Họ và Tên <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Nhập họ tên bệnh nhân..."
              value={form.hoten}
              onChange={(e) => setForm({ ...form, hoten: e.target.value })}
              className={formErrors.hoten ? "input-error" : ""}
            />
            {formErrors.hoten && <div className="error-text">{formErrors.hoten}</div>}
          </div>

          <div className="form-group">
            <label>Lý do khám <span className="required">*</span></label>
            <select
              value={form.lydokham}
              onChange={(e) => setForm({ ...form, lydokham: e.target.value })}
              className={formErrors.lydokham ? "input-error" : ""}
            >
              <option value="">-- Chọn lý do --</option>
              <option>Khám tổng quát</option>
              <option>Sốt / Cảm cúm</option>
              <option>Đau bụng</option>
              <option>Đau đầu</option>
              <option>Tai mũi họng</option>
              <option>Da liễu</option>
              <option>Khác</option>
            </select>
            {formErrors.lydokham && <div className="error-text">{formErrors.lydokham}</div>}
          </div>

          <div className="form-group">
            <label>Bác sĩ phụ trách <span className="required">*</span></label>
            <select
              value={form.manv}
              onChange={(e) => setForm({ ...form, manv: e.target.value })}
              className={formErrors.manv ? "input-error" : ""}
            >
              <option value="">-- Chọn bác sĩ --</option>
              {danhSachBS.map((bs) => (
                <option key={bs.manv} value={bs.manv}>{bs.hoten}</option>
              ))}
            </select>
            {formErrors.manv && <div className="error-text">{formErrors.manv}</div>}
          </div>
        </div>
        <div className="modal-form-footer">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-save" onClick={onSubmit} disabled={submitting}>
            <i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>
            {submitting ? "Đang lưu..." : "Lưu & Cấp STT"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
=======
import { useState, useEffect, useMemo } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import Loading from "../component/loading/Loading";
import { toast } from "react-toastify";
import axios from "axios"; // Nhớ dùng axios cho đồng bộ với các trang khác
import "./DangKyKhamPage.css";

>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
export default function DangKyKhamPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ hoten: "", lydokham: "", manv: "" });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
<<<<<<< HEAD
  const [danhSach, setDanhSach] = useState([]);
  const [danhSachBS, setDanhSachBS] = useState([]);

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/dang-ky-kham", { credentials: "include" });
      const data = await res.json();
      setDanhSach(Array.isArray(data) ? data : []);
    } catch (err) {
      setDanhSach([]);
=======

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
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const fetchDanhSachBS = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/nhan-vien/bac-si", { credentials: "include" });
      const data = await res.json();
      setDanhSachBS(Array.isArray(data) ? data : []);
    } catch (err) {
      setDanhSachBS([]);
=======
  const fetchBacSi = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/nhan-vien/bac-si", { withCredentials: true });
      setDanhSachBS(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách bác sĩ");
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
    }
  };

  useEffect(() => {
    fetchDanhSach();
<<<<<<< HEAD
    fetchDanhSachBS();
  }, []);

  const stats = {
    tong: danhSach.length,
    choKham: danhSach.filter((d) => d.trangthai === "Cho kham").length,
    dangKham: danhSach.filter((d) => d.trangthai === "Dang kham").length,
    hoanThanh: danhSach.filter((d) => d.trangthai === "Hoan thanh").length,
  };

  const filtered = danhSach.filter((d) =>
    [String(d.madk), d.hoten ?? "", d.tenbs ?? ""].some((f) =>
      f.toLowerCase().includes(search.toLowerCase())
    )
  );

  const validate = () => {
    const errors = {};
    if (!form.hoten.trim()) errors.hoten = "Vui lòng nhập họ tên";
    if (!form.lydokham) errors.lydokham = "Vui lòng chọn lý do khám";
=======
    fetchBacSi();
  }, []);

  // --- 3. HÀM VALIDATE ---
  const validate = () => {
    let errors = {};
    if (!form.hoten) errors.hoten = "Vui lòng nhập họ tên";
    if (!form.lydokham) errors.lydokham = "Vui lòng chọn lý do";
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
    if (!form.manv) errors.manv = "Vui lòng chọn bác sĩ";
    return errors;
  };

<<<<<<< HEAD
=======
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
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
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
<<<<<<< HEAD
      const res = await fetch("http://localhost:4000/api/dang-ky-kham", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ hoten: form.hoten, lydokham: form.lydokham, manv: form.manv }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Lỗi server");
      }
      setShowModal(false);
      fetchDanhSach();
    } catch (err) {
      alert(err.message);
=======
      await axios.post("http://localhost:4000/api/dang-ky-kham", form, { withCredentials: true });
      toast.success("Lập phiếu thành công!");
      setShowModal(false);
      fetchDanhSach();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi lưu");
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSubmitting(true);
    try {
<<<<<<< HEAD
      const res = await fetch(`http://localhost:4000/api/dang-ky-kham/${editItem.madk}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ hoten: form.hoten, lydokham: form.lydokham, manv: form.manv }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Lỗi server");
      }
      setShowEditModal(false);
      fetchDanhSach();
    } catch (err) {
      alert(err.message);
=======
      await axios.put(`http://localhost:4000/api/dang-ky-kham/${editItem.madk}`, form, { withCredentials: true });
      toast.success("Cập nhật thành công!");
      setShowEditModal(false);
      fetchDanhSach();
    } catch (err) {
      toast.error("Lỗi khi cập nhật");
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (madk) => {
    if (!window.confirm("Bạn có chắc muốn xóa phiếu đăng ký này?")) return;
    try {
<<<<<<< HEAD
      const res = await fetch(`http://localhost:4000/api/dang-ky-kham/${madk}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Lỗi server");
      }
      fetchDanhSach();
    } catch (err) {
      alert(err.message);
=======
      await axios.delete(`http://localhost:4000/api/dang-ky-kham/${madk}`, { withCredentials: true });
      toast.success("Đã xóa!");
      fetchDanhSach();
    } catch (err) {
      toast.error("Lỗi khi xóa");
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
    }
  };

  const trangThaiLabel = {
    "Cho kham": { text: "Chờ khám", className: "badge-orange" },
    "Dang kham": { text: "Đang khám", className: "badge-green" },
    "Hoan thanh": { text: "Hoàn thành", className: "badge-purple" },
  };

  return (
    <div className="page-layout">
<<<<<<< HEAD
=======
      {loading && <Loading text="Đang tải danh sách đăng ký..." />}
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
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

<<<<<<< HEAD
=======
          {/* Hiển thị chỉ số Stats */}
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
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

<<<<<<< HEAD
=======
          {/* Bảng dữ liệu */}
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
<<<<<<< HEAD
                  placeholder="Tìm theo tên BN, mã ĐK, bác sĩ..."
=======
                  placeholder="Tìm theo tên BN..."
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
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
<<<<<<< HEAD
                  {loading ? (
                    <tr><td colSpan="7" className="empty-state"><p>Đang tải...</p></td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan="7" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                  ) : (
                    filtered.map((item) => (
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
                          <button className="btn-icon btn-edit" onClick={() => openEdit(item)} title="Chỉnh sửa">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn-icon btn-delete" onClick={() => handleDelete(item.madk)} title="Xóa">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>{filtered.length}</strong> đăng ký</div>
            </div>
=======
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
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Modal Lập phiếu mới */}
      {showModal && (
        <ModalForm
          title="Lập phiếu đăng ký khám"
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          form={form}
          setForm={setForm}
          formErrors={formErrors}
          danhSachBS={danhSachBS}
          submitting={submitting}
        />
      )}

      {/* Modal Chỉnh sửa */}
      {showEditModal && (
        <ModalForm
          title="Chỉnh sửa phiếu đăng ký"
          onSubmit={handleEdit}
          onClose={() => setShowEditModal(false)}
          form={form}
          setForm={setForm}
          formErrors={formErrors}
          danhSachBS={danhSachBS}
          submitting={submitting}
        />
=======
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
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
      )}
    </div>
  );
}