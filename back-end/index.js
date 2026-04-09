const express = require("express");
const mysql = require("mysql2");
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
  }),
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
      const token = jwt.sign({ name, matk }, "jwt-secret-key", {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Status: "not Success" });
    }
  });
});

// show  benh nhan
app.get("/benhnhan", (req, res) => {
  const sql = "SELECT *FROM benhnhan";
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});
app.post("/thembn", (req, res) => {
  const sql =
    "INSERT INTO benhnhan(`mabn`,`hoten`,`ngaysinh`,`gioitinh`,`diachi`,`sdt`) VALUES(?)";
  const values = [
    req.body.mabn,
    req.body.hoten,
    req.body.ngaysinh,
    req.body.gioitinh,
    req.body.sdt,
    req.body.diachi,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.get("/api/nhan-vien/bac-si", verifyUser, (req, res) => {
  db.query(
    "SELECT manv, hoten FROM nhanvien WHERE chucvu = 'Bac si'",
    (err, data) => {
      if (err)
        return res.status(500).json({ message: "Lỗi truy vấn", error: err });
      res.json(data);
    },
  );
});

// GET danh sách đăng ký khám (JOIN lấy tên BN, tên BS)
app.get("/api/dang-ky-kham", (req, res) => {
  const sql = `
    SELECT dk.madk, dk.stt, dk.lydokham, dk.ngaydangky, dk.trangthai,
           bn.mabn, bn.hoten, bn.gioitinh, bn.ngaysinh, bn.sdt,
           nv.hoten AS tenbs
    FROM dangkykham dk
    LEFT JOIN benhnhan bn ON dk.mabn = bn.mabn
    LEFT JOIN nhanvien nv ON dk.manv = nv.manv
    ORDER BY dk.ngaydangky DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// POST tạo phiếu đăng ký mới
app.post("/api/dang-ky-kham", (req, res) => {
  const { mabn, lydokham, manv } = req.body;
  if (!mabn || !lydokham || !manv)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

  // Lấy STT tiếp theo trong ngày
  const sttSql = `
    SELECT COALESCE(MAX(stt), 0) + 1 AS stt_next
    FROM dangkykham
    WHERE DATE(ngaydangky) = CURDATE()
  `;
  db.query(sttSql, (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    const stt = rows[0].stt_next;

    const insertSql = `
      INSERT INTO dangkykham (mabn, manv, stt, lydokham, trangthai)
      VALUES (?, ?, ?, ?, 'Cho kham')
    `;
    db.query(insertSql, [mabn, manv, stt, lydokham], (err2, result) => {
      if (err2) return res.status(500).json({ message: err2.message });
      res.json({ message: "Tạo phiếu thành công", madk: result.insertId, stt });
    });
  });
});

// PUT cập nhật phiếu
app.put("/api/dang-ky-kham/:madk", (req, res) => {
  const { madk } = req.params;
  const { mabn, lydokham, manv, trangthai } = req.body; // 👈 thêm trangthai
  if (!mabn || !lydokham || !manv)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

  const sql = `
    UPDATE dangkykham SET mabn=?, lydokham=?, manv=?, trangthai=? WHERE madk=?
  `; // 👈 thêm trangthai=?
  db.query(
    sql,
    [mabn, lydokham, manv, trangthai ?? "Cho kham", madk],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Cập nhật thành công" });
    },
  );
});

// DELETE xóa phiếu
app.delete("/api/dang-ky-kham/:madk", (req, res) => {
  const { madk } = req.params;
  db.query("DELETE FROM dangkykham WHERE madk=?", [madk], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Xóa thành công" });
  });
});

// GET danh sách bác sĩ
app.get("/api/nhan-vien/bac-si", (req, res) => {
  db.query(
    "SELECT manv, hoten FROM nhanvien WHERE chucvu = 'Bac si'",
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    },
  );
});

// GET danh sách bệnh nhân
app.get("/api/benh-nhan", (req, res) => {
  db.query(
    "SELECT mabn, hoten, gioitinh, ngaysinh, sdt FROM benhnhan ORDER BY hoten",
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    },
  );
});

// ===== LOẠI THUỐC (CRUD) =====
app.get("/api/loai-thuoc", verifyUser, (req, res) => {
  db.query("SELECT * FROM loaithuoc ORDER BY malt DESC", (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(data);
  });
});

app.post("/api/loai-thuoc", verifyUser, (req, res) => {
  const { tenlt } = req.body;
  if (!tenlt) return res.status(400).json({ message: "Tên loại thuốc là bắt buộc" });
  db.query("INSERT INTO loaithuoc (tenlt) VALUES (?)", [tenlt], (err, r) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ Status: "Success", malt: r.insertId });
  });
});

app.put("/api/loai-thuoc/:id", verifyUser, (req, res) => {
  const { tenlt } = req.body;
  if (!tenlt) return res.status(400).json({ message: "Tên loại thuốc là bắt buộc" });
  db.query("UPDATE loaithuoc SET tenlt=? WHERE malt=?", [tenlt, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ Status: "Success" });
  });
});

app.delete("/api/loai-thuoc/:id", verifyUser, (req, res) => {
  db.query("SELECT COUNT(*) AS cnt FROM thuoc WHERE malt=?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    if (rows[0].cnt > 0) return res.status(400).json({ message: "Không thể xóa — đang có thuốc thuộc loại này" });
    db.query("DELETE FROM loaithuoc WHERE malt=?", [req.params.id], (err2) => {
      if (err2) return res.status(500).json({ message: err2.message });
      res.json({ Status: "Success" });
    });
  });
});

// ===== ĐƠN THUỐC (CRUD + tính tiền) =====
app.get("/api/don-thuoc", verifyUser, (req, res) => {
  const sql = `
    SELECT dt.madt, dt.mapk, dt.mat, dt.soluong, dt.lieudung,
           t.tent, t.dongia, t.donvi,
           bn.hoten AS tenbn
    FROM donthuoc dt
    LEFT JOIN thuoc t ON dt.mat = t.mat
    LEFT JOIN phieukham pk ON dt.mapk = pk.mapk
    LEFT JOIN dangkykham dkk ON pk.madk = dkk.madk
    LEFT JOIN benhnhan bn ON dkk.mabn = bn.mabn
    ORDER BY dt.madt DESC`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(data);
  });
});

app.post("/api/don-thuoc", verifyUser, (req, res) => {
  const { mapk, mat, soluong, lieudung } = req.body;
  if (!mapk || !mat || !soluong) return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  db.query("INSERT INTO donthuoc (mapk,mat,soluong,lieudung) VALUES (?,?,?,?)", [mapk, mat, soluong, lieudung], (err, r) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ Status: "Success", madt: r.insertId });
  });
});

app.put("/api/don-thuoc/:id", verifyUser, (req, res) => {
  const { mapk, mat, soluong, lieudung } = req.body;
  if (!mapk || !mat || !soluong) return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  db.query("UPDATE donthuoc SET mapk=?,mat=?,soluong=?,lieudung=? WHERE madt=?", [mapk, mat, soluong, lieudung, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ Status: "Success" });
  });
});

app.delete("/api/don-thuoc/:id", verifyUser, (req, res) => {
  db.query("DELETE FROM donthuoc WHERE madt=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ Status: "Success" });
  });
});

app.get("/api/don-thuoc/tong-tien/:mapk", verifyUser, (req, res) => {
  db.query(
    "SELECT COALESCE(SUM(dt.soluong * t.dongia),0) AS tongtien FROM donthuoc dt LEFT JOIN thuoc t ON dt.mat=t.mat WHERE dt.mapk=?",
    [req.params.mapk], (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ tongtien: rows[0].tongtien });
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
  const { tent, malt, dongia, ngaysanxuat, hansudung, soluong, donvi } =
    req.body;
  const sql = `
        INSERT INTO thuoc (tent, malt, dongia, ngaysanxuat, hansudung, soluong, donvi, trangthai) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Con han')
    `;
  db.query(
    sql,
    [tent, malt, dongia, ngaysanxuat, hansudung, soluong, donvi],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ Status: "Success" });
    },
  );
});

app.put("/api/thuoc/:id", verifyUser, (req, res) => {
  const id = req.params.id;
  const { tent, malt, dongia, ngaysanxuat, hansudung, soluong, donvi } =
    req.body;
  const sql = `
        UPDATE thuoc 
        SET tent=?, malt=?, dongia=?, ngaysanxuat=?, hansudung=?, soluong=?, donvi=? 
        WHERE mat=?
    `;
  db.query(
    sql,
    [tent, malt, dongia, ngaysanxuat, hansudung, soluong, donvi, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ Status: "Success" });
    },
  );
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
  const sql =
    "INSERT INTO nhanvien (hoten, chucvu, sdt, diachi) VALUES (?, ?, ?, ?)";
  db.query(sql, [hoten, chucvu, sdt, diachi], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ Status: "Success", id: result.insertId });
  });
});

app.put("/api/nhanvien/:id", verifyUser, (req, res) => {
  const { hoten, chucvu, sdt, diachi } = req.body;
  const id = req.params.id;
  const sql =
    "UPDATE nhanvien SET hoten = ?, chucvu = ?, sdt = ?, diachi = ? WHERE manv = ?";
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
// GET - Lấy danh sách dịch vụ
app.get("/api/dich-vu", verifyUser, (req, res) => {
  const sql = "SELECT * FROM dichvu ORDER BY madv DESC";
  db.query(sql, (err, data) => {
    if (err)
      return res.status(500).json({ message: "Lỗi truy vấn", error: err });
    res.json(data);
  });
});

// POST - Thêm dịch vụ mới
app.post("/api/dich-vu", verifyUser, (req, res) => {
  // THÊM: lấy trangthai từ body
  const { tendv, gia, trangthai } = req.body;
  // SỬA: thêm cột trangthai vào câu lệnh SQL
  const sql = "INSERT INTO dichvu (tendv, gia, trangthai) VALUES (?, ?, ?)";
  db.query(sql, [tendv, gia, trangthai], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Lỗi thêm dịch vụ", error: err });
    res.status(201).json({ madv: result.insertId, tendv, gia, trangthai });
  });
});

// PUT - Cập nhật dịch vụ
app.put("/api/dich-vu/:madv", verifyUser, (req, res) => {
  // THÊM: lấy trangthai từ body
  const { tendv, gia, trangthai } = req.body;
  const { madv } = req.params;
  // SỬA: cập nhật thêm cột trangthai
  const sql = "UPDATE dichvu SET tendv=?, gia=?, trangthai=? WHERE madv=?";
  db.query(sql, [tendv, gia, trangthai, madv], (err) => {
    if (err)
      return res.status(500).json({ message: "Lỗi cập nhật", error: err });
    res.json({ message: "Cập nhật thành công" });
  });
});

// DELETE - Xóa dịch vụ
app.delete("/api/dich-vu/:madv", verifyUser, (req, res) => {
  const { madv } = req.params;
  db.query("DELETE FROM dichvu WHERE madv=?", [madv], (err) => {
    if (err) return res.status(500).json({ message: "Lỗi xóa", error: err });
    res.json({ message: "Xóa thành công" });
  });
});
