const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "qlphongkham",
  charset: "utf8mb4",
});

db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối cơ sở dữ liệu:", err);
  } else {
    console.log("Kết nối cơ sở dữ liệu thành công!");
  }
});

app.get("/", (req, res) => {
  res.send("OK SERVER");
});

// MIDDLEWARE BẢO VỆ API
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Message: "Bạn chưa đăng nhập" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Message: "Token không hợp lệ" });
      } else {
        req.name = decoded.name;
        req.matk = decoded.matk;
        next();
      }
    });
  }
};

app.get("/auth", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name, matk: req.matk });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM taikhoan WHERE tendn=? AND matkhau=?";
  db.query(sql, [req.body.tendn, req.body.matkhau], (err, data) => {
    if (err) return res.json("Tài khoản hoặc mật khẩu đã sai");
    
    if (data.length > 0) {
      const name = data[0].tendn;
      const matk = data[0].matk;
      const token = jwt.sign({ name, matk }, "jwt-secret-key", { expiresIn: "1d" });
      res.cookie("token", token);
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Status: "not Success" });
    }
  });
});



app.get("/api/nhan-vien/bac-si", verifyUser, (req, res) => {
  db.query("SELECT manv, hoten FROM nhanvien WHERE chucvu = 'Bac si'", (err, data) => {
    if (err) return res.status(500).json({ message: "Lỗi truy vấn", error: err });
    res.json(data);
  });
});

app.get("/api/dang-ky-kham", verifyUser, (req, res) => {
  const sql = `
    SELECT dk.madk, dk.hoten, dk.lydokham, dk.ngaydangky, dk.trangthai,
           nv.manv, nv.hoten AS tenbs
    FROM dangkykham dk
    LEFT JOIN nhanvien nv ON dk.manv = nv.manv
    ORDER BY dk.madk DESC
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ message: "Lỗi truy vấn", error: err });
    res.json(data);
  });
});

app.post("/api/dang-ky-kham", verifyUser, (req, res) => {
  const { hoten, lydokham, manv } = req.body;
  if (!hoten || !lydokham || !manv) return res.status(400).json({ message: "Thiếu thông tin" });

  const sql = `INSERT INTO dangkykham (hoten, manv, lydokham, ngaydangky, trangthai) VALUES (?, ?, ?, NOW(), 'Cho kham')`;
  db.query(sql, [hoten, manv, lydokham], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi tạo phiếu", error: err });
    res.status(201).json({
      madk: result.insertId, hoten, lydokham, manv,
      ngaydangky: new Date().toISOString().split("T")[0],
      trangthai: "Cho kham",
    });
  });
});

app.put("/api/dang-ky-kham/:madk", verifyUser, (req, res) => {
  const { hoten, lydokham, manv } = req.body;
  const { madk } = req.params;
  db.query(
    "UPDATE dangkykham SET hoten=?, lydokham=?, manv=? WHERE madk=?",
    [hoten, lydokham, manv, madk],
    (err) => {
      if (err) return res.status(500).json({ message: "Lỗi cập nhật", error: err });
      res.json({ message: "Cập nhật thành công" });
    }
  );
});

app.delete("/api/dang-ky-kham/:madk", verifyUser, (req, res) => {
  db.query("DELETE FROM dangkykham WHERE madk=?", [req.params.madk], (err) => {
    if (err) return res.status(500).json({ message: "Lỗi xóa", error: err });
    res.json({ message: "Xóa thành công" });
  });
});


// GET danh sách loại thuốc cho dropdown
app.get("/api/loai-thuoc", verifyUser, (req, res) => {
    db.query("SELECT * FROM loaithuoc", (err, data) => {
        if (err) return res.status(500).json({ message: "Lỗi truy vấn", error: err });
        res.json(data);
    });
});

app.get("/api/thuoc", verifyUser, (req, res) => {
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

app.post("/api/thuoc", verifyUser, (req, res) => {
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

app.put("/api/thuoc/:id", verifyUser, (req, res) => {
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

app.delete("/api/thuoc/:id", verifyUser, (req, res) => {
    db.query("DELETE FROM thuoc WHERE mat = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ Status: "Success" });
    });
});




app.get("/api/nhanvien", verifyUser, (req, res) => {
    db.query("SELECT * FROM nhanvien ORDER BY manv DESC", (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

app.post("/api/nhanvien", verifyUser, (req, res) => {
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

app.put("/api/nhanvien/:id", verifyUser, (req, res) => {
    const { hoten, chucvu, sdt, diachi } = req.body;
    const id = req.params.id;
    const sql = "UPDATE nhanvien SET hoten = ?, chucvu = ?, sdt = ?, diachi = ? WHERE manv = ?";
    db.query(sql, [hoten, chucvu, sdt, diachi, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ Status: "Success" });
    });
});

app.delete("/api/nhanvien/:id", verifyUser, (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM nhanvien WHERE manv = ?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ Status: "Success" });
    });
});


app.listen(4000, () => {
  console.log("Server running on port 4000");
});