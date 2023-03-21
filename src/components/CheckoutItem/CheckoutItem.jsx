import { useState } from "react";
import ImgPlaceholder from "../ImgPlaceholder/ImgPlaceholder";
import "./CheckoutItem.css";

export default function CheckoutItem (props) {
    const imageName = props.cart.title.replace(/[^A-Z0-9]/ig, "").toLowerCase();
    const maxQuantity = 9;
    const [qty, setQty] = useState();
    return (
        <tr className="productitm">
            <td>
                <ImgPlaceholder name="summary-thumbnail" src={`/images/${imageName}.jpg`} width='48px' height='72px' customId='summary-loading-ring'/>
                {/* <img src={`/images/${imageName}.jpg`} className="summary-thumbnail" /> */}
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-book-fill" viewBox="0 0 16 16">
                <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
                </svg> */}
            </td>
            <td>
                <select
                    id="checkout-select-field"
                    name="checkout-selectfield"
                    defaultValue={props.cart.quantity}
                    value={qty}
                    onChange={(e) => 
                        props.updateQuantity(props.cart.id, Number(e.target.value)).then(
                            (updatedQty) => {
                                setQty(updatedQty);
                            }
                        )}
                    required>
                        {Array.from({ length: maxQuantity }, (_, index) => (
                            <option key={index} value={index + 1}>
                                {index + 1 }
                            </option>
                        ))}
                </select>
            </td>
            <td>{props.cart.title}</td>
            <td>${props.cart.cost}</td>
            <td>
                <span className="remove">
                    <button className="checkout-remove-btn" onClick={() => props.removeItem(props.cart.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                        </svg>
                    </button>
                </span>
            </td>
        </tr>
    );
}