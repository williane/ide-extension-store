const {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  screen,
} = require("electron");

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

ipcMain.on("bu-it-open", () => {
  const view = new BrowserView();
  const { width: currentWidth, height: currentHeight } = mainWindow.getBounds();

  mainWindow.setBrowserView(view);
  view.setBounds({
    x: 70,
    y: 40,
    width: currentWidth - 70,
    height: currentHeight - 40,
  });
  view.setAutoResize({
    width: true,
    height: true,
  });
  view.webContents.loadURL("http://usqasws0586:9000");
});

ipcMain.on("bu-it-close", () => {
  mainWindow.setBrowserView(null);
});
