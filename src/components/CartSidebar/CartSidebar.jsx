import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import ImgPlaceholder from "../ImgPlaceholder/ImgPlaceholder";
import "./CartSidebar.css";

export default function CartSidebar () {
    const { updateCartItemQuantity, removeCartItem, totalCost } = useCart();
    const { cart } = useAuth();

    return (
        <>
            {cart && cart.length > 0 ? (
                <div className='cart-sidebar-container'>
                    <div className="cart-sidebar-subtotal">SubTotal: ${(Math.round((totalCost) * 100 ) / 100 ).toFixed(2)}</div>
                    <div className="cart-sidebar-scroller">
                        <div className="cart-sidebar-content">
                            {cart.map((cartItem) =>
                                    <div className='cart-sidebar-item'>
                                        <ImgPlaceholder 
                                            src={`/images/${cartItem.title.replace(/[^A-Z0-9]/ig, "").toLowerCase()}.jpg`} 
                                            name='cart-sidebar-thumbnail' 
                                            width='100px'
                                            height='152px' />
                                        {/* <img
                                            className='cart-sidebar-thumbnail' 
                                            src={`/images/${cartItem.title.replace(/[^A-Z0-9]/ig, "").toLowerCase()}.jpg`}
                                            alt={cartItem.title}
                                        /> */}
                                        <p className='cart-sidebar-price'>${cartItem.cost}</p>
                                        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: '10px' }}>
                                            <select
                                                className='cart-sidebar-dropdown'
                                                id="checkout-select-field"
                                                name="checkout-selectfield"
                                                defaultValue={cartItem.quantity}
                                                value={cartItem.quantity}
                                                onChange={(e) => updateCartItemQuantity(cartItem.id, Number(e.target.value))}
                                                required>
                                                    {Array.from({ length: 9 }, (_, index) => (
                                                        <option key={index} value={index + 1}>
                                                            {index + 1 }
                                                        </option>
                                                    ))}
                                            </select>
                                            <button 
                                                className='cart-sidebar-remove'
                                                onClick={() => removeCartItem(cartItem.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill cart-sidebar-trash" viewBox="0 0 16 16">
                                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            ): (
                <></>
            )}
        </>
    )
}