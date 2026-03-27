import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../page/homePage";
import LoginPage from "../page/login/loginPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;