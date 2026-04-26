import { useEffect, useState } from "react";
import "./Header.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Header = () => {
  const [name, setName] = useState("");
  const [auth, setAuth] = useState(false);
  const [makh, setMakh] = useState("");
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    localStorage.removeItem("vaitro");
    axios
      .get("http://localhost:4000/logout")
      .then(() => window.location.reload(true))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.get("http://localhost:4000/auth");
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
          setMakh(res.data.makh);

          // 👉 CẬP NHẬT LẠI ROLE TỪ SERVER ĐỂ ĐẢM BẢO CHÍNH XÁC
          if (res.data.vaitro) {
            localStorage.setItem("vaitro", res.data.vaitro);
          }
        } else {
          setAuth(false);
          localStorage.removeItem("vaitro"); // Xóa nếu auth thất bại
        }
      } catch (error) {
        console.log(error);
        setAuth(false);
      }
    };
    checkToken();
  }, []);

  return (
    <div className="header">
      {/* 1. Phần bên trái giờ để trống hoặc có thể thêm Breadcrumb/Tiêu đề trang sau này */}
      <div className="header-left">
        {/* Đã xóa thanh tìm kiếm cũ ở đây để dời xuống từng trang cụ thể */}
      </div>

      {/* 2. Phần thông tin người dùng giữ nguyên */}
      <div className="d-flex align-items-center gap-3">
        {auth ? (
          <>
            <span className="text-white">Xin chào, {name}</span>
            <button className="btn btn-danger" onClick={handleLogout}>
              Đăng Xuất
            </button>
          </>
        ) : (
          <Link to="/login" className="text-white">
            Đăng nhập
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
