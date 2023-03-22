import useAuth from "./useAuth";
import axios from "../api/axios";
import { toast } from "react-toastify";

const useCart = () => {
    const { cart, setCart, auth } = useAuth();

    const getCart = async () => {
        if (auth?.accessToken) {
            try {
                const response = await axios('/api/cart');
                setCart(response.data);
            } catch (err) {
                if(!err?.response) {
                    toast.error('Server Connection Timed Out');
                } else if (err?.response?.status === 400) {
                    toast.error('Failed to fetch the cart');
                }
            }
        } else {
            setCart([]);
        }
    }

    const addToCart = async (item) => {
        const existingItem = cart.find((cartItem) => cartItem.id === item.id);
        if (existingItem && existingItem.quantity >= item.avail_inventory){
            toast.error("Couldn't Add Item to Cart: Exceeds Available Stock")
            return;
        }

        if (existingItem) {
            if(auth?.accessToken){
                // eslint-disable-next-line
                const updateResponse = await toast.promise(axios.put(`/api/cart/${existingItem.id}`,
                        { set: false }), {
                            pending: 'Adding item to cart...',
                            success: `Successfully added ${item.title} to cart!`,
                            error: 'Something went wrong'
                        });
            }
            const updatedCart = cart.map((cartItem) => {
                if (cartItem.id === existingItem.id) {
                    return { ...cartItem, quantity: cartItem.quantity + 1 };
                }
                return cartItem
            });
            setCart(updatedCart);
        } else {
            try {
                if(auth?.accessToken){
                    // eslint-disable-next-line
                    const response = await toast.promise(axios.post('/api/cart', { item }), {
                        pending: 'Adding item to cart...',
                        success: `Successfully added ${item.title} to cart!`,
                        error: 'Something went wrong'
                    });
                }
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
        try {
            if (auth?.accessToken) {
                // eslint-disable-next-line
                const deleteResponse = await toast.promise(axios.delete(`/api/cart/${id}`), {
                    pending: 'Removing item(s) from cart',
                    success: 'Successfully removed item(s) from cart!',
                    error: 'Something went wrong.'
                });
            }
        } catch (err) {
            if(!err?.response) {
                toast.error('Server Connection Timed Out');
            } else {
                toast.error('Failed to remove item from cart.');
            }
            return;
        }

        setCart(prevCart => prevCart.filter(cartItem => cartItem.id !== id));
    };

    const updateCartItemQuantity = async (id, newQuantity) => {
        const existingItem = cart.find((cartItem) => cartItem.id === id);
        if (newQuantity === existingItem.quantity){
            return existingItem.quantity;
        }
        
        if (newQuantity > existingItem.avail_inventory){
            toast.error("Couldn't Update Item Quantity: Exceeds Available Stock");
            return existingItem.quantity;
        }
        
        try {
            if (auth?.accessToken){
            // eslint-disable-next-line
                const updateResponse = await toast.promise(axios.put(`/api/cart/${id}`,
                    { set: true, quantity: newQuantity }), {
                        pending: 'Updating item quantity...',
                        success: 'Successfully updated the quantity of the item!',
                        error: 'Something went wrong'
                });
            }
        } catch (err) {
            if(!err?.response) {
                toast.error('Server Connection Timed Out');
            } else {
                toast.error('Failed to update quantity of the item');
            }
        }
        
        setCart(prevCart => {
            const updatedCart = [...prevCart];
            const cartItem = updatedCart.find(cartItem => cartItem.id === id);

            if (cartItem) {
                cartItem.quantity = newQuantity;
            }
            return updatedCart;
        });

        return newQuantity;
    }

    const totalQuantity = cart.reduce((total, cartItem) => total + cartItem.quantity, 0);

    const totalCost = cart.reduce((total, cartItem) => total + (Number(cartItem.cost) * cartItem.quantity), 0);
    
    return {
        getCart,
        addToCart,
        removeCartItem,
        updateCartItemQuantity,
        totalCost, 
        totalQuantity 
    };
};

export default useCart;