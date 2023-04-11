const { default: axios } = require("axios");
import moment from "moment";

export function initAdmin(socket) {
  let orders = [];
  let markup;

  axios
    .get("/admin/orders", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then(function (res) {
      orders = res.data;

      markup = generateMarkup(orders);
      setTimeout(() => {
        const orderTableBody = document.getElementById("orderTableBody");
        orderTableBody.innerHTML = markup;
      }, 0);
    })
    .catch(function (err) {
      // handle error here
      console.log(err.message);
    });

  function renderItems(items) {
    let parsedItems = Object.values(items);
    return parsedItems
      .map((menuItem) => {
        return `
                <p>${menuItem.pizza.name} - ${menuItem.quantity} pcs </p>
            `;
      })
      .join("");
  }
  function generateMarkup(orders) {
    return orders
      .map((order) => {
        return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p class="text-orange-400 font-bold">${order._id}</p>
                    <div>${renderItems(order.items)}</div>
                </td>
                <td class="border px-4 py-2">${order.customerId.username}</td>
                <td class="border px-4 py-2">${order.address}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${
                              order._id
                            }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${
                                      order.status === "order_placed"
                                        ? "selected"
                                        : ""
                                    }>
                                    Placed</option>
                                <option value="confirmed" ${
                                  order.status === "confirmed" ? "selected" : ""
                                }>
                                    Confirmed</option>
                                <option value="prepared" ${
                                  order.status === "prepared" ? "selected" : ""
                                }>
                                    Prepared</option>
                                <option value="delivered" ${
                                  order.status === "delivered" ? "selected" : ""
                                }>
                                    Delivered
                                </option>
                                <option value="completed" ${
                                  order.status === "completed" ? "selected" : ""
                                }>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format("hh:mm A")}
                </td>
                <td class="border px-4 py-2">
                    ${order.paymentStatus ? "paid" : "Not paid"}
                </td>
            </tr>
        `;
      })
      .join("");
  }

  socket.on("orderPlaced", (data) => {
    Toastify({
      text: "New order placed",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      stopOnFocus: true, // Prevents dismissing of toast on hover
      onClick: function () {}, // Callback after click
    }).showToast();
    console.log(data);
    orders.unshift(data);
    const orderTableBody = document.getElementById("orderTableBody");
    orderTableBody.innerHTML = "";
    orderTableBody.innerHTML = generateMarkup(orders);
  });
}
