import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
=======
import Loading from "../component/loading/Loading";
import { toast } from "react-toastify";
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
import "./KioskPage.css";

const LY_DO_KHAM = [
  "Khám tổng quát",
  "Sốt / Cảm cúm",
  "Đau bụng",
  "Đau đầu",
  "Tai mũi họng",
  "Da liễu",
  "Khác",
];

export default function KioskPage() {
  const [clock, setClock] = useState(new Date().toLocaleTimeString("vi-VN"));
  const [lydokham, setLydokham] = useState("");
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState(false);
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString("vi-VN"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLaySo = () => {
    if (!lydokham) {
      setError("Vui lòng chọn lý do khám");
      return;
    }
    setError("");
<<<<<<< HEAD
    // TODO: Gọi API lấy số thứ tự từ backend
=======
    setLoading(true);
    // TODO: Gọi API lấy số thứ tự từ backend
    toast.info("Đang lấy số thứ tự...");
    setLoading(false);
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
  };

  const closeModal = () => {
    setModal(null);
    setLydokham("");
  };

  return (
    <div className="kiosk-page">
<<<<<<< HEAD
=======
      {loading && <Loading text="Đang lấy số thứ tự..." />}
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
      <div className="kiosk-overlay"></div>

      <div className="kiosk-card">
        {/* Header */}
        <div className="kiosk-header">
          <h1>
            <i className="fas fa-hospital-user"></i>CLINICFLOW MEDICAL
          </h1>
          <p>Hệ thống Lấy số thứ tự Tự động</p>
        </div>

        {/* Body */}
        <div className="kiosk-body">
          <h2>Xin chào! Vui lòng chọn dịch vụ bạn cần</h2>

          {/* Dropdown lý do khám */}
          <div className="kiosk-reason-group">
            <label>Lý do khám</label>
            <select
              className={`kiosk-reason-select${error ? " select-error" : ""}`}
              value={lydokham}
              onChange={(e) => {
                setLydokham(e.target.value);
                if (e.target.value) setError("");
              }}
            >
              <option value="">-- Chọn lý do khám --</option>
              {LY_DO_KHAM.map((ld) => (
                <option key={ld} value={ld}>
                  {ld}
                </option>
              ))}
            </select>
            {error && <div className="kiosk-error-text">{error}</div>}
          </div>

          {/* Button lấy số */}
          <div className="kiosk-btn-area">
            <button className="kiosk-btn" onClick={handleLaySo}>
              <div className="kiosk-btn-icon">
                <i className="fas fa-stethoscope"></i>
              </div>
              <span className="kiosk-btn-title">Lấy số Khám bệnh</span>
              <span className="kiosk-btn-desc">Nhấn để lấy số thứ tự khám bệnh</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="kiosk-footer">
          <div className="clock">
            <i className="far fa-clock"></i>
            <span>{clock}</span>
          </div>
          <div className="note">Vui lòng lấy phiếu in và ngồi chờ tại sảnh.</div>
          <Link to="/" className="admin-link">
            <i className="fas fa-cog"></i> Quản trị
          </Link>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Lấy số thành công!</h3>
            <div className="modal-info">
              <div className="stt-display">{modal.stt}</div>
              <div className="info-row">
                <span className="info-label">Lý do khám:</span>
                <span className="info-value">{modal.lydokham}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ngày:</span>
                <span className="info-value">{modal.ngay}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Giờ:</span>
                <span className="info-value">{modal.gio}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-print" onClick={closeModal}>
                <i className="fas fa-print"></i> In phiếu
              </button>
              <button className="btn-close-modal" onClick={closeModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
