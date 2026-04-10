import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./homePage.css";

export default function HomePage() {
  // LẤY VAI TRÒ TỪ LOCALSTORAGE
  const userRole = localStorage.getItem("userRole");

  // Hàm để đổi tiêu đề dựa trên vai trò
  const renderTitle = () => {
    switch (userRole) {
      case "admin":
        return "Bảng điều khiển Giám đốc";
      case "bacsi":
        return "Giao diện làm việc Bác sĩ";
      case "tieptan":
        return "Hệ thống Tiếp tân & Đăng ký";
      case "duocsi":
        return "Quản lý Cấp phát thuốc";
      case "ktv":
        return "Khu vực Xét nghiệm";
      case "thungan":
        return "Quản lý Thu ngân";
      default:
        return "Hệ thống Quản lý ClinicFlow";
    }
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          {/* Tiêu đề tự động thay đổi */}
          <h1 className="home-title">{renderTitle()}</h1>

          {/* CHỈ HIỆN 4 THẺ THỐNG KÊ NẾU LÀ ADMIN */}
          {userRole === "admin" && (
            <div className="stat-cards">
              <div className="stat-card blue">
                <div className="stat-label">Bệnh nhân hôm nay</div>
                <div className="stat-number">0</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-label">Đang chờ khám</div>
                <div className="stat-number">0</div>
              </div>
              <div className="stat-card green">
                <div className="stat-label">Doanh thu (VNĐ)</div>
                <div className="stat-number">0</div>
              </div>
              <div className="stat-card purple">
                <div className="stat-label">Bác sĩ trực</div>
                <div className="stat-number">0</div>
              </div>
            </div>
          )}

          {/* PHÂN QUYỀN HIỂN THỊ BẢNG DỮ LIỆU */}
          {userRole === "admin" || userRole === "tieptan" ? (
            <div className="table-container">
              <div
                className="table-toolbar"
                style={{ justifyContent: "space-between" }}
              >
                <h2 style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                  Danh sách hàng đợi hiện tại
                </h2>
                <button className="btn-primary">
                  <i className="fas fa-plus"></i> Đăng ký khám mới
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã Đăng ký</th>
                      <th>Họ Tên Bệnh Nhân</th>
                      <th>Bác sĩ phụ trách</th>
                      <th>Giờ đến</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: "right" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: "2rem",
                          color: "#9ca3af",
                        }}
                      >
                        Chưa có dữ liệu bệnh nhân hôm nay
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* HIỂN THỊ LỜI CHÀO CHO BÁC SĨ, DƯỢC SĨ, KTV... */
            <div
              style={{
                textAlign: "center",
                marginTop: "50px",
                padding: "40px",
                background: "#fff",
                borderRadius: "8px",
              }}
            >
              <i
                className="fas fa-user-circle"
                style={{
                  fontSize: "60px",
                  color: "#007bff",
                  marginBottom: "20px",
                }}
              ></i>
              <h2>Chào mừng bạn quay lại làm việc!</h2>
              <p>
                Vui lòng sử dụng menu bên trái để truy cập các chức năng chuyên
                môn.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
