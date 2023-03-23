import getStripe from "../../lib/getStripe";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import CheckoutItem from "../../components/CheckoutItem/CheckoutItem";
import "./Checkout.css";

export default function Checkout() {
  const { cart } = useAuth();
  const { removeCartItem, updateCartItemQuantity, totalCost } = useCart();
  const shippingTax = "35.00";
  let BASE_URL = "";
  if (process.env.NODE_ENV === "development") {
    BASE_URL = "http://localhost:3000";
  } else {
    BASE_URL = "https://ec2-54-175-236-193.compute-1.amazonaws.com";
  }

  async function handleCheckout() {
    const modifiedCart = cart.map((item) => ({
      price: item.price,
      quantity: item.quantity,
    }));
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        ...modifiedCart,
        { price: "price_1MmwUYBFILIPC5HyqNB5T9yL", quantity: 1 },
      ],
      mode: "payment",
      successUrl: `${BASE_URL}/success`,
      cancelUrl: `${BASE_URL}/cancel`,
    });
    console.warn(error.message);
  }

  return (
    <div id="w">
      <div id="page">
        {cart && cart.length > 0 ? (
          <table id="cart">
            <thead>
              <tr>
                <th className="first">Photo</th>
                <th className="second">Qty</th>
                <th className="third">Product</th>
                <th className="fourth">Price</th>
                <th className="fifth">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {cart && cart.length > 0 ? (
                cart.map((item) => (
                  <CheckoutItem
                    key={item.id}
                    cart={item}
                    removeItem={removeCartItem}
                    updateQuantity={updateCartItemQuantity}
                  />
                ))
              ) : (
                <p>Nothing here...</p>
              )}
              <tr className="extracosts">
                <td className="light">Shipping &amp; Tax</td>
                <td colSpan="2" className="light"></td>
                <td>${shippingTax}</td>
                <td>&nbsp;</td>
              </tr>
              <tr className="totalprice">
                <td className="light">Total:</td>
                <td colSpan="2">&nbsp;</td>
                <td colSpan="2">
                  <span className="thick">
                    $
                    {(
                      Math.round((totalCost + Number(shippingTax)) * 100) / 100
                    ).toFixed(2)}
                  </span>
                </td>
              </tr>

              <tr className="checkoutrow">
                <td colSpan="5" className="checkout">
                  <button onClick={handleCheckout} id="submitbtn">
                    Checkout Now!
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Your cart is empty! Buy Stuff!</p>
        )}
      </div>
    </div>
  );
}
