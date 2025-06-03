import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit, deleteItem } from "./addEdit.js";

let itemsDiv = null;
let itemsTable = null;
let itemsTableHeader = null;

export const handleItems = () => {
  itemsDiv = document.getElementById("items");
  const logoff = document.getElementById("logoff");
  const addItem = document.getElementById("add-item");
  itemsTable = document.getElementById("items-table");
  itemsTableHeader = document.getElementById("items-table-header");

  itemsDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addItem) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged out.";
        itemsTable.replaceChildren([itemsTableHeader]);
        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        deleteItem(e.target.dataset.id);
      }
    }
  });
};

export const showItems = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/component", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [itemsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        itemsTable.replaceChildren(...children); // clear table
      } else {
        for (let i = 0; i < data.components.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<button type="button" class="editButton" data-id="${data.components[i]._id}">edit</button>`;
          let deleteButton = `<button type="button" class="deleteButton" data-id="${data.components[i]._id}">delete</button>`;
          let rowHTML = `
            <td>${data.components[i].item}</td>
            <td>${data.components[i].color}</td>
            <td>${data.components[i].status}</td>
            <td>${editButton}</td>
            <td>${deleteButton}</td>
          `;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        itemsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
  setDiv(itemsDiv);
};
