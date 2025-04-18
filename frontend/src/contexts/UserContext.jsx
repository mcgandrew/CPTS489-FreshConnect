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

    const logout = async () => {
        try {
            // Call the backend logout endpoint
            await fetch('http://localhost:4000/users/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Clean up client-side regardless of server response
            localStorage.removeItem('token');
            setRole(null);
            
            // Return true to indicate successful logout
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            
            // Even if the backend call fails, we still want to clean up the client
            localStorage.removeItem('token');
            setRole(null);
            
            // Return false if there was an error with the server call
            return false;
        }
    };

    // provide role to all children
    return (
        <UserContext.Provider value={{ role, setRoleAndToken, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };