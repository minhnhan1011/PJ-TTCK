import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import { message } from "antd";
import "./XetNghiemPage.css";

export default function XetNghiemPage() {
  const [queue, setQueue]         = useState([]);
  const [selected, setSelected]   = useState(null);
  const [ketqua, setKetqua]       = useState("");
  const [ghichu, setGhichu]       = useState("");

  const loadQueue = () => {
    const data = JSON.parse(localStorage.getItem("xetnghiem_queue") || "[]");
    setQueue(data);
  };

  useEffect(() => {
    loadQueue();
    window.addEventListener("storage", loadQueue);
    return () => window.removeEventListener("storage", loadQueue);
  }, []);

  const handleChon = (item) => {
    setSelected(item);
    setKetqua("");
    setGhichu("");
  };

  const handleHoanThanh = () => {
    if (!ketqua.trim()) {
      message.warning("Vui lòng nhập kết quả xét nghiệm!");
      return;
    }
    // Xoá khỏi queue
    const newQueue = queue.filter((x) => x.madk !== selected.madk);
    localStorage.setItem("xetnghiem_queue", JSON.stringify(newQueue));
    setQueue(newQueue);
    setSelected(null);
    message.success("Đã lưu kết quả xét nghiệm!");
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content xn-content">

          {/* Left */}
          <div className="xn-left">
            <h2 className="xn-section-title">
              Yêu cầu chờ xử lý ({queue.length})
            </h2>

            {queue.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af" }}>
                Chưa có yêu cầu xét nghiệm
              </div>
            ) : (
              queue.map((item) => (
                <div
                  key={item.madk}
                  className={`xn-card ${selected?.madk === item.madk ? "xn-card-active" : ""}`}
                  onClick={() => handleChon(item)}
                >
                  <div className="xn-card-name">{item.hoten}</div>
                  <div className="xn-card-meta">Mã phiếu: {item.madk}</div>
                  <div className="xn-card-meta">{item.lydokham}</div>
                  <div className="xn-card-time">
                    {new Date(item.thoiGianGui).toLocaleString("vi-VN")}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right */}
          <div className="xn-right">
            {!selected ? (
              <div className="empty-state">
                <i className="fas fa-flask"></i>
                <p>Chọn một yêu cầu xét nghiệm từ danh sách bên trái</p>
              </div>
            ) : (
              <div className="xn-form">
                <h3 className="xn-form-title">
                  <i className="fas fa-flask" /> Nhập kết quả xét nghiệm
                </h3>

                <div className="xn-info-box">
                  <div><strong>Bệnh nhân:</strong> {selected.hoten}</div>
                  <div><strong>Mã phiếu:</strong> {selected.madk}</div>
                  <div><strong>Lý do khám:</strong> {selected.lydokham}</div>
                  <div><strong>Bác sĩ:</strong> {selected.tenbs ?? "—"}</div>
                </div>

                <div className="form-group">
                  <label>Kết quả xét nghiệm <span style={{color:"red"}}>*</span></label>
                  <textarea
                    rows={5}
                    placeholder="Nhập kết quả xét nghiệm..."
                    value={ketqua}
                    onChange={(e) => setKetqua(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Ghi chú</label>
                  <textarea
                    rows={3}
                    placeholder="Ghi chú thêm (nếu có)..."
                    value={ghichu}
                    onChange={(e) => setGhichu(e.target.value)}
                  />
                </div>

                <div className="xn-form-footer">
                  <button className="btn-cancel" onClick={() => setSelected(null)}>Huỷ</button>
                  <button className="btn-save" onClick={handleHoanThanh}>
                    <i className="fas fa-check" style={{ marginRight: "0.4rem" }} />
                    Hoàn thành xét nghiệm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}