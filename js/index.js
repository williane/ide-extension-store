const { ipcRenderer } = require("electron");

const btnClose = document.querySelector(".close");
const btnMinimize = document.querySelector(".minimize");
const btnMaximize = document.querySelector(".maximize");

btnClose.onclick = () => {
  ipcRenderer.send("close-window-mac");
};

btnMinimize.onclick = () => {
  ipcRenderer.send("minimize-window-mac");
};

btnMaximize.onclick = () => {
  ipcRenderer.send("maximize-window-mac");
};
