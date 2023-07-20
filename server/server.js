const express = require("express");
const app = express();
const Stripe = require("stripe");
const stripe = Stripe("<STRIPE_SECRET_KEY>");
const cors = require("cors");

app.use(express.json());
app.use(cors());


app.post("/payTrip", async (req, res) => {
  try {
    // Getting data from client
    let { amount, customerData } = req.body;
    amount = parseInt(amount);
    // Initiate payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "USD",
      payment_method_types: ["card"],
      metadata: {
        nombre: customerData.firstName,
        apellido: customerData.lastName,
        email: customerData.email,
      },
    });
    // Extracting the client secret 
    const clientSecret = paymentIntent.client_secret;
    // Sending the client secret as response
    res.json({ message: "Payment initiated", clientSecret });
  } catch (err) {
    // Catch any error and send error 500 to client
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(8080, () => {
  console.log("the server is now running on port 8080");
});
