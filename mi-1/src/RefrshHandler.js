import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RefrshHandler({ setIsAuthenticated, setLoading }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            // Decode the token to check expiration
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000; // Current time in seconds

            if (decodedToken.exp && decodedToken.exp > currentTime) {
                // Token is valid
                setIsAuthenticated(true);
                if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
                    navigate('/home', { replace: true });
                }
            } else {
                // Token is expired
                localStorage.removeItem('token');
                alert('Session expired. Please log in again.');
                setIsAuthenticated(false);
            }
        } else {
            // No token, ensure user is logged out
            setIsAuthenticated(false);
        }

        setLoading(false);
    }, [location, navigate, setIsAuthenticated, setLoading]);

    return null;
}

export default RefrshHandler;

