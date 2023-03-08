import { useContext } from "react";
import AuthContext from '../context/ContextProvider';

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;