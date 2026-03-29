import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./XetNghiemPage.css";

const PENDING_REQUESTS = [
  { maxn: "XN-001", mapk: "PK-001", hoten: "Nguyễn Văn An", mabn: "BN-001", tuoi: 45, gioitinh: "Nam", dichvu: "Xét nghiệm máu (CBC)", bacsi: "BS. Trần Hoài Nam", thoigian: "10 phút trước", trangthai: "Chờ kết quả" },
  { maxn: "XN-002", mapk: "PK-002", hoten: "Trần Thị Bích", mabn: "BN-002", tuoi: 29, gioitinh: "Nữ", dichvu: "Chụp X-Quang Phổi", bacsi: "BS. Lê Minh Tâm", thoigian: "35 phút trước", trangthai: "Chờ kết quả" },
  { maxn: "XN-003", mapk: "PK-003", hoten: "Phạm Hồng Nhung", mabn: "BN-003", tuoi: 36, gioitinh: "Nữ", dichvu: "Siêu âm bụng", bacsi: "BS. Trần Hoài Nam", thoigian: "1 giờ trước", trangthai: "Chờ kết quả" },
];

export default function XetNghiemPage() {
  const [requests, setRequests] = useState(PENDING_REQUESTS);
  const [selected, setSelected] = useState(PENDING_REQUESTS[0]);
  const [ketqua, setKetqua] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSave = () => {
    if (!ketqua.trim()) return;
    setRequests(requests.map((r) => r.maxn === selected.maxn ? { ...r, trangthai: "Đã xong", ketqua } : r));
    setKetqua("");
    setFileName("");
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header userName="KTV. Phạm Văn B" userRole="Kỹ thuật viên" />
        <div className="page-content xn-content">
          {/* Left: Pending list */}
          <div className="xn-left">
            <h2 className="xn-section-title">Yêu cầu chờ xử lý ({requests.filter((r) => r.trangthai === "Chờ kết quả").length})</h2>
            {requests.map((r) => (
              <div
                key={r.maxn}
                className={`xn-card ${selected?.maxn === r.maxn ? "active" : ""} ${r.trangthai === "Đã xong" ? "done" : ""}`}
                onClick={() => setSelected(r)}
              >
                <div className="xn-card-top">
                  <span className={`badge-status ${r.trangthai === "Đã xong" ? "badge-green" : "badge-orange"}`}>{r.trangthai}</span>
                  <span className="xn-time">{r.thoigian}</span>
                </div>
                <div className="xn-card-name">{r.hoten}</div>
                <div className="xn-card-sub">Mã PK: {r.mapk}</div>
                <div className="xn-card-dv"><i className="fas fa-tint"></i> {r.dichvu}</div>
                <div className="xn-card-bs">BS chỉ định: {r.bacsi}</div>
              </div>
            ))}
          </div>

          {/* Right: Result form */}
          <div className="xn-right">
            {selected ? (
              <>
                <div className="xn-form-header">
                  <div>
                    <h2>Cập nhật Kết quả Xét nghiệm</h2>
                    <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>Mã XN: {selected.maxn}</p>
                  </div>
                </div>
                <div className="xn-form-body">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div className="info-card blue-bg">
                      <div className="info-label">Thông tin Bệnh nhân</div>
                      <div className="info-title">{selected.hoten}</div>
                      <div className="info-sub">Mã BN: {selected.mabn} | {selected.tuoi} tuổi | {selected.gioitinh}</div>
                    </div>
                    <div className="info-card teal-bg">
                      <div className="info-label">Dịch vụ thực hiện</div>
                      <div className="info-title" style={{ color: "#115e59" }}>{selected.dichvu}</div>
                      <div className="info-sub" style={{ color: "#0d9488" }}>BS chỉ định: {selected.bacsi}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label className="field-label">Nhập kết quả chuyên môn <span style={{ color: "#ef4444" }}>*</span></label>
                    <textarea
                      rows="6"
                      className="field-textarea"
                      placeholder="Nhập các chỉ số WBC, RBC, HGB, PLT... hoặc kết luận tại đây..."
                      value={ketqua}
                      onChange={(e) => setKetqua(e.target.value)}
                    />
                  </div>

                  <div className="upload-area">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p className="upload-title">Tải lên file ảnh/PDF kết quả (tùy chọn)</p>
                    <p className="upload-hint">Hỗ trợ định dạng: .jpg, .png, .pdf</p>
                    {fileName && <p className="upload-file">{fileName}</p>}
                    <input type="file" accept=".jpg,.png,.pdf" style={{ display: "none" }} id="xn-upload"
                      onChange={(e) => setFileName(e.target.files[0]?.name || "")} />
                    <label htmlFor="xn-upload" className="upload-btn">Chọn file</label>
                  </div>
                </div>
                <div className="xn-form-footer">
                  <button className="btn-cancel" onClick={() => { setKetqua(""); setFileName(""); }}>Hủy bỏ</button>
                  <button className="btn-save" style={{ background: "#0d9488" }} onClick={handleSave}>
                    <i className="fas fa-paper-plane" style={{ marginRight: "0.4rem" }}></i>Lưu & Chuyển cho Bác sĩ
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <i className="fas fa-flask"></i>
                <p>Chọn một yêu cầu xét nghiệm từ danh sách bên trái</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
