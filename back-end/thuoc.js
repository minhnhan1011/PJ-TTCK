module.exports = (db) => {
    const express = require("express");
    const router = express.Router();

    // Lấy danh sách thuốc (JOIN để lấy tên loại thuốc tenlt)
    router.get("/", (req, res) => {
        const sql = `
            SELECT t.*, lt.tenlt 
            FROM thuoc t 
            LEFT JOIN loaithuoc lt ON t.malt = lt.malt 
            ORDER BY t.mat DESC
        `;
        db.query(sql, (err, data) => {
            if (err) return res.status(500).json(err);
            res.json(data);
        });
    });

    // Thêm thuốc mới (Khớp 100% với các cột của Trúc)
    router.post("/", (req, res) => {
        const { tent, malt, dongia, ngaysanxuat, hansudung, soluong, donvi } = req.body;
        const sql = `
            INSERT INTO thuoc (tent, malt, dongia, ngaysanxuat, hansudung, soluong, donvi, trangthai) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Con han')
        `;
        db.query(sql, [tent, malt, dongia, ngaysanxuat, hansudung, soluong, donvi], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ Status: "Success" });
        });
    });

    // Cập nhật thuốc (Nút Sửa - Phải có soluong và donvi ở đây)
    router.put("/:id", (req, res) => {
        const id = req.params.id;
        const { tent, malt, dongia, ngaysanxuat, hansudung, soluong, donvi } = req.body;
        const sql = `
            UPDATE thuoc 
            SET tent=?, malt=?, dongia=?, ngaysanxuat=?, hansudung=?, soluong=?, donvi=? 
            WHERE mat=?
        `;
        db.query(sql, [tent, malt, dongia, ngaysanxuat, hansudung, soluong, donvi, id], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ Status: "Success" });
        });
    });

    // Xóa thuốc
    router.delete("/:id", (req, res) => {
        db.query("DELETE FROM thuoc WHERE mat = ?", [req.params.id], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ Status: "Success" });
        });
    });

    return router;
};