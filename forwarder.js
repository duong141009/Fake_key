// forwarder.js
const WebSocket = require("ws");
const axios = require("axios");

const FORWARD_URL = "https://your-replit-username.your-project.repl.co/api/push"; // Đổi về link thật
const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...."; // Token từ Sunwin

let sentSids = new Set();

function connectWebSocket() {
  const ws = new WebSocket(`wss://websocket.azhkthg1.net/websocket?token=${TOKEN}`);

  ws.on("open", () => {
    console.log("🟢 Đã kết nối WebSocket");

    const authPayload = [
      1, "MiniGame", "SC_xigtupou", "conga999",
      {
        info: "{\"ipAddress\":\"171.246.10.199\",\"userId\":\"...\"}",
        signature: "0EC9E9B2311CD352..."
      }
    ];
    ws.send(JSON.stringify(authPayload));

    setInterval(() => {
      ws.send(JSON.stringify([6, "MiniGame", "taixiuPlugin", { cmd: 1005 }]));
    }, 5000);
  });

  ws.on("message", async (data) => {
    try {
      const json = JSON.parse(data);
      const htr = json?.[1]?.htr;
      if (Array.isArray(htr)) {
        for (const item of htr) {
          if (!sentSids.has(item.sid)) {
            sentSids.add(item.sid);
            const total = item.d1 + item.d2 + item.d3;
            const result = total >= 11 ? "Tài" : "Xỉu";
            const payload = { sid: item.sid, d1: item.d1, d2: item.d2, d3: item.d3, total, result, timestamp: Date.now() };
            await axios.post(FORWARD_URL, payload);
            console.log("📤 Đã gửi:", payload);
          }
        }
      }
    } catch (err) {
      console.error("❌ WS Lỗi:", err.message);
    }
  });

  ws.on("close", () => {
    console.warn("🔌 WebSocket đóng, thử lại 5s");
    setTimeout(connectWebSocket, 5000);
  });

  ws.on("error", (err) => {
    console.error("⚠️ Lỗi WS:", err.message);
    ws.close();
  });
}

connectWebSocket();