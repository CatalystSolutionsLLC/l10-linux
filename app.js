const express = require("express");
const os = require("os");
const { execSync } = require("child_process");

const app = express();
const PORT = 3000;

// ── Helpers ───────────────────────────────────────────────────────────────

function getDisk() {
  try {
    const out = execSync("df -h / | tail -1").toString().trim().split(/\s+/);
    return { total: out[1], used: out[2], available: out[3], percent: out[4] };
  } catch {
    return null;
  }
}

function getTopProcess() {
  try {
    return execSync("ps aux --sort=-%cpu | awk 'NR==2{print $11}'").toString().trim();
  } catch {
    return null;
  }
}

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

// ── Routes ────────────────────────────────────────────────────────────────

// GET /
app.get("/", (req, res) => {
  res.json({
    message: "Pi API is running.",
    endpoints: ["/health", "/info"],
  });
});

// GET /health
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    host: os.hostname(),
    timestamp: new Date().toISOString(),
  });
});

// GET /info
app.get("/info", (req, res) => {
  const totalMem = os.totalmem();
  const freeMem  = os.freemem();
  const usedMem  = totalMem - freeMem;

  res.json({
    host:     os.hostname(),
    platform: os.platform(),
    arch:     os.arch(),
    uptime:   formatUptime(os.uptime()),
    memory: {
      total:     `${(totalMem / 1024 / 1024).toFixed(0)} MB`,
      used:      `${(usedMem  / 1024 / 1024).toFixed(0)} MB`,
      free:      `${(freeMem  / 1024 / 1024).toFixed(0)} MB`,
      percent:   `${((usedMem / totalMem) * 100).toFixed(1)}%`,
    },
    disk:       getDisk(),
    top_process: getTopProcess(),
    load_avg:   os.loadavg().map(n => n.toFixed(2)),
  });
});

// ── Start ─────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`--------------------------------------------`);
  console.log(`  Pi API running on http://localhost:${PORT}`);
  console.log(`--------------------------------------------`);
  console.log(`  GET /         - this menu`);
  console.log(`  GET /health   - status check`);
  console.log(`  GET /info     - full system info`);
  console.log(`--------------------------------------------`);
  console.log(`  Press Ctrl+C to stop`);
});
