import React from 'react';
import Slider from 'react-slick';

const Carousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    };

    return (
        <div>
            <h2>Top Selling Books</h2>
            <Slider {...settings}>
                <div>
                    <img src='/images/book_placeholder.PNG' alt="Book 1" />
                </div>
                <div>
                    <img src='/images/book_placeholder.PNG' alt="Book 2" />
                </div>
                <div>
                    <img src='/images/book_placeholder.PNG' alt="Book 3" />
                </div>
            </Slider>
        </div>
    );
};

export default Carousel;
