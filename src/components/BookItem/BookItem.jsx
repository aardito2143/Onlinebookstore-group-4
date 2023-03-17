import React from 'react'
import "./BookItem.css";
import { toast } from 'react-toastify';

const BookItem = ({ title, author, genre, desc, price, id, stripeId, addToCart }) => {

    const imageName = title.replace(/[^A-Z0-9]/ig, "").toLowerCase();

    const book = {
        title: title,
        author: author,
        genre: genre,
        desc: desc,
        cost: price,
        id: id,
        price: stripeId,
        quantity: 1
    };

    return (
        <div className='book-item-container'>
            <img className='book-cover-art' src={`/images/${imageName}.jpg`}/>
            <div className='book-details'>
                <h1 className='book-title'>
                    {title}
                    <span className='tooltip'>
                        {title}
                    </span>    
                </h1>
                <p className='book-author'>{author}</p>
                <p className='book-price'>$ {price}</p>
                <button className='book-add-to-cart' onClick={() => addToCart(book)}>Add to Cart</button>
            </div>
        </div>
    )
}

export default BookItem