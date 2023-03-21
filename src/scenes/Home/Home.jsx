import { useState, useEffect } from 'react';
import useCart from '../../hooks/useCart';
import BookItem from '../../components/BookItem/BookItem';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import Carousel from '../../components/Carousel/Carousel';
import "./Home.css";

const Home = () => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart } = useCart();
    const [bookSearch, setBookSearch] = useState("");
    const [searchFocus, setSearchFocus] = useState(false);

    useEffect(() => {
        const getBooks = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/api/books');
                setBooks(response.data.data);
                setIsLoading(false);
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
            <div className='search-bar-container'>
                <input
                    id="hompage-search"
                    name="homepage-search" 
                    className='homepage-search-bar' 
                    placeholder='Discover a New Mystery...'
                    onChange={(e) => setBookSearch(e.target.value)}
                    onFocus={() => setSearchFocus(true)}
                    onBlur={() => setSearchFocus(false)}    
                />
            </div>
            {(searchFocus && bookSearch === "") || bookSearch !== ""
                ? (
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
                ) 
                : (
                    <>
                    <div id="best-sellers" className='category-title'>Best Sellers</div>
                    {isLoading ? (
                        <div className='placeholder-carousel'>
                            <div className="carousel-loading-ring">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Carousel maxIndex={1} sliderName="best-sellers">
                                {books && books.filter((book) => book.category === 'best seller')
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
                                                qty={book.avail_inventory} />
                                        )
                                }
                            </Carousel>
                        </>
                    )}
                    <div id="classics" className='category-title'>Classics</div>
                    {isLoading ? (
                        <div className='placeholder-carousel'>
                            <div className="carousel-loading-ring">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Carousel maxIndex={1} sliderName="classics">
                                {books && books.filter((book) => book.category === 'classics')
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
                            </Carousel>
                        </>
                    )}
                    </>
                )
            }
            
        </main>
    )
}

export default Home