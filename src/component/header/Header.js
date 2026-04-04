import { useEffect, useState } from "react";
import "./Header.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Header = () => {
  const [name, setName]=useState('');
  const [auth,setAuth]=useState(false);
  const[makh,setMakh]=useState('');
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios.get('http://localhost:4000/logout')
      .then(() => window.location.reload(true))
      .catch(err => console.log(err));
  };
  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.get('http://localhost:4000/auth');
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
          setMakh(res.data.makh); // Lưu mã khách hàng
        } else {
          setAuth(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkToken();
  }, []);

  return (
    <div className="header">
      <div className="header-left">
        <input type="text" placeholder="Tìm kiếm..." className="search-input" />
      </div>

       <div className="d-flex align-items-center gap-3">
          {auth ? (
            <>
              <span className="text-white">Xin chào, {name}</span>
              <button className="btn btn-danger" onClick={handleLogout}>Đăng Xuất</button>
            </>
          ) : (
            <Link to="/login" className="text-white">
              Dang nhap
            </Link>
          )}
          
        </div>
    </div>
  );
};

export default Header;
