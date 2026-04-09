import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../page/homePage";
import LoginPage from "../page/LoginPage";
import KioskPage from "../page/KioskPage";
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/kiosk" element={<KioskPage />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;