import useAuth from "../../hooks/useAuth"
import SummaryItem from "../../components/SummaryItem/SummaryItem";
import { Link } from "react-router-dom";
import "./Success.css";

export default function Success() {
    const { cart } = useAuth();

    return (
        <div className="confirmation-page">
            <div className='order-confirmation-container'>
                <div className="confirmation-banner">
                    <h1 className="banner-title">Your order has been received</h1>
                </div>
                <h1 className="order-confirmation-title">THANK YOU!</h1>
                <p className="order-confirmation-body">
                    You will recieve an e-mail containing additional details about your order shortly. In the meantime, you can see your order summary below! 
                </p>
                <div className="order-summary-container">
                    <div className="order-summary-table-header">
                        <h2 className="order-summary-title">Order Summary</h2>
                        <p className="order-summary-header">Unit Price</p>
                        <p className="order-summary-header">Qty</p>
                        <p className="order-summary-header">Total</p>
                    </div>
                    {cart.length > 0 ? cart.map((item) => <SummaryItem cart={item} />) : <p>Nothing Here...</p>}
                </div>
                <Link className="confirmation-policy-link" to="/policies">Read about our Refund Policy</Link>
            </div>
        </div>
    )
};