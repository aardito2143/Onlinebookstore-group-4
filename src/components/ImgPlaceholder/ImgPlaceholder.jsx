import { useState } from "react";
import './ImgPlaceholder.css';

export default function ImgPlaceholder (props) {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = () => {
        setIsLoading(false);
    }

    return (
        <>
            {isLoading ? (
                <div 
                    className={props.name}
                    style={
                        { 
                            width: props.width, 
                            height: props.height,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.2)'
                        }
                    }>
                        <div 
                            className="img-loader-ring"
                            id={props.customId || 'img-loader-ring'}>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                        </div>
                        <img
                            src={props.src}
                            style={{ display: "none" }}
                            onLoad={handleLoad}
                            alt="placeholder"
                        />
                </div>
            ) : (
                <img
                    className={props.name}
                    src={props.src} 
                    style={{ width: props.width, height: props.height}} 
                    onLoad={handleLoad}
                    alt={props.src}
                />
            )}
        </>
    );
}