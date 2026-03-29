import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./XetNghiemPage.css";

export default function XetNghiemPage() {
  const [ketqua, setKetqua] = useState("");
  const [fileName, setFileName] = useState("");

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content xn-content">
          {/* Left: Pending list */}
          <div className="xn-left">
            <h2 className="xn-section-title">Yêu cầu chờ xử lý (0)</h2>
            <div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af" }}>
              Chưa có yêu cầu xét nghiệm
            </div>
          </div>

          {/* Right: Result form */}
          <div className="xn-right">
            <div className="empty-state">
              <i className="fas fa-flask"></i>
              <p>Chọn một yêu cầu xét nghiệm từ danh sách bên trái</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
