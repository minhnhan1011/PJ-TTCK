const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

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
app.get("/logout", function (req, res) {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});
app.post("/register", (req, res) => {
  const { hoten, tendn, matkhau, xacnhanmatkhau, email, sdt } = req.body;

  // --- Validation cơ bản ---
  if (!hoten || !tendn || !matkhau || !xacnhanmatkhau) {
    return res.json({
      Status: "error",
      Message: "Vui lòng điền đầy đủ thông tin bắt buộc.",
    });
  }

  if (matkhau !== xacnhanmatkhau) {
    return res.json({
      Status: "error",
      Message: "Mật khẩu xác nhận không khớp.",
    });
  }

  if (matkhau.length < 6) {
    return res.json({
      Status: "error",
      Message: "Mật khẩu phải có ít nhất 6 ký tự.",
    });
  }

  // --- Kiểm tra tên đăng nhập đã tồn tại chưa ---
  const checkSql = "SELECT matk FROM taikhoan WHERE tendn = ?";
  db.query(checkSql, [tendn], (err, result) => {
    if (err) {
      console.error("Lỗi kiểm tra tên đăng nhập:", err);
      return res.json({ Status: "error", Message: "Lỗi server." });
    }

    if (result.length > 0) {
      return res.json({
        Status: "error",
        Message: "Tên đăng nhập đã tồn tại.",
      });
    }

    // --- Hash mật khẩu trước khi lưu ---
    bcrypt.hash(matkhau, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error("Lỗi hash mật khẩu:", hashErr);
        return res.json({ Status: "error", Message: "Lỗi server." });
      }

      // --- Insert vào bảng taikhoan ---
      // vaitro mặc định = 'user' (hoặc để admin tự gán sau)
      const insertSql = `
        INSERT INTO taikhoan (tendn, matkhau, vaitro, hoten, email, sdt)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [
        tendn,
        hashedPassword,
        "user",
        hoten,
        email || null,
        sdt || null,
      ];

      db.query(insertSql, values, (insertErr, data) => {
        if (insertErr) {
          console.error("Lỗi đăng ký:", insertErr);
          return res.json({ Status: "error", Message: "Đăng ký thất bại." });
        }

        return res.json({
          Status: "success",
          Message: "Đăng ký tài khoản thành công!",
          matk: data.insertId,
        });
      });
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM taikhoan WHERE tendn = ?";
  db.query(sql, [req.body.tendn, req.body.matkhau], (err, data) => {
    if (err)
      return res.json({ Status: "Error", Error: "Lỗi truy vấn dữ liệu" });

    if (data.length > 0) {
      const name = data[0].tendn;
      const matk = data[0].matk;
      const vaitro = data[0].vaitro;

      const token = jwt.sign({ name, matk, vaitro }, "jwt-secret-key", {
        expiresIn: "1d",
      });

      res.cookie("token", token);
      return res.json({
        Status: "Success",
        vaitro: vaitro,
      });
    } else {
      return res.json({
        Status: "not Success",
        Error: "Sai tài khoản hoặc mật khẩu",
      });
    }
  });
});

app.get("/phieuthu", (req, res) => {
  const sql = `
    SELECT pt.mapt, pt.mapk, pt.manv, pt.tongtien, pt.ngaythu, pt.trangthai, pt.ghichu, bn.hoten 
    FROM phieuthu pt
    LEFT JOIN benhnhan bn ON pt.mapk = bn.mabn
    ORDER BY pt.ngaythu DESC
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

// Lấy 1 phiếu thu theo mapt
app.get("/phieuthu/:mapt", (req, res) => {
  const sql = `
    SELECT pt.*, bn.hoten 
    FROM phieuthu pt
    LEFT JOIN benhnhan bn ON pt.mapk = bn.mabn
    WHERE pt.mapt = ?
  `;
  db.query(sql, [req.params.mapt], (err, data) => {
    if (err) return res.json(err);
    return res.json(data[0]);
  });
});

// Tạo phiếu thu mới
app.post("/themphieuthu", (req, res) => {
  const { mapt, mapk, manv, tongtien, ghichu, trangthai } = req.body;

  const sql = `
    INSERT INTO phieuthu (mapt, mapk, manv, tongtien, ngaythu, trangthai, ghichu)
    VALUES (?, ?, ?, ?, NOW(), ?, ?)
  `;
  const values = [
    mapt,
    mapk,
    manv,
    tongtien,
    trangthai || "Da thanh toan",
    ghichu,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Lỗi SQL:", err);
      return res.status(500).json({ message: "Lỗi lưu database", error: err });
    }
    res.json({ message: "Thành công", data });
  });
});

// Cập nhật trạng thái phiếu thu
app.post("/updatephieuthu/:mapt", (req, res) => {
  const sql = `
    UPDATE phieuthu SET trangthai=?, tongtien=?, ghichu=? WHERE mapt=?
  `;
  const values = [
    req.body.trangthai,
    req.body.tongtien,
    req.body.ghichu,
    req.params.mapt,
  ];
  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
// Hủy phiếu thu
app.post("/huyphieuthu/:mapt", (req, res) => {
  const sql = `UPDATE phieuthu SET trangthai='Da huy' WHERE mapt=?`;
  db.query(sql, [req.params.mapt], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Xóa phiếu thu
app.get("/xoaphieuthu/:mapt", (req, res) => {
  const sql = `DELETE FROM phieuthu WHERE mapt=?`;
  db.query(sql, [req.params.mapt], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Thống kê hôm nay
app.get("/thongke/homay", (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS tongHoaDon,
      SUM(CASE WHEN trangthai='Da thanh toan' THEN tongtien ELSE 0 END) AS doanhThu,
      SUM(CASE WHEN trangthai='Cho thanh toan' THEN 1 ELSE 0 END) AS choThanhToan,
      SUM(CASE WHEN trangthai='Da thanh toan' THEN 1 ELSE 0 END) AS daThanhToan
    FROM phieuthu
    WHERE DATE(ngaythu) = CURDATE()
  `;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data[0]);
  });
});
// Lấy danh sách phiếu khám để làm thanh toán
app.get("/phieukham", (req, res) => {
  // Đảm bảo lấy đúng mapk từ bảng phieukham
  // Đảm bảo dùng INNER JOIN để loại bỏ các bản ghi chưa có phiếu khám thực sự
  const sql = `
    SELECT pk.mapk, bn.hoten 
    FROM phieukham pk
    INNER JOIN dangkykham dk ON pk.madk = dk.madk
    INNER JOIN benhnhan bn ON dk.mabn = bn.mabn
    WHERE pk.mapk NOT IN (SELECT mapk FROM phieuthu WHERE trangthai != 'Da huy')
`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    // Nếu data trả về có mapk rỗng, lỗi nằm ở dữ liệu bảng phieukham
    res.json(data);
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
// sua benh nhan
app.post("/updatebn/:id", (req, res) => {
  const sql =
    "UPDATE benhnhan set hoten=?,ngaysinh=?,gioitinh=?,diachi=?,sdt=? where mabn=?";
  const id = [
    req.body.hoten,
    req.body.ngaysinh,
    req.body.gioitinh,
    req.body.diachi,
    req.body.sdt,
    req.body.mabn,
  ];
  db.query(sql, id, (err, data) => {
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
    dk.manv, dk.mabn,
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
  `;
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
  const sql = `SELECT lt.*, COUNT(t.mat) AS so_thuoc FROM loaithuoc lt LEFT JOIN thuoc t ON lt.malt = t.malt GROUP BY lt.malt ORDER BY lt.malt DESC`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(data);
  });
});

app.post("/api/loai-thuoc", verifyUser, (req, res) => {
  const { tenlt } = req.body;
  if (!tenlt)
    return res.status(400).json({ message: "Tên loại thuốc là bắt buộc" });
  db.query("INSERT INTO loaithuoc (tenlt) VALUES (?)", [tenlt], (err, r) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ Status: "Success", malt: r.insertId });
  });
});

app.put("/api/loai-thuoc/:id", verifyUser, (req, res) => {
  const { tenlt } = req.body;
  if (!tenlt)
    return res.status(400).json({ message: "Tên loại thuốc là bắt buộc" });
  db.query(
    "UPDATE loaithuoc SET tenlt=? WHERE malt=?",
    [tenlt, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ Status: "Success" });
    },
  );
});

app.delete("/api/loai-thuoc/:id", verifyUser, (req, res) => {
  db.query(
    "SELECT COUNT(*) AS cnt FROM thuoc WHERE malt=?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      if (rows[0].cnt > 0)
        return res
          .status(400)
          .json({ message: "Không thể xóa — đang có thuốc thuộc loại này" });
      db.query(
        "DELETE FROM loaithuoc WHERE malt=?",
        [req.params.id],
        (err2) => {
          if (err2) return res.status(500).json({ message: err2.message });
          res.json({ Status: "Success" });
        },
      );
    },
  );
});

// ===== ĐƠN THUỐC (CRUD + tính tiền) — dùng bảng donthuoc + chitiet_donthuoc =====
app.get("/api/don-thuoc", verifyUser, (req, res) => {
  const sql = `
    SELECT ct.mact, dt.madt, dt.mapk, ct.mat, ct.soluong, ct.lieudung,
           t.tent, t.dongia, t.donvi, lt.malt, lt.tenlt,
           bn.hoten AS tenbn
    FROM chitiet_donthuoc ct
    JOIN donthuoc dt ON ct.madt = dt.madt
    LEFT JOIN thuoc t ON ct.mat = t.mat
    LEFT JOIN loaithuoc lt ON t.malt = lt.malt
    LEFT JOIN phieukham pk ON dt.mapk = pk.mapk
    LEFT JOIN dangkykham dkk ON pk.madk = dkk.madk
    LEFT JOIN benhnhan bn ON dkk.mabn = bn.mabn
    ORDER BY dt.madt DESC, ct.mact ASC`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(data);
  });
});

app.post("/api/don-thuoc", verifyUser, (req, res) => {
  const { mapk, items } = req.body;
  if (!mapk || !Array.isArray(items) || items.length === 0)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  const validItems = items.filter((i) => i.mat && i.soluong > 0);
  if (validItems.length === 0)
    return res.status(400).json({ message: "Không có thuốc hợp lệ" });
  // Kiểm tra đã có đơn thuốc cho PK này chưa
  db.query("SELECT madt FROM donthuoc WHERE mapk=?", [mapk], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    const insertDetails = (madt) => {
      const values = validItems.map((i) => [madt, i.mat, i.soluong, i.lieudung || ""]);
      db.query("INSERT INTO chitiet_donthuoc (madt, mat, soluong, lieudung) VALUES ?", [values], (err2) => {
        if (err2) return res.status(500).json({ message: err2.message });
        res.json({ Status: "Success" });
      });
    };
    if (rows.length > 0) {
      insertDetails(rows[0].madt);
    } else {
      db.query("INSERT INTO donthuoc (mapk) VALUES (?)", [mapk], (err2, r) => {
        if (err2) return res.status(500).json({ message: err2.message });
        insertDetails(r.insertId);
      });
    }
  });
});

app.put("/api/don-thuoc/:id", verifyUser, (req, res) => {
  const { mat, soluong, lieudung } = req.body;
  if (!mat || !soluong)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  db.query(
    "UPDATE chitiet_donthuoc SET mat=?, soluong=?, lieudung=? WHERE mact=?",
    [mat, soluong, lieudung, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ Status: "Success" });
    },
  );
});

app.delete("/api/don-thuoc/:id", verifyUser, (req, res) => {
  db.query("DELETE FROM chitiet_donthuoc WHERE mact=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ Status: "Success" });
  });
});

app.get("/api/don-thuoc/tong-tien/:mapk", verifyUser, (req, res) => {
  const sql = `SELECT COALESCE(SUM(ct.soluong * t.dongia),0) AS tongtien
    FROM chitiet_donthuoc ct
    JOIN donthuoc dt ON ct.madt = dt.madt
    LEFT JOIN thuoc t ON ct.mat = t.mat
    WHERE dt.mapk = ?`;
  db.query(sql, [req.params.mapk], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ tongtien: rows[0].tongtien });
  });
});

// Lấy thuốc theo loại (phục vụ cascading select khi kê đơn)
app.get("/api/thuoc-theo-loai/:malt", verifyUser, (req, res) => {
  db.query("SELECT * FROM thuoc WHERE malt=? AND trangthai='Con han' ORDER BY tent", [req.params.malt], (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
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
// Cấu hình lưu trữ hình ảnh xét nghiệm
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Đảm bảo bạn đã tạo thư mục này
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// API Hoàn thành xét nghiệm
app.post("/api/hoan-thanh-xet-nghiem", upload.single("hinhanh"), (req, res) => {
  const { madk, ketqua, ghichu } = req.body;
  const hinhanh = req.file ? req.file.filename : null;

  // 1. Cập nhật trạng thái trong bảng dangkykham thành 'Da xet nghiem'
  // 2. Lưu kết quả vào bảng kết quả (giả sử là bảng ketquaxetnghiem)
  const sqlUpdate =
    "UPDATE dangkykham SET trangthai = 'Da xet nghiem' WHERE madk = ?";

  db.query(sqlUpdate, [madk], (err, result) => {
    if (err)
      return res.status(500).json({ Status: "Error", Error: err.message });

    // Trả về thông tin để Frontend in
    return res.json({
      Status: "Success",
      hinhanh: hinhanh,
    });
  });
});

// Serve file tĩnh để hiển thị ảnh trên PDF
app.use("/uploads", express.static("public/uploads"));

// API để Bác sĩ lưu kết quả khám và tạo Phiếu Khám (phieukham)
app.post("/api/hoan-thanh-kham", (req, res) => {
  const { madk, manv, chuandoan } = req.body;

  // 1. Tạo bản ghi trong bảng phieukham
  const sqlPhieuKham = `
    INSERT INTO phieukham (madk, manv, chuandoan, ngaykham) 
    VALUES (?, ?, ?, NOW())
  `;

  db.query(sqlPhieuKham, [madk, manv, chuandoan], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Lỗi tạo phiếu khám", error: err });

    const mapk = result.insertId; // Lấy mã phiếu khám vừa tạo tự động

    // 2. Cập nhật trạng thái bên bảng dangkykham thành 'Hoan thanh'
    const sqlUpdateDK =
      "UPDATE dangkykham SET trangthai = 'Hoan thanh' WHERE madk = ?";
    db.query(sqlUpdateDK, [madk], (err2) => {
      if (err2)
        return res
          .status(500)
          .json({ message: "Lỗi cập nhật trạng thái", error: err2 });

      res.json({
        Status: "Success",
        message: "Đã tạo phiếu khám thành công",
        mapk: mapk,
      });
    });
  });
});
