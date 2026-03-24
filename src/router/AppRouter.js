import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../page/homePage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;