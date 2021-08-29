const { ipcRenderer } = require("electron");

const btnClose = document.querySelector(".close");
const btnMinimize = document.querySelector(".minimize");
const btnMaximize = document.querySelector(".maximize");
const menuBuIt = document.querySelector("#bu-it");
const iframe = document.createElement("iframe");

btnClose.onclick = () => {
  ipcRenderer.send("close-window-mac");
};

btnMinimize.onclick = () => {
  ipcRenderer.send("minimize-window-mac");
};

btnMaximize.onclick = () => {
  ipcRenderer.send("maximize-window-mac");
};

menuBuIt.onclick = () => {
  menuBuIt.classList.add("menu-active");
  iframe.classList.remove("not-activate");
};
