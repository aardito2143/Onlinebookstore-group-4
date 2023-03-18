import { useState, useEffect } from 'react';
import useCart from '../../hooks/useCart';
import BookItem from '../../components/BookItem/BookItem';
import { toast } from 'react-toastify';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import axios from '../../api/axios';
import "./Home.css";

const Home = () => {
    const [books, setBooks] = useState([]);
    const { addToCart } = useCart();

    const responsive = {
        desktop: {
            breakpoint: {
                max: 4000,
                min: 0
            },
            items: 2,
            slidesToSlide: 5
        }
    }

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
            <div className='category-title'>Best Sellers</div>
            <Carousel
                responsive={responsive}
                swipeable={false}
                draggable={false}
                showDots={true}
                infinite={false}
                autoPlay={false}
                keyBoardControl={true}
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={['tablet', 'mobile']}
                dotListClass="custom-dot-list-style"
                itemClass='carousel-items'>
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
                            />
                        )
                    }
            </Carousel>
            <div className='category-title'>Classics</div>
            <Carousel
                responsive={responsive}
                swipeable={false}
                draggable={false}
                showDots={true}
                ssr={true}
                infinite={false}
                autoPlay={false}
                keyBoardControl={true}
                customTransition="ease-in-out all .5"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={['tablet', 'mobile']}
                deviceType='desktop'
                dotListClass="custom-dot-list-style"
                itemClass='carousel-items'>
                    <p>Classics go here!</p>  
            </Carousel>
        </main>
    )
}

export default Home