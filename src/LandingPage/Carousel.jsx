import React from 'react';
import Slider from 'react-slick';

import book1 from './images/book1.jpg';
import book2 from './images/book2.jpg';
import book3 from './images/book3.jpg';

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
                    <img src={book1} alt="Book 1" />
                </div>
                <div>
                    <img src={book2} alt="Book 2" />
                </div>
                <div>
                    <img src={book3} alt="Book 3" />
                </div>
            </Slider>
        </div>
    );
};

export default Carousel;
