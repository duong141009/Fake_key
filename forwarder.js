const Fastify = require("fastify");
const WebSocket = require("ws");

const app = Fastify({ logger: false });
const PORT = process.env.PORT || 5000;

let sessions = [];

const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhbW91bnQiOjB9.p56b5g73I9wyoVu4db679bOvVeFJWVjGDg_ulBXyav8";

// Kết nối WebSocket Sunwin
function connectWebSocket() {
  const ws = new WebSocket(`wss://websocket.azhkthg1.net/websocket?token=${TOKEN}`, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Origin": "https://azhkthg1.net",
    }
  });

  ws.on("open", () => {
    console.log("🟢 Kết nối WS Sunwin thành công");

    const authPayload = [
      1, "MiniGame", "SC_xigtupou", "conga999",
      {
        info: JSON.stringify({
          ipAddress: "171.246.10.199",
          userId: "7c54ec3f-ee1a-428c-a56e-1bc14fd27e57",
          username: "SC_xigtupou"
        }),
        signature: "0EC9E9B2311CD352561D9556F88F6AB4167502EAC5F..."
      }
    ];
    ws.send(JSON.stringify(authPayload));

    setInterval(() => {
      const payload = [6, "MiniGame", "taixiuPlugin", { cmd: 1005 }];
      ws.send(JSON.stringify(payload));
    }, 5000);
  });

  ws.on("message", async (data) => {
    try {
      const json = JSON.parse(data);
      const htr = json?.[1]?.htr;
      if (Array.isArray(htr)) {
        for (const item of htr) {
          if (!sessions.find(s => s.sid === item.sid)) {
            const total = item.d1 + item.d2 + item.d3;
            const result = total >= 11 ? "Tài" : "Xỉu";
            const session = {
              sid: item.sid,
              d1: item.d1,
              d2: item.d2,
              d3: item.d3,
              total,
              result,
              timestamp: Date.now()
            };
            sessions.unshift(session);
            if (sessions.length > 500) sessions.pop();
            console.log(`📥 Phiên ${session.sid}: ${session.d1}-${session.d2}-${session.d3} = ${session.total} → ${session.result}`);
          }
        }
      }
    } catch (err) {
      console.error("❌ Lỗi xử lý message:", err.message);
    }
  });

  ws.on("close", () => {
    console.warn("🔌 WS đóng, thử lại 5s");
    setTimeout(connectWebSocket, 5000);
  });

  ws.on("error", (err) => {
    console.error("⚠️ WS lỗi:", err.message);
    ws.close();
  });
}

connectWebSocket();

// === API ===

app.get("/", async () => ({
  message: "✅ Sunwin API hoạt động",
  endpoints: ["/api/last", "/api/history"]
}));

app.get("/api/last", async () => {
  return sessions[0] || { message: "Chưa có dữ liệu" };
});

app.get("/api/history", async (req) => {
  const limit = parseInt(req.query.limit || "50");
  return sessions.slice(0, limit);
});

app.listen({ port: PORT, host: "0.0.0.0" }, () => {
  console.log(`🚀 Sunwin API chạy tại http://localhost:${PORT}`);
});