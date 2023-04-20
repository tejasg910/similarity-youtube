function showNotification(message) {
  Toastify({
    text: message,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    onClick: function () {}, // Callback after click
  }).showToast();
}

module.exports = { showNotification };
