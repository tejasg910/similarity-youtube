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

import { initAdmin } from "./admin";
initAdmin();
