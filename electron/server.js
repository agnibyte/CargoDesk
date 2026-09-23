const http = require("http");
const path = require("path");
const fs = require("fs");
const net = require("net");
const dotenv = require("dotenv");

let serverInstance = null;

// Helper to find an available local TCP port
function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, "127.0.0.1", () => {
      const port = srv.address().port;
      srv.close((err) => {
        if (err) return reject(err);
        resolve(port);
      });
    });
    srv.on("error", reject);
  });
}

/**
 * Starts the production Next.js server locally
 * @param {string} appDir Base directory of the Next.js application
 * @returns {Promise<{ port: number, url: string }>}
 */
async function startServer(appDir) {
  process.env.NODE_ENV = "production";

  // Check possible locations for .env
  const appEnvPath = path.join(appDir, ".env");
  const resourceEnvPath = process.resourcesPath ? path.join(process.resourcesPath, ".env") : null;

  if (fs.existsSync(appEnvPath)) {
    dotenv.config({ path: appEnvPath });
  } else if (resourceEnvPath && fs.existsSync(resourceEnvPath)) {
    dotenv.config({ path: resourceEnvPath });
  }

  const port = await getFreePort();
  const next = require("next");
  const nextApp = next({
    dev: false,
    dir: appDir,
  });

  await nextApp.prepare();
  const handle = nextApp.getRequestHandler();

  return new Promise((resolve, reject) => {
    serverInstance = http.createServer((req, res) => {
      handle(req, res);
    });

    serverInstance.listen(port, "127.0.0.1", (err) => {
      if (err) {
        return reject(err);
      }
      const url = `http://127.0.0.1:${port}`;
      console.log(`[Electron Server] Next.js production server running at ${url}`);
      resolve({ port, url });
    });

    serverInstance.on("error", (err) => {
      console.error("[Electron Server] Server error:", err);
      reject(err);
    });
  });
}

/**
 * Gracefully stop the local Next.js server
 */
function stopServer() {
  if (serverInstance) {
    try {
      serverInstance.close();
      console.log("[Electron Server] Local Next.js server stopped.");
    } catch (err) {
      console.error("[Electron Server] Error closing server:", err);
    }
    serverInstance = null;
  }
}

module.exports = {
  startServer,
  stopServer,
};
