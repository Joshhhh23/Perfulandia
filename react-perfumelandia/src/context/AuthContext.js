import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const savedRole = localStorage.getItem('role');
        const savedEmail = localStorage.getItem('email');
        if (token && savedRole) {
            setUser({ role: savedRole, email: savedEmail });
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) 
            });

            if (!response.ok) throw new Error('Credenciales incorrectas');

            const data = await response.json();
            
            const receivedToken = data.access_token || data.token; 
            const receivedRole = data.user?.role || data.role || 'user'; 

            setToken(receivedToken);
            setUser({ role: receivedRole, email: email });

            localStorage.setItem('token', receivedToken);
            localStorage.setItem('role', receivedRole);
            localStorage.setItem('email', email);
            
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}