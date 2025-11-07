const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// File users.json với user duong1
app.get('/apk/users.json', (req, res) => {
  const users = [
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
  res.json(users);
});

// API trừ tiền (luôn thành công)
app.post('/apk/tru_tien.php', (req, res) => {
  console.log('Purchase request:', req.body);
  res.json({success: true, message: "Mua thành công"});
});

// API cộng tiền (luôn thành công) 
app.post('/apk/cong_tien.php', (req, res) => {
  console.log('Add coins request:', req.body);
  res.json({success: true});
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
