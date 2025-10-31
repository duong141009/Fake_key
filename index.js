import express from "express";

const app = express();
app.use(express.json());

// ✅ Test GET (khi mở bằng trình duyệt)
app.get("/apk/check_key.php", (req, res) => {
  res.send("Server hoạt động — hãy dùng POST để kiểm tra key.");
});

// ✅ Endpoint chính mà app gọi bằng POST
app.post("/apk/check_key.php", (req, res) => {
  const { key, device_id } = req.body;

  console.log("📩 Key nhận được:", key);
  console.log("📱 Device ID:", device_id);

  // --- LOGIC XÁC THỰC KEY ---
  // Bạn có thể thay điều kiện ở đây
  if (key === "YOUR_SECRET_KEY_123") {
    res.json({ valid: true, message: "Đăng nhập thành công!" });
  } else {
    res.json({ valid: false, message: "Key không hợp lệ!" });
  }
});

// ✅ Render sẽ tự dùng PORT từ môi trường
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server đang chạy tại cổng ${PORT}`));