import { Alert, Button, TextInput, View } from 'react-native';
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { useState } from 'react';
import axios from 'axios'
export default function App() {
  const [amount, setAmount] = useState("");
  const stripe = useStripe();

  const customerData = {
    firstName: "lautaro",
    lastName: "duran",
    email: "lauttyd@gmail.com"
  }

  const payTrip = async () => {
    try {
      const finalAmount = parseInt(amount);
      const response = await axios.post("http://localhost:8080/payTrip", {
        amount: finalAmount,
        customerData
      })
      const data = await response.data

      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: 'Merchant Name',
      });

      if (initSheet.error) {
        console.error(initSheet.error);
        return Alert.alert(initSheet.error.message);
      }

      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret: data.clientSecret
      });
      if (presentSheet.error) {
        console.error(presentSheet.error);
        return Alert.alert(presentSheet.error.message);
      }
      Alert.alert("¡¡Compra realizada con éxito!!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error en la compra");
    }
  };
  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_KEY}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 3 }}>
        <TextInput
          placeholder="USD"
          keyboardType="numeric"
          style={{ padding: 10, borderColor: "black", borderWidth: 1, width: "30%" }}
          value={amount}
          onChangeText={(e) => setAmount(e)}
        />
        <Button title="Comprar" onPress={payTrip} />
      </View>
    </StripeProvider>
  );
}