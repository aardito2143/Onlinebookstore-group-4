import React from 'react'
import "./BookItem.css";
import useCart from '../../hooks/useCart';
import { toast } from 'react-toastify';

const BookItem = (props) => {
    const cart = useCart();

    const handleClick = () => {
        cart({
            price: props.stripeId,
            quantity: 1
        });

        toast.success(`Added ${props.title} to cart!`);
    }

    return (
        <div className='book-item-container'>
            <h1>Title: {props.title}</h1>
            <h2>Author: {props.author}</h2>
            <p>Genre: {props.genre}</p>
            <p>Description: {props.desc}</p>
            <p>Price: {props.price}</p>
            <p>Book Id: {props.id}</p>
            <p>Stripe Product Code: {props.stripeId}</p>
            <button onClick={handleClick}>Add to Cart</button>
        </div>
    )
}

export default BookItem