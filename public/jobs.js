import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let cartDiv = null;
let cartTable = null;
let cartTableHeader = null;

export const handleCart = () => {
  cartDiv = document.getElementById("cart");
  const logoff = document.getElementById("logoff");
  const addItem = document.getElementById("add-item");
  cartTable = document.getElementById("cart-table");
  cartTableHeader = document.getElementById("cart-table-header");

  cartDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addItem) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        cartTable.replaceChildren([cartTableHeader]);
        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      }
    }
  });
};

export const showCart = async () => {
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
    let children = [cartTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        cartTable.replaceChildren(...children); // clear this for safety
      } else {
        for (let i = 0; i < data.component.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.component[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.component[i]._id}>delete</button></td>`;
          let rowHTML = `
            <td>${data.component[i].item}</td>
            <td>${data.component[i].color}</td>
            <td>${data.component[i].status}</td>
            <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        cartTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(cartDiv);
};