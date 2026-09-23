const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const { startServer, stopServer } = require("./server");

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
let mainWindow = null;
let serverUrl = null;

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function getIconPath() {
  const iconPath = path.join(__dirname, "icons/icon.png");
  if (fs.existsSync(iconPath)) {
    return iconPath;
  }
  return path.join(__dirname, "../public/logo.png");
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: "CargoDesk - Fleet & Logistics Management",
    icon: getIconPath(),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Display window gracefully once content is ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }
  });

  // Open external links and target="_blank" in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        shell.openExternal(url);
      }
    } catch (err) {
      console.error("Invalid URL in setWindowOpenHandler:", err);
    }
    return { action: "deny" };
  });

  // Intercept navigation away from the application
  mainWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    try {
      const parsedUrl = new URL(navigationUrl);
      const isAppUrl =
        serverUrl &&
        (parsedUrl.origin === new URL(serverUrl).origin ||
          parsedUrl.origin === "http://localhost:3000" ||
          parsedUrl.origin === "http://127.0.0.1:3000");

      if (!isAppUrl) {
        event.preventDefault();
        shell.openExternal(navigationUrl);
      }
    } catch (err) {
      console.error("Error in will-navigate:", err);
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  async function loadWithRetry(url, maxRetries = 15, delayMs = 1200) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (!mainWindow || mainWindow.isDestroyed()) return;
        console.log(`[Electron Main] Loading URL (attempt ${attempt}/${maxRetries}): ${url}`);
        await mainWindow.loadURL(url);
        console.log(`[Electron Main] Successfully loaded ${url}`);
        return;
      } catch (err) {
        console.warn(
          `[Electron Main] Connection attempt ${attempt} failed (${err.message}). Retrying in ${delayMs}ms...`
        );
        if (attempt === maxRetries) {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.loadURL(
              `data:text/html;charset=utf-8,<h2>Unable to connect to Next.js server</h2><p>${err.message}</p><button onclick="location.href='${url}'">Retry</button>`
            );
          }
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  // Determine target URL (Dev or Production)
  if (isDev) {
    serverUrl = process.env.ELECTRON_START_URL || "http://127.0.0.1:3000";
    await loadWithRetry(serverUrl);
  } else {
    try {
      const appPath = app.getAppPath();
      console.log(`[Electron Main] Initializing local Next.js server from: ${appPath}`);
      const { url } = await startServer(appPath);
      serverUrl = url;
      await loadWithRetry(serverUrl);
    } catch (error) {
      console.error("[Electron Main] Failed to start local Next.js server:", error);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.loadURL(
          `data:text/html;charset=utf-8,<h2>Failed to load CargoDesk</h2><p>${error.message}</p>`
        );
      }
    }
  }
}

// Setup IPC handlers
function setupIpcHandlers() {
  ipcMain.handle("app:version", () => app.getVersion());

  ipcMain.handle("app:openExternal", async (_event, url) => {
    if (typeof url === "string") {
      try {
        const parsed = new URL(url);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          await shell.openExternal(url);
          return { success: true };
        }
      } catch (err) {
        return { success: false, error: "Invalid URL" };
      }
    }
    return { success: false, error: "Disallowed URL protocol" };
  });

  ipcMain.handle("window:minimize", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.minimize();
  });

  ipcMain.handle("window:maximize", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  });

  ipcMain.handle("window:close", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.close();
  });

  ipcMain.handle("window:isMaximized", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return win ? win.isMaximized() : false;
  });
}

// Application Lifecycle
app.whenReady().then(async () => {
  setupIpcHandlers();
  await createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  stopServer();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  stopServer();
});
