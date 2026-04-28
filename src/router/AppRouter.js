import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../page/LoginPage";
import BenhNhanPage from "../page/BenhNhanPage";
import KhamBenhPage from "../page/KhamBenhPage";
import DichVuPage from "../page/DichVuPage";
import ThanhToanPage from "../page/ThanhToanPage";
import XetNghiemPage from "../page/XetNghiemPage";
import NhanVienPage from "../page/NhanVienPage";
import DangKyKhamPage from "../page/DangKyKhamPage";
import DonThuocPage from "../page/DonThuocPage";
import LoaiThuocPage from "../page/LoaiThuocPage";
import ThuocPage from "../page/ThuocPage";
import RegisterPage from "../page/RegisterPage";
import ForgotPasswordPage from "../page/ForgotPasswordPage";

function AppRouter() {
  // Lấy vai trò người dùng từ localStorage
  const userRole = localStorage.getItem("userRole");

  return (
    <BrowserRouter>
      <Routes>
        {/* ĐIỀU HƯỚNG TRANG CHỦ (/) DỰA TRÊN 5 VAI TRÒ */}
        <Route 
          path="/" 
          element={
            !userRole ? (
              <Navigate to="/login" replace />
            ) : userRole === "admin" ? (
              <Navigate to="/nhan-vien" replace />
            ) : userRole === "bacsi" ? (
              <Navigate to="/kham-benh" replace />
            ) : userRole === "ktv" ? (
              <Navigate to="/xet-nghiem" replace />
            ) : userRole === "tieptan" ? (
              <Navigate to="/benh-nhan" replace />
            ) : userRole === "duocsi" ? (
              <Navigate to="/thuoc" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* CÁC ROUTE CÔNG KHAI */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* CÁC ROUTE CHỨC NĂNG */}
        <Route path="/benh-nhan" element={<BenhNhanPage />} />
        <Route path="/kham-benh" element={<KhamBenhPage />} />
        <Route path="/dich-vu" element={<DichVuPage />} />
        <Route path="/thanh-toan" element={<ThanhToanPage />} />
        <Route path="/xet-nghiem" element={<XetNghiemPage />} />
        <Route path="/nhan-vien" element={<NhanVienPage />} />
        <Route path="/dang-ky-kham" element={<DangKyKhamPage />} />
        <Route path="/don-thuoc" element={<DonThuocPage />} />
        <Route path="/loai-thuoc" element={<LoaiThuocPage />} />
        <Route path="/thuoc" element={<ThuocPage />} />

        {/* XỬ LÝ TRANG KHÔNG TỒN TẠI */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;