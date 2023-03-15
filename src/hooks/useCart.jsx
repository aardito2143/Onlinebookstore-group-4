import useAuth from "./useAuth";

const useCart = () => {
    const { cart, setCart } = useAuth();

    const addToCart = async (item) => {
        setCart(prev => {
            return [...prev, item];
        });
    }

    console.log(cart);
    return addToCart;
};

export default useCart;