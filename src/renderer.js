const { ipcRenderer } = require("electron");
const { BrowserWindow } = require("@electron/remote");
// 这里拼错一次
const btnDom = document.querySelector("#sendMessage");
const messageDom = document.querySelector("#message");
const openCtripDom = document.querySelector("#openCtrip");

btnDom.addEventListener("click", () => {
  // addEventListener() API来监听 kepup 和 keydown DOM事件。
  // click 是事件，其实作用和下面的channel差不多（我理解的是差不多
  ipcRenderer.send("channel_get_file_path");
  // 发送消息时，事件名称为channel，其实解释为“通道“更好理解”一些
});

ipcRenderer.on("channel_file_path_back", (event, params) => {
  console.log(params);
  messageDom.innerHTML = params.path;
});
ipcRenderer.on("main_to_renderer_channel", (event, params) => {
  console.log(params);
  messageDom.innerHTML = params.message;
});
openCtripDom.addEventListener("click", () => {
  const Browser = new BrowserWindow({ width: 400, height: 400 });
  Browser.loadURL("https://ctrip.com");
});
