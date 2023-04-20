// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")(
  "sk_test_51MyIicSH0DotAFf8Obdj6cC7scfi1YT6msjueiGUXZJYDebeWUBDVZX8M1xxTJOFo1ksKtDmgFirS307AMOP3Dwh00KjEIxla7"
);

const doPayment = async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "inr",
    // Verify your integration in this guide by including this parameter
    metadata: { integration_check: "accept_a_payment" },
  });
  res.json({ client_secret: paymentIntent.client_secret });

  console.log(paymentIntent);
};

module.exports = { doPayment };
