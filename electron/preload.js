const { contextBridge, ipcRenderer } = require("electron");

// Expose secure and restricted APIs to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  isElectron: true,
  platform: process.platform,

  // App information
  getAppVersion: () => ipcRenderer.invoke("app:version"),

  // Safe external URL opener
  openExternal: (url) => ipcRenderer.invoke("app:openExternal", url),

  // Window control actions
  minimizeWindow: () => ipcRenderer.invoke("window:minimize"),
  maximizeWindow: () => ipcRenderer.invoke("window:maximize"),
  closeWindow: () => ipcRenderer.invoke("window:close"),
  isWindowMaximized: () => ipcRenderer.invoke("window:isMaximized"),
});
