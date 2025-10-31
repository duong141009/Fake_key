// index.js
const express = require('express');
const app = express();
app.use(express.json({ limit: '1mb' }));

// Simple in-memory key store (thay bằng DB nếu cần)
const validKeys = new Set(['MY_REAL_KEY_123','ANOTHER_KEY']);

// endpoint expected by the app
app.post('/apk/check_key.php', (req, res) => {
  const key = req.body?.key || null;
  const device_id = req.body?.device_id || null;

  if (!key) {
    return res.json({ valid: false, message: 'Thiếu key' });
  }

  // logic kiểm tra key -- thay bằng DB/logic của bạn
  if (validKeys.has(key) || key === 'ANY_FOR_TEST') {
    return res.json({ valid: true, message: 'Đăng nhập thành công' });
  } else {
    return res.json({ valid: false, message: 'Key không hợp lệ' });
  }
});

// health
app.get('/', (req, res) => res.send('OK'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));