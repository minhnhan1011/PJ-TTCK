import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import { message, Spin } from "antd";
import "./DangKyKhamPage.css";

const ModalForm = ({
  title,
  onSubmit,
  onClose,
  form,
  setForm,
  formErrors,
  danhSachBS,
  danhSachBN,
  submitting,
  isEdit,
}) => {
  const selectedBN = danhSachBN.find(
    (bn) => String(bn.mabn) === String(form.mabn),
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <h3>
            <i
              className="fas fa-clipboard-list"
              style={{ marginRight: "0.5rem", color: "#2563eb" }}
            ></i>
            {title}
          </h3>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-form-body">
          
          {/* CHỌN BỆNH NHÂN */}
          <div className="form-group">
            <label>
              Bệnh nhân <span className="required">*</span>
            </label>
            <select
              value={form.mabn}
              onChange={(e) => setForm({ ...form, mabn: e.target.value })}
              className={formErrors.mabn ? "input-error" : ""}
            >
              <option value="">-- Chọn bệnh nhân --</option>
              {danhSachBN.map((bn) => (
                <option key={bn.mabn} value={bn.mabn}>
                  #{bn.mabn} — {bn.hoten}
                </option>
              ))}
            </select>
            {formErrors.mabn && (
              <div className="error-text">{formErrors.mabn}</div>
            )}
          </div>

          {/* HIỂN THỊ THÔNG TIN BN SAU KHI CHỌN */}
          {selectedBN && (
            <div className="bn-info-box">
              <div>
                <span>Họ tên:</span> {selectedBN.hoten}
              </div>
              <div>
                <span>Giới tính:</span> {selectedBN.gioitinh ?? "—"}
              </div>
              <div>
                <span>Ngày sinh:</span>{" "}
                {selectedBN.ngaysinh
                  ? new Date(selectedBN.ngaysinh).toLocaleDateString("vi-VN")
                  : "—"}
              </div>
              <div>
                <span>SĐT:</span> {selectedBN.sdt ?? "—"}
              </div>
            </div>
          )}

          {/* LÝ DO KHÁM */}
          <div className="form-group">
            <label>
              Lý do khám <span className="required">*</span>
            </label>
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
            {formErrors.lydokham && (
              <div className="error-text">{formErrors.lydokham}</div>
            )}
          </div>

          {/* BÁC SĨ */}
          <div className="form-group">
            <label>
              Bác sĩ phụ trách <span className="required">*</span>
            </label>
            <select
              value={form.manv}
              onChange={(e) => setForm({ ...form, manv: e.target.value })}
              className={formErrors.manv ? "input-error" : ""}
            >
              <option value="">-- Chọn bác sĩ --</option>
              {danhSachBS.map((bs) => (
                <option key={bs.manv} value={bs.manv}>
                  {bs.hoten}
                </option>
              ))}
            </select>
            {formErrors.manv && (
              <div className="error-text">{formErrors.manv}</div>
            )}
          </div>
          {/* TRẠNG THÁI — chỉ hiện khi chỉnh sửa */}
          {isEdit && (
            <div className="form-group">
              <label>Trạng thái</label>
              <select
                value={form.trangthai}
                onChange={(e) =>
                  setForm({ ...form, trangthai: e.target.value })
                }
              >
                <option value="Cho kham">Chờ khám</option>
                <option value="Dang kham">Đang khám</option>
                <option value="Hoan thanh">Hoàn thành</option>
              </select>
            </div>
          )}
        </div>

        <div className="modal-form-footer">
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-save" onClick={onSubmit} disabled={submitting}>
            <i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>
            {submitting ? "Đang lưu..." : "Lưu & Cấp STT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DangKyKhamPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ mabn: "", lydokham: "", manv: "" });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [danhSach, setDanhSach] = useState([]);
  const [danhSachBS, setDanhSachBS] = useState([]);
  const [danhSachBN, setDanhSachBN] = useState([]);

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/dang-ky-kham", {
        credentials: "include",
      });
      const data = await res.json();
      setDanhSach(Array.isArray(data) ? data : []);
    } catch (err) {
      setDanhSach([]);
      message.error("Không thể tải danh sách đăng ký khám!");
    } finally {
      setLoading(false);
    }
  };

  const fetchDanhSachBS = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/nhan-vien/bac-si", {
        credentials: "include",
      });
      const data = await res.json();
      setDanhSachBS(Array.isArray(data) ? data : []);
    } catch (err) {
      setDanhSachBS([]);
      message.error("Không thể tải danh sách bác sĩ!");
    }
  };

  const fetchDanhSachBN = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/benh-nhan", {
        credentials: "include",
      });
      const data = await res.json();
      setDanhSachBN(Array.isArray(data) ? data : []);
    } catch (err) {
      setDanhSachBN([]);
      message.error("Không thể tải danh sách bệnh nhân!");
    }
  };

  useEffect(() => {
    fetchDanhSach();
    fetchDanhSachBS();
    fetchDanhSachBN();
  }, []);

  const stats = {
    tong: danhSach.length,
    choKham: danhSach.filter((d) => d.trangthai === "Cho kham").length,
    dangKham: danhSach.filter((d) => d.trangthai === "Dang kham").length,
    hoanThanh: danhSach.filter((d) => d.trangthai === "Hoan thanh").length,
  };

  const filtered = danhSach.filter((d) =>
    [String(d.madk), d.hoten ?? "", d.tenbs ?? ""].some((f) =>
      f.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const validate = () => {
    const errors = {};
    if (!form.mabn) errors.mabn = "Vui lòng chọn bệnh nhân";
    if (!form.lydokham) errors.lydokham = "Vui lòng chọn lý do khám";
    if (!form.manv) errors.manv = "Vui lòng chọn bác sĩ";
    return errors;
  };

  const openAdd = () => {
    setForm({ mabn: "", lydokham: "", manv: "" });
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      mabn: String(item.mabn),
      lydokham: item.lydokham,
      manv: String(item.manv),
      trangthai: item.trangthai, // 👈 thêm dòng này
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:4000/api/dang-ky-kham", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          mabn: form.mabn,
          lydokham: form.lydokham,
          manv: form.manv,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Lỗi server");
      }
      setShowModal(false);
      message.success("Lập phiếu đăng ký khám thành công!");
      fetchDanhSach();
    } catch (err) {
      message.error(err.message || "Có lỗi xảy ra khi lập phiếu!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost:4000/api/dang-ky-kham/${editItem.madk}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            mabn: form.mabn,
            lydokham: form.lydokham,
            manv: form.manv,
            trangthai: form.trangthai,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Lỗi server");
      }
      setShowEditModal(false);
      message.success("Cập nhật phiếu đăng ký thành công!");
      fetchDanhSach();
    } catch (err) {
      message.error(err.message || "Có lỗi xảy ra khi cập nhật!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (madk) => {
    if (!window.confirm("Bạn có chắc muốn xóa phiếu đăng ký này?")) return;
    try {
      const res = await fetch(
        `http://localhost:4000/api/dang-ky-kham/${madk}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Lỗi server");
      }
      message.success("Xóa phiếu đăng ký thành công!");
      fetchDanhSach();
    } catch (err) {
      message.error(err.message || "Có lỗi xảy ra khi xóa!");
    }
  };

  const trangThaiLabel = {
    "Cho kham": { text: "Chờ khám", className: "badge-orange" },
    "Dang kham": { text: "Đang khám", className: "badge-green" },
    "Hoan thanh": { text: "Hoàn thành", className: "badge-purple" },
  };

  return (
    <div className="page-layout">
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

          <Spin spinning={loading} tip="Đang tải dữ liệu...">
            <div className="table-container">
              <div className="table-toolbar">
                <div className="search-box">
                  <i className="fas fa-search"></i>
                  <input
                    placeholder="Tìm theo tên BN, mã ĐK, bác sĩ..."
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
                      <th>STT</th>
                      <th>Bệnh nhân</th>
                      <th>Lý do khám</th>
                      <th>Bác sĩ phụ trách</th>
                      <th>Ngày đăng ký</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: "right" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="empty-state">
                          <p>Chưa có dữ liệu</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item) => (
                        <tr key={item.madk}>
                          <td>{item.madk}</td>
                          <td>{item.stt ?? "—"}</td>
                          <td>{item.hoten}</td>
                          <td>{item.lydokham}</td>
                          <td>{item.tenbs ?? "-"}</td>
                          <td>
                            {new Date(item.ngaydangky).toLocaleDateString(
                              "vi-VN",
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                trangThaiLabel[item.trangthai]?.className ?? ""
                              }`}
                            >
                              {trangThaiLabel[item.trangthai]?.text ??
                                item.trangthai}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="btn-icon btn-edit"
                              onClick={() => openEdit(item)}
                              title="Chỉnh sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn-icon btn-delete"
                              onClick={() => handleDelete(item.madk)}
                              title="Xóa"
                            >
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
                <div>
                  Hiển thị <strong>{filtered.length}</strong> đăng ký
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </div>

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
          danhSachBN={danhSachBN}
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
          danhSachBN={danhSachBN}
          submitting={submitting}
          isEdit={true}
        />
      )}
    </div>
  );
}
