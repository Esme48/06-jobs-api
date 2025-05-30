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
              // a 200 is expected for a successful update
              message.textContent = "The Item Was Updated.";
            } else {
              // a 201 is expected for a successful create
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
        // might happen if the list has been updated since last display
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



