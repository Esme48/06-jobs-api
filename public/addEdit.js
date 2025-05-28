import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showCart } from "./jobs.js";

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
}

addEditDiv.addEventListener("click", async (e) => {
  if (inputEnabled && e.target.nodeName === "BUTTON") {
    if (e.target === addingItem) {
      enableInput(false);

      let method = "POST";
      let url = "/api/v1/component";
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
        if (response.status === 201) {
          // 201 indicates a successful create
          message.textContent = "The item entry was created.";

          item.value = "";
          color.value = "";
          status.value = "Item Pending Review";
          showCart();
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
      showCart();
    }
  }
});

export const showAddEdit = async (itemId) => {
  if (!itemId) {
    item.value = "";
    color.value = "";
    status.value = "Item Pending Review";
    addingItem.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/component/${itemId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        item.value = data.component.item;
        color.value = data.component.color;
        status.value = data.component.status;
        addingItem.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = itemId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The item entry was not found";
        showCart();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showCart();
    }
    enableInput(true);
  }
};