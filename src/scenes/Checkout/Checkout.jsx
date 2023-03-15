import getStripe from "../../lib/getStripe";
import Success from "../Success/Success";
import useAuth from "../../hooks/useAuth";

export default function Checkout() {
    const { cart } = useAuth();
    console.log(cart);
    async function handleCheckout() {
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
          lineItems: cart,
          mode: 'payment',
          successUrl: `http://localhost:3000/success`,
          cancelUrl: `http://localhost:3000/cancel`,
          customerEmail: 'adam.ardito@yahoo.com',
        });
        console.warn(error.message);
      }


    return (
        <div className='checkout-container'>
            <h1>Stuff to be added here!</h1>
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    )
};