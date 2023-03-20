// const { app, BrowserWindow } = require("electron");
// const path = require("path");

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//     },
//   });

//   win.loadFile("index.html");
// }

// app.whenReady().then(() => {
//   createWindow();

//   app.on("activate", () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow();
//     }
//   });
// });

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });
// // console.log(`欢迎来到 Electron`);
const { app, BrowserWindow, ipcMain, Menu, Shell } = require("electron");
// const { remote } = require("@electron/remote/mian");
const remote = require("@electron/remote/main");

const template = [
  {
    label: "View",
    submenu: [{ role: "reload" }],
  },
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.commandLine.appendSwitch("remote-debugging-port", "8834");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      // 这里拼错一次，不给检查拼写实在是太烦了
      contextIsolation: false,
      webSecurity: false,
    },
  });
  // mainWindow是BrowserWindow（主进程）的一个实例
  // mainWindow.loadURL("https://ctrip.com");
  mainWindow.loadFile("./src/index.html");
  mainWindow.webContents.send("main_to_renderer_channel", {
    message: "hello,我是主进程",
  });
  remote.initialize();
  remote.enable(mainWindow.webContents);
  // 主进程启用remote模块
};
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on("channel_get_file_path", (event, params) => {
  // 注意这个event
  const pathFile = __filename;
  event.reply("channel_file_path_back", { path: pathFile });
  // 传递的参数是path
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//
