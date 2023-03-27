const addToCartButton = document.getElementById("add-to-cart-button");
addToCartButton.addEventListener("click", (id) => {
  // Send a request to the server to add the item to the cart
  fetch("/add-to-cart", {
    method: "POST",
    body: JSON.stringify({ _id: id }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.ok) {
      // Show a success notification using Toastify
      Toastify({
        text: "Item added to cart!",
        backgroundColor: "green",
        duration: 3000,
      }).showToast();
    } else {
      // Show an error notification using Toastify
      Toastify({
        text: "Error adding item to cart",
        backgroundColor: "red",
        duration: 3000,
      }).showToast();
    }
  });
});
