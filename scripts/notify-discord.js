import { config } from 'dotenv';
import { execSync } from "child_process";

// 載入 .env 文件
config();

// Node.js 18+ 內建支援 fetch，無需安裝 node-fetch
// 若你使用的是 Node.js < 18，請安裝並改為：import fetch from "node-fetch"

const commit = execSync("git rev-parse --short HEAD").toString().trim();
const message = execSync("git log -1 --pretty=%B").toString().trim();

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
const projectName = process.env.PROJECT_NAME || "React App";

const content = `🌐 **${projectName} 前端部署成功**\n✅ Commit: \`${commit}\`\n📝 ${message}`;

if (!webhookUrl) {
  console.log("❗ DISCORD_WEBHOOK_URL 未設定，略過通知");
  process.exit(0);
}

try {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  console.log("✅ Discord 通知已發送");
} catch (err) {
  console.error("❌ 發送 Discord 通知失敗:", err);
}