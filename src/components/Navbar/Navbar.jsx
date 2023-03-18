import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import axios from "../../api/axios";
import "./Navbar.css";
import { toast } from "react-toastify";

export default function Navbar () {
    const navigate = useNavigate();
    const { cart, setCart } = useAuth();
    const { totalQuantity } = useCart();

    const handleClick = () => {
        navigate('/checkout');
    }

    useEffect(() => {
        const getCart = async () => {
            try {
                const response = await axios('/api/cart');
                console.log(response?.data);
                setCart(response.data);
                toast.success('Successfully retreived Cart!');
            } catch (err) {
                if(!err?.response) {
                    toast.error('Server Connection Timed Out');
                } else if (err?.response?.status === 400) {
                    toast.error('Failed to fetch the cart');
                }
            }
        }

        getCart();
    }, [])

    return (
        <nav>
                <h1 className="navHeader">Mystery Inc. Bookstore</h1>
                <ul className="nav-list">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/account">Account</Link>
                        <ul className="">
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Sign Up</Link></li>
                        </ul>
                    </li>
                    <li><Link to="/books">Books</Link>
                        <ul>
                            <li><Link to="/books/best-sellers">Best Sellers</Link></li>
                            <li><Link to="/books/genres">Genres</Link></li>
                        </ul>
                    </li>
                    <li><Link to="/contact-us">Contact Us</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
                <div className="Cart">
                    <button type="button" onClick={handleClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#084887" className="bi bi-bag" viewBox="0 0 16 16">
                            <path className="bi-bag" d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                        </svg>
                        {cart && totalQuantity > 0 && <div className="cart-icon">{totalQuantity <= 9 ? totalQuantity : "9+"}</div>}
                    </button>
                </div>
                <li className="search-icon">
                    <input type="text" placeholder="Search.."/>
                </li>
        </nav>
    )
}