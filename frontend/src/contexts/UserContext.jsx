import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [role, setRole] = useState(null); // tracking role constantly

    useEffect(() => {
        // get token and set role
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken?.role || 'user');
        }
    }, []);

    const setRoleAndToken = (token) => {
        // dynamically update role and token
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
        localStorage.setItem('token', token);
    };

    // provide role to all children
    return (
        <UserContext.Provider value={{ role, setRoleAndToken }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };