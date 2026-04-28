import "../login/loginPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// cấu hình axios (chỉ cần 1 lần)
axios.defaults.withCredentials = true;

function LoginPage() {
  const [values, setValues] = useState({
    tendn: "",
    matkhau: "",
  });

  const navigate = useNavigate();

  // xử lý nhập input
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  // xử lý login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/login", values);

      // 1. IN RA CONSOLE ĐỂ XEM ĐÚNG CẤU TRÚC BACKEND TRẢ VỀ
      console.log("Dữ liệu Backend trả về:", res.data);

      if (res.data.Status === "Success") {
        // 2. LẤY ROLE (Hãy chỉnh lại dòng này nếu console.log ở trên báo cấu trúc khác)
        // Ví dụ: Nếu console log ra { Status: 'Success', user: { vaitro: 'duocsi' } }
        // Thì bạn phải đổi thành: const userRole = res.data.user.vaitro;
        const userRole = res.data.vaitro; 

        // 3. CHẶN LỖI NẾU KHÔNG LẤY ĐƯỢC ROLE
        if (!userRole) {
          alert("Hệ thống đăng nhập thành công nhưng không tìm thấy quyền (vaitro) từ server gửi về!");
          return;
        }

        // Xóa quyền cũ đi cho chắc chắn trước khi lưu quyền mới
        localStorage.removeItem("vaitro");
        
        // Lưu quyền mới vào dạng chữ thường và xóa khoảng trắng
        localStorage.setItem("vaitro", userRole.trim().toLowerCase());

        alert("Đăng nhập thành công với quyền: " + userRole);
        
        // 4. ÉP TẢI LẠI TRANG ĐỂ RESET TOÀN BỘ COMPONENT
        // Thay vì dùng navigate("/") có thể giữ lại state cũ, ta ép tải lại trang luôn
        window.location.href = "/thuoc"; 
      } else {
        alert(res.data.Error || "Tài khoản hoặc mật khẩu không đúng");
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi đăng nhập");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="tendn"
            placeholder="Tên đăng nhập"
            value={values.tendn}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="matkhau"
            placeholder="Mật khẩu"
            value={values.matkhau}
            onChange={handleChange}
            required
          />

          <button type="submit">Đăng nhập</button>
        </form>

        <p className="signup-text">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;