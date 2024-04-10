//Modules
const { Menu, shell } = require("electron");

//Module function to create main app Menu
module.exports = (appWindow) => {
  //Menu template
  let template = [
    {
      label: "Items",
      submenu: [
        {
          label: "Add New",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            appWindow.send("menu-show-modal");
          }
        },
        {
          label: "Read Item",
          accelerator: "CmdOrCtrl+Enter",
          click: () => {
            appWindow.send("menu-open-item");
          }
        },
        {
          label: "Delete Item",
          accelerator: "CmdOrCtrl+Backspace",
          click: () => {
            appWindow.send("menu-delete-item");
          }
        },
        {
          label: "Open in Browser",
          accelerator: "CmdOrCtrl+Shift+Enter",
          click: () => {
            appWindow.send("menu-open-item-native");
          }
        },
        {
          label: "Serch Items",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            appWindow.send("menu-focus-search");
          }
        }
      ]
    },
    {
      role: "editMenu"
    },
    {
      role: "windowMenu"
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn more",
          click: () => {
            shell.openExternal("https://github.com/");
          }
        }
      ]
    }
  ];

  //Create Map app Menu
  //darwin is for mac
  if (process.platform === "darwin") template.unshift({ role: "appMenu" });

  //Build menu
  let menu = Menu.buildFromTemplate(template);

  //Set as main app menu
  Menu.setApplicationMenu(menu);
};
