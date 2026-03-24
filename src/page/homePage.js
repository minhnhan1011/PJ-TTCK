import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./homePage.css";

export default function HomePage() {
  return (
    <div className="home-page bg-gray-50 flex min-h-screen text-gray-800 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <h1 className="home-title">Bảng điều khiển Giám đốc</h1>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="card-stat border-l-blue-500">
              <div className="stat-title">Bệnh nhân hôm nay</div>
              <div className="stat-value">42</div>
              <div className="stat-subtext">+8% so với hôm qua</div>
            </div>
            <div className="card-stat border-l-orange-500">
              <div className="stat-title">Đang chờ khám</div>
              <div className="stat-value">08</div>
              <div className="stat-subtext">Trung bình đợi: 14 phút</div>
            </div>
            <div className="card-stat border-l-green-500">
              <div className="stat-title">Doanh thu (VNĐ)</div>
              <div className="stat-value">12.4M</div>
              <div className="stat-subtext">Vượt mục tiêu</div>
            </div>
            <div className="card-stat border-l-purple-500">
              <div className="stat-title">Bác sĩ trực</div>
              <div className="stat-value">04</div>
              <div className="stat-subtext">Trên tổng số 12 bác sĩ</div>
            </div>
          </div>

          <div className="queue-card">
            <div className="queue-header">
              <h2>Danh sách hàng đợi hiện tại</h2>
              <button className="register-btn" onClick={() => window.alert("Chức năng đăng ký khám mới (demo)")}>Đăng ký khám mới</button>
            </div>
            <div className="overflow-x-auto">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Mã Đăng ký</th>
                    <th>Họ Tên Bệnh Nhân</th>
                    <th>Bác sĩ phụ trách</th>
                    <th>Giờ đến</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>DK-0158</td>
                    <td>Nguyễn Văn An</td>
                    <td>BS. Trần Hoài Nam</td>
                    <td>08:15 AM</td>
                    <td><span className="badge badge-warning">Đang chờ</span></td>
                    <td><button className="action-btn">Sửa</button></td>
                  </tr>
                  <tr>
                    <td>DK-0159</td>
                    <td>Trần Thị Bích</td>
                    <td>BS. Lê Minh Tâm</td>
                    <td>08:30 AM</td>
                    <td><span className="badge badge-success">Đang khám</span></td>
                    <td><button className="action-btn">Sửa</button></td>
                  </tr>
                  <tr>
                    <td>DK-0160</td>
                    <td>Phạm Hồng Nhung</td>
                    <td>-</td>
                    <td>08:45 AM</td>
                    <td><span className="badge badge-neutral">Đã tiếp nhận</span></td>
                    <td><button className="action-btn">Sửa</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
