import useAuth from "./useAuth";
import axios from "../api/axios";
import { toast } from "react-toastify";

const useCart = () => {
    const { cart, setCart } = useAuth();

    const addToCart = async (item) => {
        const existingItem = cart.find((cartItem) => cartItem.id === item.id);

        if (existingItem) {
            const updatedCart = cart.map((cartItem) => {
                if (cartItem.id === existingItem.id) {
                    return { ...cartItem, quantity: cartItem.quantity + 1 };
                }
                return cartItem
            });
            setCart(updatedCart);
        } else {
            try {
                console.log(item);
                const response = await axios.post('/api/cart', { item });
                console.log(response?.data);
                toast.success(`Successfully added ${item.title} to cart!`);
                setCart([...cart, { ...item, quantity: 1 }]);
            } catch (err) {
                if (!err?.response) {
                    toast.error('Server Connection Timed Out');
                } else if (err?.response?.status === 403) {
                    toast.error('You lack sufficient priveleges to make this request');
                } else {
                    toast.error('Failed to Add Product to Cart');
                }
            }

            
        }
    }

    console.log(cart);
    return addToCart;
};

export default useCart;