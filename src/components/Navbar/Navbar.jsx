import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import useLogout from "../../hooks/useLogout";
import "./Navbar.css";

export default function Navbar () {
    const navigate = useNavigate();
    const logout = useLogout();
    const { auth, cart } = useAuth();
    const { totalQuantity, getCart } = useCart();

    const handleClick = () => {
        navigate('/checkout');
    }

    const handleLogout = async () => {
        await logout();
    }

    useEffect(() => {
        getCart();
    }, 
    // eslint-disable-next-line
    []);

    return (
        <nav>
                <h1 className="navHeader">Mystery Inc. Bookstore</h1>
                <ul className="nav-list">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/account">Account</Link>
                        <ul className="">
                            {auth && auth?.accessToken ? (
                                <li><Link onClick={handleLogout}>Logout</Link></li>
                            ) : (
                                <div>
                                    <li><Link to="/login">Login</Link></li>
                                    <li><Link to="/register">Sign Up</Link></li>
                                </div>
                            )}
                        </ul>
                    </li>
                    <li><Link to="/">Books</Link>
                        <ul>
                            <li><a href="/books/best-sellers">Best Sellers</a></li>
                            <li><a href="/books/classics">Classics</a></li>
                        </ul>
                    </li>
                    <li><Link to="/contact-us">Contact Us</Link></li>
                    <li><Link to="/about">About</Link></li>
                    {auth?.role === 'admin' && 
                        <li>
                            <Link to="/dashboard">Admin</Link>
                                <ul style={{ zIndex: 2 }}>
                                    <li><Link to="/dashboard" >Dashboard</Link></li>
                                </ul>
                        </li>
                    }    
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