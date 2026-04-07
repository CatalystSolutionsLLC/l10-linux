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

// ── Team Data ─────────────────────────────────────────────────────────────

const team = {
  paul: {
    name:  "Paul Green",
    title: "Director of IT",
    bio:   "Paul leads the Catalyst IT department with a focus on strategic infrastructure and keeping the lights on across the org. If something is on fire, Paul already knows about it.",
  },
  dan: {
    name:  "Dan Payne",
    title: "Lead Systems Administrator",
    bio:   "Dan owns Azure infrastructure, Microsoft 365, and Entra ID for Catalyst. He also has strong opinions about automation — if he has done something manually more than twice, there is a script for it now.",
  },
  kevin: {
    name:  "Kevin Musyoki",
    title: "Sr. Business & Systems Analyst",
    bio:   "Kevin bridges the gap between business needs and technical solutions at Catalyst. He translates what the business actually wants into systems that work the way people expect them to.",
  },
  jamelyn: {
    name:  "Jamelyn Shook",
    title: "IT Operations & Data Solutions Specialist",
    bio:   "Jamelyn keeps IT operations running smoothly and handles data solutions across the organization. She is the person who makes sure the right information gets to the right place.",
  },
};

// ── Routes ────────────────────────────────────────────────────────────────

// GET /
app.get("/", (req, res) => {
  res.json({
    message: "Pi API is running.",
    endpoints: [
      "/health",
      "/info",
      "/team",
      "/team/paul",
      "/team/dan",
      "/team/kevin",
      "/team/jamelyn",
    ],
  });
});

// GET /health
app.get("/health", (req, res) => {
  res.json({
    status:    "ok",
    host:      os.hostname(),
    timestamp: new Date().toISOString(),
  });
});

// GET /info
app.get("/info", (req, res) => {
  const totalMem = os.totalmem();
  const freeMem  = os.freemem();
  const usedMem  = totalMem - freeMem;

  res.json({
    host:        os.hostname(),
    platform:    os.platform(),
    arch:        os.arch(),
    uptime:      formatUptime(os.uptime()),
    memory: {
      total:   `${(totalMem / 1024 / 1024).toFixed(0)} MB`,
      used:    `${(usedMem  / 1024 / 1024).toFixed(0)} MB`,
      free:    `${(freeMem  / 1024 / 1024).toFixed(0)} MB`,
      percent: `${((usedMem / totalMem) * 100).toFixed(1)}%`,
    },
    disk:        getDisk(),
    top_process: getTopProcess(),
    load_avg:    os.loadavg().map(n => n.toFixed(2)),
  });
});

// GET /team
app.get("/team", (req, res) => {
  res.json(
    Object.entries(team).map(([slug, member]) => ({
      slug,
      name:  member.name,
      title: member.title,
    }))
  );
});

// GET /team/:name
app.get("/team/:name", (req, res) => {
  const member = team[req.params.name.toLowerCase()];
  if (!member) {
    return res.status(404).json({ error: `No team member found for "${req.params.name}".` });
  }
  res.json(member);
});

// ── Start ─────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`--------------------------------------------`);
  console.log(`  Pi API running on http://localhost:${PORT}`);
  console.log(`--------------------------------------------`);
  console.log(`  GET /              - this menu`);
  console.log(`  GET /health        - status check`);
  console.log(`  GET /info          - full system info`);
  console.log(`  GET /team          - all team members`);
  console.log(`  GET /team/:name    - individual profile`);
  console.log(`--------------------------------------------`);
  console.log(`  Press Ctrl+C to stop`);
});
