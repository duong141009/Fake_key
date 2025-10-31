const express = require('express');
const app = express();
app.use(express.json());

// Định nghĩa endpoint /apk/check_key.php
app.post('/apk/check_key.php', (req, res) => {
  const key = req.body?.key;
  const device_id = req.body?.device_id;

  console.log('Nhận yêu cầu:', { key, device_id });

  if (key === 'MY_REAL_KEY_123') {
    res.json({ valid: true, message: 'Đăng nhập thành công' });
  } else {
    res.json({ valid: false, message: 'Key không hợp lệ' });
  }
});

// Thêm GET để test nhanh bằng trình duyệt
app.get('/apk/check_key.php', (req, res) => {
  res.send('Server hoạt động — hãy dùng POST để kiểm tra key.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server đang chạy tại cổng ${port}`));