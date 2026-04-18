import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import { message } from "antd";
import axios from "axios";
import "./XetNghiemPage.css";

export default function XetNghiemPage() {
  const [queue, setQueue] = useState([]);
  const [selected, setSelected] = useState(null);
  const [ketqua, setKetqua] = useState("");
  const [ghichu, setGhichu] = useState("");
  const [file, setFile] = useState(null); // State lưu file hình ảnh

  // 1. Load danh sách chờ từ LocalStorage
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
    setFile(null);
  };

  // 2. Hàm xử lý IN kết quả (Xuất file PDF qua trình duyệt)
  const handlePrint = (data) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Phiếu Kết Quả Xét Nghiệm - ${data.madk}</title>
          <style>
            body { font-family: sans-serif; line-height: 1.6; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #2563eb; margin-bottom: 20px; padding-bottom: 10px; }
            .hospital-name { font-size: 24px; font-weight: bold; color: #2563eb; }
            .info-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .result-box { border: 1px solid #ddd; padding: 20px; background: #fefefe; min-height: 150px; margin-top: 10px; }
            .footer { margin-top: 50px; text-align: right; }
            .signature { margin-top: 60px; font-weight: bold; }
            img { max-width: 100%; height: auto; margin-top: 20px; border: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="hospital-name">PHÒNG KHÁM ĐA KHOA STU</div>
            <p>Địa chỉ: 123 Nguyễn Văn Linh, Q7, TP.HCM</p>
            <h1>PHIẾU KẾT QUẢ XÉT NGHIỆM</h1>
          </div>
          
          <div class="info-section">
            <div>
              <p><strong>Bệnh nhân:</strong> ${data.hoten}</p>
              <p><strong>Mã đăng ký:</strong> ${data.madk}</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Ngày thực hiện:</strong> ${new Date().toLocaleString("vi-VN")}</p>
              <p><strong>Bác sĩ chỉ định:</strong> ${data.tenbs || "—"}</p>
            </div>
          </div>

          <hr />
          <h3>CHI TIẾT KẾT QUẢ:</h3>
          <div class="result-box">${data.ketqua.replace(/\n/g, "<br/>")}</div>
          
          ${data.ghichu ? `<p><strong>Ghi chú:</strong> ${data.ghichu}</p>` : ""}
          
          ${data.img ? `<div><p><strong>Hình ảnh minh chứng:</strong></p><img src="http://localhost:4000/uploads/${data.img}"/></div>` : ""}

          <div class="footer">
            <p>TP. Hồ Chí Minh, Ngày .... tháng .... năm ....</p>
            <div class="signature">KỸ THUẬT VIÊN XÉT NGHIỆM</div>
            <p>(Ký và ghi rõ họ tên)</p>
          </div>

          <script>
            window.onload = function() { 
              window.print(); 
              // window.close(); // Mở dòng này nếu muốn đóng tab sau khi in xong
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // 3. Hàm xử lý Hoàn thành (Gửi API + In)
  const handleHoanThanh = async () => {
    if (!ketqua.trim()) {
      message.warning("Vui lòng nhập kết quả xét nghiệm!");
      return;
    }

    const formData = new FormData();
    formData.append("madk", selected.madk);
    formData.append("ketqua", ketqua);
    formData.append("ghichu", ghichu);
    if (file) formData.append("hinhanh", file);

    try {
      // Gọi API lưu vào Database
      const res = await axios.post(
        "http://localhost:4000/api/hoan-thanh-xet-nghiem",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      if (res.data.Status === "Success") {
        // Thực hiện lệnh IN ngay khi lưu thành công
        handlePrint({
          hoten: selected.hoten,
          madk: selected.madk,
          ketqua: ketqua,
          ghichu: ghichu,
          tenbs: selected.tenbs,
          img: res.data.hinhanh, // Tên file ảnh từ server trả về
        });

        // Cập nhật LocalStorage: Xoá bệnh nhân đã làm xong khỏi hàng đợi
        const newQueue = queue.filter((x) => x.madk !== selected.madk);
        localStorage.setItem("xetnghiem_queue", JSON.stringify(newQueue));

        setQueue(newQueue);
        setSelected(null);
        message.success("Đã lưu vào hệ thống và đang xuất file in!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Lỗi khi kết nối đến máy chủ!");
    }
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content xn-content">
          {/* Cột trái: Danh sách chờ */}
          <div className="xn-left">
            <h2 className="xn-section-title">
              Yêu cầu chờ xử lý ({queue.length})
            </h2>
            {queue.length === 0 ? (
              <div className="empty-queue">Chưa có yêu cầu xét nghiệm</div>
            ) : (
              queue.map((item) => (
                <div
                  key={item.madk}
                  className={`xn-card ${selected?.madk === item.madk ? "xn-card-active" : ""}`}
                  onClick={() => handleChon(item)}
                >
                  <div className="xn-card-name">{item.hoten}</div>
                  <div className="xn-card-meta">Mã: {item.madk}</div>
                  <div className="xn-card-meta">{item.tendv}</div>
                </div>
              ))
            )}
          </div>

          {/* Cột phải: Form nhập kết quả */}
          <div className="xn-right">
            {!selected ? (
              <div className="empty-state">
                Chọn một yêu cầu để nhập kết quả
              </div>
            ) : (
              <div className="xn-form">
                <h3 className="xn-form-title">
                  Kết quả xét nghiệm: {selected.hoten}
                </h3>

                <div className="form-group">
                  <label>
                    Kết quả chi tiết <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={ketqua}
                    onChange={(e) => setKetqua(e.target.value)}
                    placeholder="Nhập chỉ số xét nghiệm, kết luận..."
                  />
                </div>

                <div className="form-group">
                  <label>Ghi chú</label>
                  <textarea
                    rows={2}
                    value={ghichu}
                    onChange={(e) => setGhichu(e.target.value)}
                  />
                </div>

                <div className="xn-form-footer">
                  <button
                    className="btn-cancel"
                    onClick={() => setSelected(null)}
                  >
                    Huỷ
                  </button>
                  <button className="btn-save" onClick={handleHoanThanh}>
                    Hoàn thành & In kết quả
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
