const { spawn } = require("child_process");

console.log("\n=======================================================");
console.log("🚗 Starting Car Service & Mechanic Hub");
console.log("=======================================================\n");

// Spawn backend server
const backend = spawn("npm", ["run", "dev"], {
  cwd: "./backend",
  stdio: "inherit",
  shell: true,
});

// Spawn frontend dev server
const frontend = spawn("npm", ["run", "dev"], {
  cwd: "./frontend",
  stdio: "inherit",
  shell: true,
});

const cleanup = () => {
  if (backend && !backend.killed) backend.kill();
  if (frontend && !frontend.killed) frontend.kill();
  process.exit();
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);
