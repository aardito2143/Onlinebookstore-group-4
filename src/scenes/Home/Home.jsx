import { useState, useEffect } from 'react';
import useCart from '../../hooks/useCart';
import BookItem from '../../components/BookItem/BookItem';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import "./Home.css";

const Home = () => {
    const [books, setBooks] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const getBooks = async () => {
            try {
                const response = await axios.get('/api/books');
                console.log(JSON.stringify(response?.data));
                toast.success('Successfully fetched Books from database!');
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
    }, [])

    return (
        <main className='main-content'>
            <div className='books-container'>
                {books && books.map(
                    (book, index) => 
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
                        />
                    )
                }
            </div>
        </main>
    )
}

export default Home