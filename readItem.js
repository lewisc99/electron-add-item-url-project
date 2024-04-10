//Modules
//create new Offscreen renderer browser Window
//Load Item URL
//retrieve Item Screenshot & Title
const { BrowserWindow } = require("electron");

//offscreen BrowserWindow
let offscreenWindow;

//Exported readItem function
module.exports = (url, callback) => {
  //Create offscreen window
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true
    }
  });

  //Load Item url
  offscreenWindow.loadURL(url);

  //Wait for content to finish loading
  offscreenWindow.webContents.on("did-finish-load", (e) => {
    //Get page Title
    let title = offscreenWindow.getTitle();

    //Get screenshot (thumbnail)
    offscreenWindow.webContents.capturePage().then((image) => {
      //get image as a DataUrl
      let screenshot = image.toDataURL();

      //Execute callback with new item object

      callback({ title, screenshot, url });

      //Clean Up
      offscreenWindow.close();
      offscreenWindow = null;
    });
  });
};
