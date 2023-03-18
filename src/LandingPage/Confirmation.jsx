import React from 'react';

function Confirmation(props) {
    return (
        <div>
            <h2>Thank you for your purchase!</h2>
            <p>Order Summary:</p>
            <ul>
                <li>Book title: {props.book.title}</li>
                <li>Price: {props.book.price}</li>
                <li>Shipping address: {props.address}</li>
            </ul>
            <button onClick={() => props.history.push('/')}>Back to Homepage</button>
        </div>
    );
}

export default Confirmation;
