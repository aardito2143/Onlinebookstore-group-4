import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BookItem from "../../components/BookItem/BookItem";
import axios from "../../api/axios";
import useCart from "../../hooks/useCart";
import "./Books.css";

export default function Books () {
    const [books, setBooks] = useState([]);
    const { category } = useParams();
    const [bookSearch, setBookSearch] = useState("");
    const { addToCart } = useCart();

    useEffect(() => {
        const getBooks = async () => {
            try {
                const response = await axios.get(`/api/books/${category}`);
                setBooks(response.data.data);
            } catch (err) {
                if(!err?.response) {
                    toast.error('Server Connection Timed Out');
                } else if (err?.response?.status === 400) {
                    toast.error('Bad Request');
                } else {
                    toast.error('Failed to fetch books from database');
                }
            }
        }

        getBooks();
    }, [category])

    return (
        <main className='main-content'>
            <div className='search-bar-container'>
                <input
                    id="hompage-search"
                    name="homepage-search" 
                    className='homepage-search-bar' 
                    placeholder='Discover a New Mystery...'
                    onChange={(e) => setBookSearch(e.target.value)}   
                />
            </div>
            <div className="category-title">{category.replace(/[^A-Z0-9]/ig, " ")}</div>
            <div className='books-container'>
                <div className='books-scroller'>
                    <div className='books-content'>
                        {books && 
                            books.filter((book) => book.title.toLowerCase().includes(bookSearch))
                                .map((book, index) =>
                                    <BookItem
                                    key={index}
                                    id={book._id} 
                                    title={book.title} 
                                    author={book.author} 
                                    genre={book.genre} 
                                    desc={book.desc} 
                                    price={book.price} 
                                    stripeId={book.stripe_id}
                                    addToCart={addToCart}
                                    qty={book.avail_inventory}
                                    />
                                )
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}