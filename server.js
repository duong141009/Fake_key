const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let users = [
  {
    "email": "duong1",
    "username": "duong1", 
    "password": "duong",
    "invite_key": "",
    "device_id": "5759ca034300ac3d", 
    "ma_nap": "NAPTKTAPK123456",
    "so_du": 1000,
    "created_at": "2025-11-07 08:01:07",
    "goi_dung": "goivip6",
    "expires": "2125-11-07 08:01:07"
  }
];

// API đăng ký - tự động cấp 1000 xu
app.post('/apk/register.php', (req, res) => {
  const { username, email, password, invite_key, device_id } = req.body;
  
  // Tạo user mới với 1000 xu
  const newUser = {
    email: email,
    username: username,
    password: password,
    invite_key: invite_key || "",
    device_id: device_id,
    ma_nap: "NAPTKTAPK" + Math.floor(Math.random() * 1000000),
    so_du: 1000, // Auto 1000 xu
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    goi_dung: "goivip1",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19)
  };
  
  users.push(newUser);
  
  res.json({
    success: true,
    message: "Đăng ký thành công! Bạn nhận ngay 1000 xu."
  });
});

// API login - check user
app.post('/apk/login.php', (req, res) => {
  const { username, password, device_id } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      message: "Đăng nhập thành công"
    });
  } else {
    res.json({
      success: false,
      message: "Sai thông tin đăng nhập"
    });
  }
});

// API lấy user data
app.get('/apk/users.json', (req, res) => {
  res.json(users);
});

// API trừ tiền
app.post('/apk/tru_tien.php', (req, res) => {
  res.json({success: true, message: "Mua thành công"});
});

// API cộng tiền
app.post('/apk/cong_tien.php', (req, res) => {
  res.json({success: true});
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
