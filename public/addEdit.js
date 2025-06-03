import {
  enableInput,
  inputEnabled,
  message,
  setDiv,
  token,
} from "./index.js";
import { showItems } from "./component.js";

let addEditDiv = null;
let item = null;
let color = null;
let status = null;
let addingItem = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-item");
  item = document.getElementById("item");
  color = document.getElementById("color");
  status = document.getElementById("status");
  addingItem = document.getElementById("adding-item");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingItem) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/component";

        if (addingItem.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/component/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              item: item.value,
              color: color.value,
              status: status.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              message.textContent = "The Item Was Updated.";
            } else {
              message.textContent = "The Item Was Created.";
            }

            item.value = "";
            color.value = "";
            status.value = "Item Pending Review";
            showItems();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showItems();
      }
    }
  });
};

export const showAddEdit = async (compId) => {
  if (!compId) {
    item.value = "";
    color.value = "";
    status.value = "Item Pending Review";
    addingItem.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/component/${compId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        item.value = data.comp.item;
        color.value = data.comp.color;
        status.value = data.comp.status;
        addingItem.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = compId;

        setDiv(addEditDiv);
      } else {
        message.textContent = "This Item Was Not Found";
        showItems();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showItems();
    }

    enableInput(true);
  }
};

export const deleteItem = async (compId) => {
  try {
    enableInput(false);
    const response = await fetch(`/api/v1/component/${compId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      message.textContent = data.msg;
      showItems();
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
};


