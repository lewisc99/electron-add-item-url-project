// Electron-Updater Module
const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

//Configure log debuggging
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

autoUpdater.logger.initialize();
autoUpdater.logger.info("Log from the main process");

//Disable auto download of updates
autoUpdater.autoDownload = false;

//Single export to check for and apply any available updated
module.exports = () => {
  //Check for update (GH Releases)
  autoUpdater.checkForUpdates();

  //listen for update found
  autoUpdater.on("update-available", () => {
    //Prompt user to start dowload
    dialog
      .showMessageBox({
        type: "info",
        title: "Update available",
        message: "A new version of Readit is available. Do you to update now?",
        buttons: ["Update", "No"]
      })
      .then((result) => {
        let buttonIndex = result.response;

        // If button 0 (update), start donwload the update

        if (buttonIndex === 0) autoUpdater.downloadUpdate();
      });
  });
};
