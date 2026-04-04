import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import Loading from "../component/loading/Loading";
import { toast } from "react-toastify";
import "./XetNghiemPage.css";

export default function XetNghiemPage() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: const res = await apiGet("/xet-nghiem");
        toast.info("Sẵn sàng kết nối API Xét nghiệm");
      } catch {
        toast.error("Lỗi tải yêu cầu xét nghiệm!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-layout">
      {loading && <Loading text="Đang tải yêu cầu xét nghiệm..." />}
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
