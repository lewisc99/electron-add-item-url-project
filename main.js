// Modules
const { app, BrowserWindow, ipcMain } = require("electron");
const windowStateKeeper = require("electron-window-state");
const readItem = require("./readItem");
const appMenu = require("./menu");
const fs = require("fs");
const updater = require("./updater");

// Read the token from the file
const tokenFilePath = __dirname + "/private/GH_TOKEN.txt";
const token = fs.readFileSync(tokenFilePath, "utf8").trim();
process.env.GH_TOKEN = token;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

//Listen for a new request
ipcMain.on("new-item", (e, itemUrl) => {
  readItem(itemUrl, (item) => {
    e.sender.send("new-item-success", item);
  });
});

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  //Check for app updates after 3 seconds
  setTimeout(updater, 3000);

  // Win state keeper
  let state = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 650
  });

  mainWindow = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: 350,
    maxWidth: 650,
    minHeight: 300,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  //Create main app menu
  appMenu(mainWindow.webContents);

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile("renderer/main.html");

  // Manage new window state
  state.manage(mainWindow);

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Electron `app` is ready
app.on("ready", createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

// SSL/TSL: this is the self signed certificate support
app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    // On certificate error we disable default behaviour (stop loading the page)
    // and we then say "it is all fine - true" to the callback
    event.preventDefault();
    callback(true);
  }
);

