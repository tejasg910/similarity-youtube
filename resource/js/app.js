// const addToCartButton = document.getElementById("add-to-cart-button");
// addToCartButton.addEventListener("click", async (id) => {
//   // Send a request to the server to add the item to the cart
//   const response = await fetch("/add-to-cart", {
//     method: "POST",
//     body: JSON.stringify({ _id: id }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const res = await response.json();

// .then((response) => {

//   if (response.redirected) {
//     window.location.href = response.url; // redirect to login page
//   } else {
//     if (response.ok) {
//       // Show a success notification using Toastify
//       Toastify({
//         text: "Item added to cart!",
//         backgroundColor: "green",
//         duration: 3000,
//       }).showToast();
//     } else {
//       // Show an error notification using Toastify
//       Toastify({
//         text: "Error adding item to cart",
//         backgroundColor: "red",
//         duration: 3000,
//       }).showToast();
//     }
//   }
// });
// });

// window.addEventListener("load", function () {
//   loginCheck(); // Call the function to check for the cookie and update the UI
// });

import moment from "moment";
import { initAdmin } from "./admin";
import axios from "axios";
import { showNotification } from "./showNotification";
import { initStripe } from "./stripe";

let socket = io();
initAdmin(socket);

//change status
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let timeElement = document.createElement("small");
function updateStatus(order) {
  let getTimeElement = document.querySelector(".status-box ul li small");

  let stepCompleted = true;
  let listItems = document.querySelectorAll(".status-box ul li");

  listItems.forEach((status) => {
    status.classList.remove("status_completed");
    status.classList.remove("current_status");
  });

  listItems.forEach((status) => {
    let statusValue = status.dataset.status;

    if (stepCompleted) {
      status.classList.add("status_completed");
    }
    if (order.status === statusValue) {
      stepCompleted = false;
      timeElement.innerText =
        "Updated at " + moment(order.updatedAt).format("hh:mm A");

      if (!status.contains(getTimeElement)) {
        status.appendChild(timeElement);
      }

      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current_status");
      }
    }
  });
}

updateStatus(order);

initStripe();

//ajax call
const paymentForm = document.querySelector("#paymentform");
if (paymentForm) {
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(paymentForm);
    let formObject = {};
    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }
    console.log(formObject);

    axios
      .post("/order", formObject)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          showNotification(res.data.message);
          setTimeout(() => {
            window.location.href = "/order";
          }, 1000);
        } else {
          showNotification("something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        showNotification(err.message);
      });
  });
}

//socket

if (order) {
  socket.emit("join", `order_${order._id}`);
}

let adminAreaPath = window.location.pathname;

if (adminAreaPath.includes("admin")) {
  socket.emit("join", "adminRoom");
}

socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;

  updateStatus(updatedOrder);
  Toastify({
    text: data.status,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    backgroundColor:
      "linear-gradient(90deg, rgba(65,144,83,1) 0%, rgba(46,172,64,1) 59%, rgba(14,97,74,1) 92%)",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    onClick: function () {}, // Callback after click
  }).showToast();
});
//join the room and provide the id

const message = "<%= JSON.stringify(message) %>";
