module.exports = (db) => {
    const express = require("express");
    const router = express.Router();
    const jwt = require("jsonwebtoken");

    // Middleware kiểm tra đăng nhập (copy từ index.js sang cho đồng bộ)
    const verifyUser = (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ Message: "Bạn chưa đăng nhập" });
        } else {
            jwt.verify(token, "jwt-secret-key", (err, decoded) => {
                if (err) return res.json({ Message: "Token không hợp lệ" });
                next();
            });
        }
    };

    // 1. Lấy toàn bộ danh sách nhân viên (Có bảo vệ)
    router.get("/", verifyUser, (req, res) => {
        db.query("SELECT * FROM nhanvien ORDER BY manv DESC", (err, data) => {
            if (err) return res.status(500).json(err);
            res.json(data);
        });
    });

    // 2. Thêm nhân viên mới (Có ràng buộc dữ liệu)
    router.post("/", verifyUser, (req, res) => {
        const { hoten, chucvu, sdt, diachi } = req.body;
        
        if (!hoten || !chucvu) {
            return res.status(400).json({ Message: "Họ tên và chức vụ là bắt buộc" });
        }

        const sql = "INSERT INTO nhanvien (hoten, chucvu, sdt, diachi) VALUES (?, ?, ?, ?)";
        db.query(sql, [hoten, chucvu, sdt, diachi], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ Status: "Success", id: result.insertId });
        });
    });

    // 3. Cập nhật nhân viên (Dành cho nút Sửa)
    router.put("/:id", verifyUser, (req, res) => {
        const { hoten, chucvu, sdt, diachi } = req.body;
        const id = req.params.id;

        const sql = "UPDATE nhanvien SET hoten = ?, chucvu = ?, sdt = ?, diachi = ? WHERE manv = ?";
        db.query(sql, [hoten, chucvu, sdt, diachi, id], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ Status: "Success" });
        });
    });

    // 4. Xóa nhân viên
    router.delete("/:id", verifyUser, (req, res) => {
        const id = req.params.id;
        db.query("DELETE FROM nhanvien WHERE manv = ?", [id], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ Status: "Success" });
        });
    });

    return router;
};