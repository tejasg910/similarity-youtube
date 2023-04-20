import { loadStripe } from "@stripe/stripe-js";

export async function initStripe() {
  // const stripe = await loadStripe(
  //   "pk_test_51MyIicSH0DotAFf8fTlBtCtrDg3spc3GSVxtWOKmCt2jq4FC463HIrZd0DYv6JqJddPTgY0Kbi46jE10WAOXFsUS00ZfCZTEDJ"
  // );
  var stripe = Stripe(
    "pk_test_51MyIicSH0DotAFf8fTlBtCtrDg3spc3GSVxtWOKmCt2jq4FC463HIrZd0DYv6JqJddPTgY0Kbi46jE10WAOXFsUS00ZfCZTEDJ"
  );

  // var elements = stripe.elements({
  //   clientSecret: process.env.STRIPESECRETKEY,
  //   mode: "payment",
  //   currency: "usd",
  //   amount: 1099,
  // });

  var elements = stripe.elements();
  var style = {
    base: {
      color: "#32325d",
    },
  };

  var card = elements.create("card", { style: style });
  console.log(card);
  const cardElement = document.getElementById("card-element");

  await card.mount("#card-element");
  console.log(cardElement);

  card.on("change", ({ error }) => {
    console.log("in card change function");
    console.log(error);
    let displayError = document.getElementById("card-errors");
    if (error) {
      displayError.textContent = error.message;
    } else {
      displayError.textContent = "";
    }
  });
  // const elements = await stripe.elements();
  // let card = await elements.create("card", {
  //   style: {
  //     base: {
  //       color: "#32325d",
  //     },
  //   },
  // });

  // var paymentElement = elements.create("payment");
  // // console.log(card);
  // // await card.mount("#card-element");
  // console.log(paymentElement);
  // const paymentType = document.querySelector("#paymentType");

  paymentType.addEventListener("change", (e) => {
    console.log(e.target.value);

    if (e.target.value === "card") {
      //disply widget
    } else {
      //hide widget
    }
  });
}
