import { useState, useRef } from "react";
import "./Carousel.css";

export default function Carousel (props) {
    const [sliderIndex, setSliderIndex] = useState(0);
    const maxIndex = props.maxIndex;
    const sliderRef = useRef(null);

    const incrementSliderIndex = () => {
        if (sliderIndex >= maxIndex) {
            setSliderIndex(0);
            return;
        }

        setSliderIndex(sliderIndex + 1);
    }

    const decrementSliderIndex = () => {
        if (sliderIndex <= 0) {
            setSliderIndex(maxIndex);
            return;
        }

        setSliderIndex(sliderIndex - 1);
    }

    return (
        <div className='carousel-wrapper'>
            <div className='carousel-container'>
                <button 
                    className="handle left-handle"
                    onClick={decrementSliderIndex}>
                    <svg className='handle-arrow' xmlns="http://www.w3.org/2000/svg" height="40" width="40" style={{ fill: "#f7fbf5" }}>
                        <path d="M27.083 36.667 10.417 20 27.083 3.333l2.542 2.584L15.542 20l14.083 14.083Z"/>
                    </svg>
                </button>
                <div 
                    className="carousel-slider" 
                    style={
                        {
                            [`--${props.sliderName}-slider-index`]: sliderIndex,
                            transform: `translateX(calc(var(--${props.sliderName}-slider-index) * -100%))`
                        }
                    }
                    ref={sliderRef}>
                    {props.children}
                </div>
                <button 
                    className="handle right-handle"
                    onClick={incrementSliderIndex}>
                    <svg className='handle-arrow' xmlns="http://www.w3.org/2000/svg" height="40" width="40" style={{ fill: "#f7fbf5" }}>
                        <path d="m12.917 36.625-2.542-2.583 14.083-14.084L10.375 5.833l2.542-2.541 16.666 16.666Z"/>
                    </svg>
                </button>
            </div>
            <div className="carousel-position-markers">
                <div className={`carousel-position-marker ${(sliderIndex === 0 ? "active" : "")}`}></div>
                <div className={`carousel-position-marker ${(sliderIndex === 1 ? "active" : "")}`}></div>
            </div>
        </div>
    );
}