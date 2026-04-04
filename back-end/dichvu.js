const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // 1. Lấy danh sách dịch vụ
  router.get("/", (req, res) => {
    // Sắp xếp theo madv mới nhất lên đầu
    db.query("SELECT * FROM dichvu ORDER BY madv ASC", (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    });
  });

  // 2. Thêm mới dịch vụ (LỖI 500 NẰM Ở ĐÂY)
  router.post("/add", (req, res) => {
    // Phải nhận đúng tên biến 'gia' từ Frontend gửi lên
    const { tendv, gia } = req.body;

    // CỘT TRONG DB LÀ 'gia', KHÔNG PHẢI 'giadv'
    // TRẠNG THÁI LÀ CHUỖI 'Hoat dong' KHỚP VỚI HÌNH PHPADMIN
    const sql =
      "INSERT INTO dichvu (tendv, gia, trangthai) VALUES (?, ?, 'Hoat dong')";

    db.query(sql, [tendv, gia], (err, result) => {
      if (err) {
        console.error("Lỗi MySQL:", err);
        return res.status(500).json(err);
      }
      res.json({ Status: "Success" });
    });
  });

  // 3. Cập nhật dịch vụ
  router.put("/update/:id", (req, res) => {
    const { tendv, gia } = req.body;
    const id = req.params.id;

    // Sửa tên cột thành 'gia'
    const sql = "UPDATE dichvu SET tendv = ?, gia = ? WHERE madv = ?";

    db.query(sql, [tendv, gia, id], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ Status: "Success" });
    });
  });

  // 4. Xóa dịch vụ
  router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM dichvu WHERE madv = ?", [id], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ Status: "Success" });
    });
  });

  return router;
};
