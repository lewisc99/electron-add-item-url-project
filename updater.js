// Electron-Updater Module
const { autoUpdater } = require("electron-updater");

//Configure log debuggging
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

autoUpdater.logger.initialize();
autoUpdater.logger.info("Log from the main process");

//Single export to check for and apply any available updated
module.exports = () => {
  //Check for update (GH Releases)
  autoUpdater.checkForUpdates();
};
