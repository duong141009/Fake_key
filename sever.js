const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route chính cho check key
app.post('/apk/check_key.php', (req, res) => {
  console.log('Key check:', req.body.key, 'Device:', req.body.device_id);
  
  // Luôn trả về valid: true
  res.json({
    valid: true,
    message: "Key activated successfully"
  });
});

// Health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});