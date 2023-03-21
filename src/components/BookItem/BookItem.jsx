import React from 'react'
import "./BookItem.css";
import ImgPlaceholder from '../ImgPlaceholder/ImgPlaceholder';

const BookItem = ({ title, author, genre, desc, price, qty, id, stripeId, category, addToCart }) => {

    const imageName = title.replace(/[^A-Z0-9]/ig, "").toLowerCase();

    const book = {
        title: title,
        author: author,
        genre: genre,
        desc: desc,
        cost: price,
        id: id,
        price: stripeId,
        category: category,
        quantity: 1,
        avail_inventory: qty
    };

    return (
        <div className='book-item'>
            <div className='book-item-container'>
                <ImgPlaceholder name='book-cover-art' src={`/images/${imageName}.jpg`} width='164px' height='246px' />
                {/* <img className='book-cover-art' src={`/images/${imageName}.jpg`}/> */}
                <div className='book-details'>
                    <h1 className='book-title'>
                        {title}
                        <span className='tooltip'>
                            {title}
                        </span>    
                    </h1>
                    <p className='book-author'>{author}</p>
                    <p className='book-price'>$ {price}</p>
                    <p className='book-qty'>{qty > 0 ? (`In Stock: ${qty}`) : "Out of Stock"}</p>
                    <button disabled={qty < 1} className='book-add-to-cart' onClick={() => addToCart(book)}>{qty > 0 ? "Add to Cart" : "Out of Stock"}</button>
                </div>
            </div>
        </div>
    )
}

export default BookItem