const Fastify = require("fastify");
const WebSocket = require("ws");

const app = Fastify({ logger: false });
const PORT = process.env.PORT || 10000;

let sessions = [];

const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhbW91bnQiOjB9.p56b5g73I9wyoVu4db679bOvVeFJWVjGDg_ulBXyav8";

// === KẾT NỐI WEBSOCKET SUNWIN ===
function connectWebSocket() {
  const ws = new WebSocket(`wss://websocket.azhkthg1.net/websocket?token=${TOKEN}`, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Origin": "https://azhkthg1.net"
    }
  });

  ws.on("open", () => {
    console.log("🟢 Đã kết nối WebSocket Sunwin");

    const authPayload = [
      1, "MiniGame", "SC_xigtupou", "conga999",
      {
        info: JSON.stringify({
          ipAddress: "171.246.10.199",
          userId: "7c54ec3f-ee1a-428c-a56e-1bc14fd27e57",
          username: "SC_xigtupou"
        }),
        signature: "0EC9E9B2311CD352561D9556F88F6AB4167502EAC5F9767D07D43E521FE1BA05..."
      }
    ];
    ws.send(JSON.stringify(authPayload));

    // Gửi yêu cầu dữ liệu mỗi 5s
    setInterval(() => {
      ws.send(JSON.stringify([6, "MiniGame", "taixiuPlugin", { cmd: 1005 }]));
    }, 5000);
  });

  ws.on("message", (data) => {
    const raw = data.toString();
    console.log("📩 RAW WS:", raw.slice(0, 200));

    try {
      const json = JSON.parse(raw);
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
      console.error("❌ Lỗi WS:", err.message);
    }
  });

  ws.on("close", () => {
    console.warn("🔌 WS đóng. Kết nối lại sau 5s...");
    setTimeout(connectWebSocket, 5000);
  });

  ws.on("error", (err) => {
    console.error("⚠️ Lỗi WS:", err.message);
    ws.close();
  });
}

connectWebSocket();

// === ROUTE API CHUẨN ===

app.get("/", async () => ({
  message: "✅ Sunwin API đang hoạt động",
  endpoints: ["/api/toolaxosun", "/api/last", "/api/history?limit=50"]
}));

// Đơn giản giống mẫu bạn muốn
app.get("/api/toolaxosun", async () => {
  const latest = sessions[0];
  if (!latest) return { message: "⛔ Chưa có dữ liệu" };

  return {
    phien_cu: latest.sid,
    ket_qua: latest.result,
    xuc_xac: [latest.d1, latest.d2, latest.d3],
    phien_moi: latest.sid + 1
  };
});

// Chi tiết phiên mới nhất
app.get("/api/last", async () => {
  const latest = sessions[0];
  if (!latest) return { message: "⛔ Chưa có dữ liệu" };

  return {
    sid: latest.sid,
    dices: [latest.d1, latest.d2, latest.d3],
    total: latest.total,
    result: latest.result,
    timestamp: latest.timestamp
  };
});

// Danh sách phiên gần nhất
app.get("/api/history", async (req) => {
  const limit = parseInt(req.query.limit || "50");
  return sessions.slice(0, limit);
});

// === KHỞI CHẠY SERVER ===
app.listen({ port: PORT, host: "0.0.0.0" }, () => {
  console.log(`🚀 API chạy tại http://localhost:${PORT}`);
});