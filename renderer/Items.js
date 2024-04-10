//Modules
const fs = require("fs");
const { shell } = require("electron");

//DOM Nodes
let items = document.getElementById("items");

//Get readerJS content
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});
//Track items in storage
exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];

//Listen for "Done" message from reader window
window.addEventListener("message", (e) => {
  // this.delete(e.data.itemIndex);
  console.log(e.data);

  //check for correct message
  if (e.data.action === "delete-reader-item") {
    //Delete item at given index
    this.delete(e.data.itemIndex);

    // Close the reader window
    e.source.close();
  }
});

//Delete item
exports.delete = (itemIndex) => {
  // Remove item from DOM
  items.removeChild(items.childNodes[itemIndex]);

  //Remove item from storage
  this.storage.splice(itemIndex, 1);

  //Persist storage
  this.save();

  //Select previous item or new top item
  if (this.storage.length) {
    // Get new selected item index
    let = newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;

    // Select item at new Index
    document
      .getElementsByClassName("read-item")
      [newSelectedItemIndex].classList.add("selected");
  }
};

// Get selected item index
exports.getSelectedItem = () => {
  //Get selected node
  let currentItem = document.getElementsByClassName("read-item selected")[0];

  //Get item index
  let itemIndex = 0;
  let child = currentItem;
  while ((child = child.previousElementSibling) != null) itemIndex++;

  //return selected item and index
  return { node: currentItem, index: itemIndex };
};

//Persist storage
exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

//Set item as selected
exports.select = (e) => {
  //Remove currectly selected item class
  this.getSelectedItem().node.classList.remove("selected");

  //Add to clicked item
  e.currentTarget.classList.add("selected");
};

//Move to newL selected Item
exports.changeSelection = (direction) => {
  //Get selected item
  let curentItem = this.getSelectedItem();
  console.log(direction);
  //Handle up/down
  if (direction === "ArrowUp" && curentItem.previousElementSibling) {
    curentItem.node.classList.remove("selected");
    curentItem.node.previousElementSibling.classList.add("selected");
  } else if (direction === "ArrowDown" && curentItem.nextElementSibling) {
    curentItem.node.classList.remove("selected");
    curentItem.node.nextElementSibling.classList.add("selected");
  }
};

// Open selected item in native browser

exports.openNative = () => {
  // Only if we have items (in case of menu open)
  if (!this.storage.length) return;

  //Get selected item
  let selectedItem = this.getSelectedItem();

  //get item's url
  let contentURL = selectedItem.node.dataset.url;

  //Open in user's default system browser
  shell.openExternal(contentURL);
};

//Open selected Item
exports.open = () => {
  // Only if we have items (in case of menu open)
  if (!this.storage.length) return;

  //Get selected item
  let selectedItem = this.getSelectedItem();

  //get item's url
  let contentURL = selectedItem.node.dataset.url;

  //Open item in proxy BrowserWindow
  let readerWin = window.open(
    contentURL,
    "",
    `
  maxWidth=2000,
  maxHeight=2000,
  width=1200,
  height=800,
  backgroundColor#DEDEDE,
  nodeIntegration=0,
  contextIsolation=1`
  );

  //Inject Javascript
  readerWin.eval(readerJS.replace("{{index}}", selectedItem.index));
};

//Add new Item
exports.addItem = (item, isNew = false) => {
  //Create a new DOM node
  let itemNode = document.createElement("div");

  //Assign  'read-item' class
  itemNode.setAttribute("class", "read-item");

  //set item url as data attribute
  itemNode.setAttribute("data-url", item.url);

  //Add inner HTML
  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;

  //Append new node to "Items"
  items.appendChild(itemNode);

  //Attach clic handler to select
  itemNode.addEventListener("click", this.select);

  //Attach doubleclick handler to open
  itemNode.addEventListener("dblclick", this.open);

  //if this is the first Item, select it
  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }

  //Add Item to Storage and persist
  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

//Add Items from storage when app Loads
this.storage.forEach((item) => {
  this.addItem(item, false);
});
