const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false, // entfernt alle nativen Ränder/Buttons
    titleBarStyle: "hiddenInset", // versteckt macOS Standard-Buttons
    trafficLightPosition: { x: -100, y: -100 }, // Mac-Buttons komplett raus
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC für die Titelleisten-Buttons
ipcMain.on("window-control", (event, action) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;

  switch (action) {
    case "minimize":
      win.minimize();
      break;
    case "maximize":
      win.isMaximized() ? win.unmaximize() : win.maximize();
      break;
    case "close":
      win.close();
      break;
  }
});