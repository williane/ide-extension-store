const { ipcRenderer } = require("electron");
const path = require("path");

const btnClose = document.querySelector(".close");
const btnMinimize = document.querySelector(".minimize");
const btnMaximize = document.querySelector(".maximize");
const menuWrapper = document.querySelectorAll(".menu-icon-wrapper");
const menuBuIt = document.querySelector("#bu-it");
const menuGit = document.querySelector("#git-wrapper");
const labelUsername = document.querySelector("#username");

const userName = process.env["USERPROFILE"].split(path.sep)[2];

labelUsername.textContent = userName;

function removeClassActive() {
  menuWrapper.forEach((item) => {
    item.classList.remove("menu-active");
  });
}

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
  removeClassActive();
  menuBuIt.classList.add("menu-active");
  ipcRenderer.send("bu-it-open");
};

menuGit.onclick = () => {
  removeClassActive();
  menuGit.classList.add("menu-active");
  ipcRenderer.send("bu-it-close");
};
