import axios from "../api/axios";
import useAuth from "./useAuth";
import { toast } from "react-toastify";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});

        try {
            // eslint-disable-next-line
            const response = await toast.promise(axios('/api/logout', {
                withCredentials: true
            }), {
                pending: 'Attempting to sign out...',
                success: 'Successfully signed out!',
                error: 'Something went wrong'
            });
        } catch (err) {
            console.log(err);
        }
    }

    return logout;
}

export default useLogout;