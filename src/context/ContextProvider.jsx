import { createContext, useState } from "react";

const AuthContext = createContext({});

export const ContextProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [cart, setCart] = useState([]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, cart, setCart }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;