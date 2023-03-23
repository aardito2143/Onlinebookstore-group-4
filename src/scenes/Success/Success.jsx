import useAuth from "../../hooks/useAuth";
import SummaryItem from "../../components/SummaryItem/SummaryItem";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Success.css";

export default function Success() {
  const { cart, setCart } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () => {
      setIsLoading(true);
      const getCart = async () => {
        try {
          const response = await axios("/api/cart");
          setCart(response.data);
          setIsLoading(false);
          // eslint-disable-next-line
          const deleteResponse = await axios.delete("/api/cart");
        } catch (err) {
          if (!err?.response) {
            toast.error("Server Connection Timed Out");
          }
        }
      };
      getCart();
    },
    // eslint-disable-next-line
    []
  );

  return (
    <div className="confirmation-page">
      <div className="order-confirmation-container">
        <div className="confirmation-banner">
          <h1 className="banner-title">Your order has been received</h1>
        </div>
        <h1 className="order-confirmation-title">THANK YOU!</h1>
        <p className="order-confirmation-body">
          You will recieve an e-mail containing additional details about your
          order shortly. In the meantime, you can see your order summary below!
        </p>
        {isLoading ? (
          <>
            <div
              className="order-summary-placeholder"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "128px",
                paddingBottom: "10px",
                marginBottom: "40px",
              }}
            >
              <div className="success-loading-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="order-summary-container">
              <div className="order-summary-table-header">
                <h2 className="order-summary-title">Order Summary</h2>
                <p className="order-summary-header">Unit Price</p>
                <p className="order-summary-header">Qty</p>
                <p className="order-summary-header">Total</p>
              </div>
              {cart.length > 0 ? (
                cart.map((item) => <SummaryItem cart={item} />)
              ) : (
                <p
                  style={{
                    gridColumn: "1 / 5",
                    textAlign: "center",
                    fontSize: "1rem",
                    fontWeight: "500",
                    color: "rgba(0,0,0,0.6)",
                  }}
                >
                  Your cart has expired.
                </p>
              )}
            </div>
          </>
        )}
        <Link className="confirmation-policy-link" to="/policies">
          Read about our Refund Policy
        </Link>
        <Link className="confirmation-return-home" to="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
