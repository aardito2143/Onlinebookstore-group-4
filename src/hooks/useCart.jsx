import useAuth from "./useAuth";
import axios from "../api/axios";
import { toast } from "react-toastify";

const useCart = () => {
    const { cart, setCart } = useAuth();

    const addToCart = async (item) => {
        const existingItem = cart.find((cartItem) => cartItem.id === item.id);

        if (existingItem) {
            const updateResponse = await axios.put(`/api/cart/${existingItem.id}`,
                    { set: false });
            console.log(updateResponse?.data);
            const updatedCart = cart.map((cartItem) => {
                if (cartItem.id === existingItem.id) {
                    return { ...cartItem, quantity: cartItem.quantity + 1 };
                }
                return cartItem
            });
            setCart(updatedCart);
            toast.success(`Successfully added ${item.title} to cart!`);
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

    const removeCartItem = async (id) => {
        setCart(prevCart => prevCart.filter(cartItem => cartItem.id !== id));

        try {
            const deleteResponse = await axios.delete(`/api/cart/${id}`);
            console.log(deleteResponse?.data);
            toast.success('Successfully removed item(s) from cart!');
        } catch (err) {
            if(!err?.response) {
                toast.error('Server Connection Timed Out');
            } else {
                toast.error('Failed to remove item from cart.');
            }
        }
    };

    const updateCartItemQuantity = async (id, newQuantity) => {
        setCart(prevCart => {
            const updatedCart = [...prevCart];
            const cartItem = updatedCart.find(cartItem => cartItem.id === id);

            if (cartItem) {
                cartItem.quantity = newQuantity;
            }
            return updatedCart;
        });
        
        try {
            const updateResponse = await axios.put(`/api/cart/${id}`,
                                { set: true, quantity: newQuantity });
            console.log(updateResponse?.data);
            toast.success('Successfully updated the quantity of the item!');
        } catch (err) {
            if(!err?.response) {
                toast.error('Server Connection Timed Out');
            } else {
                toast.error('Failed to update quantity of the item');
            }
        }
        
    }

    const totalQuantity = cart.reduce((total, cartItem) => total + cartItem.quantity, 0);

    const totalCost = cart.reduce((total, cartItem) => total + (Number(cartItem.cost) * cartItem.quantity), 0);

    console.log(cart);
    return { 
        addToCart,
        removeCartItem,
        updateCartItemQuantity,
        totalCost, 
        totalQuantity 
    };
};

export default useCart;