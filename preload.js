const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  controlWindow: (action) => ipcRenderer.send("window-control", action),
});
