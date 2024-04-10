// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require("electron");
const items = require("./Items");

let showModal = document.getElementById("show-modal"),
  closeModal = document.getElementById("close-modal"),
  modal = document.getElementById("modal"),
  addItem = document.getElementById("add-item"),
  itemUrl = document.getElementById("url");
search = document.getElementById("search");

const closeTheModal = () => {
  modal.style.display = "none";
};

// Close modal when renderer process starts
closeTheModal();

// Open modal from menu
ipcRenderer.on("menu-show-modal", () => {
  showModal.click();
});

// Open selected item from menu
ipcRenderer.on("menu-open-item", () => {
  items.open();
});

// Delete selected item from menu
ipcRenderer.on("menu-delete-item", () => {
  let selectedItem = items.getSelectedItem();
  items.delete(selectedItem.index);
});

// Open item in native browser from menu
ipcRenderer.on("menu-open-item-native", () => {
  items.openNative();
});

// Focus the search input from the menu
ipcRenderer.on("menu-focus-search", () => {
  search.focus();
});

//Filter item with "Search"
search.addEventListener("keyup", (e) => {
  //Loop items
  Array.from(document.getElementsByClassName("read-item")).forEach((item) => {
    //Hide items that don't match search value
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? "flex" : "none";
  });
});

//Navigate item selection with up/down arrows
document.addEventListener("keydown", (e) => {
  if (e.key == "ArrowUp" || e.key === "ArrowDown") {
    items.changeSelection(e.key);
  }
});

// Disable & Enable modal buttons
const toggleModalButtons = () => {
  //Check state of buttons
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = "Add Item";
    closeModal.style.display = "inline";
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = "Adding...";
    closeModal.style.display = "none";
  }
};

//showModal
showModal.addEventListener("click", (e) => {
  modal.style.display = "flex";
  itemUrl.focus();
});

closeModal.addEventListener("click", (e) => {
  modal.style.display = "none";
});

//listen for a keyboard submit
itemUrl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addItem.click();
});

addItem.addEventListener("click", (e) => {
  if (itemUrl.value) {
    //send new item url to main process
    ipcRenderer.send("new-item", itemUrl.value);

    //Disable Buttons
    toggleModalButtons();
  }
});

//Listen for a new item from main process
ipcRenderer.on("new-item-success", (e, newItem) => {
  //Add new item to "items" node
  items.addItem(newItem, true);

  //Enable Buttons
  toggleModalButtons();

  //Hide modal and clear value
  modal.style.display = "none";
  itemUrl.value = "";
});

