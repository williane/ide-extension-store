const { app, BrowserWindow, ipcMain, screen } = require("electron");

let mainWindow = null;

if (require("electron-squirrel-startup")) {
  app.quit();
}

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
});

ipcMain.on("close-window-mac", () => {
  mainWindow.close();
});

ipcMain.on("minimize-window-mac", () => {
  mainWindow.minimize();
});

ipcMain.on("maximize-window-mac", () => {
  const { width: currentWidth, height: currentHeight } = mainWindow.getBounds();
  const { width: maxWidth, height: maxHeight } =
    screen.getPrimaryDisplay().workAreaSize;
  const isMaximized = currentWidth === maxWidth && currentHeight === maxHeight;

  if (!isMaximized) {
    mainWindow.maximize();
  } else {
    mainWindow.unmaximize();
  }
});
