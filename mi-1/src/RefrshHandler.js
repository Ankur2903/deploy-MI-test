import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function RefrshHandler({ setlsAuthenticated } ) {
    const location = useLocation()
    const navigate = useNavigate();
    
    useEffect(() => {
        if (localStorage.getItem( 'token')) {
            setlsAuthenticated(true);
            if (location.pathname === '/login' || location.pathname === '/signup'){
                navigate('/',{ replace: false });
            }
        }
    },[location, navigate, setlsAuthenticated])
    return(
        null
    )
}

export default RefrshHandler