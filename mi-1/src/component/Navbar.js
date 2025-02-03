import React, {useEffect, useState} from 'react';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import logo from './Image/logo.192.png';
import { handleSuccess } from '../ulits';
import { ToastContainer } from 'react-toastify';
import CollectData from '../CollectData';

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState('');
  const [users, setUsers] = useState([]);
  const [permission,setPermission] = useState(false)

  const isResetPasswordRoute = location.pathname.includes("/reset-password");

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'))
  },[])

  const handleLogout = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Loggout successfully')
    setTimeout(()=>{
      navigate('/login')
    },500)
  }

  return (
    <>
      <CollectData setUsers = {setUsers} setPermission = {setPermission}/>
      <nav className="navbar navbar-white" style={{backgroundColor: "#99FFFF"}}>
        <div className="container-fluid d-flex align-items-center justify-content-between flex-lg-row flex-column text-lg-start text-center">
          {/* Links Section */}
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            <Link className="nav-link active me-3" aria-current="page" to="/" onClick={(e) => {e.preventDefault();navigate(-1);}}  style={{fontWeight: "bold"}}><i className="fa-solid fa-arrow-left" style={{transform: 'translateY(0px) translateX(-4px)'}}></i>Back</Link>
            {currentPath!=='/login' && currentPath!=='/' && currentPath!=='/signup' && currentPath!=='/forgot-password' && !isResetPasswordRoute && <Link className="nav-link active me-3" aria-current="page" to="/home" style={{fontWeight: "bold"}}><i className="fa-solid fa-house" style={{transform: 'translateY(-1px) translateX(-4px)'}}></i>Home</Link>}
            {(currentPath==='/login' || currentPath==='/' || currentPath === '/signup' || currentPath === '/forgot-password' || isResetPasswordRoute) && <Link className="nav-link active me-3" aria-current="page" to="/"  style={{fontWeight: "bold"}}><i className="fa-solid fa-house" style={{transform: 'translateY(-1px) translateX(-4px)'}}></i>Home</Link>}
            {currentPath!=='/login' && currentPath!=='/' && currentPath!=='/signup' && currentPath!=='/forgot-password' && !isResetPasswordRoute &&  <button className="nav-link active me-3" onClick={handleLogout}  style={{fontWeight: "bold"}}><i className="fa-solid fa-user" style={{transform: 'translateY(-1px) translateX(-4px)'}}></i>Logout</button>}
            {(currentPath==='/login' || currentPath==='/' || currentPath === '/signup' || currentPath === '/forgot-password' || isResetPasswordRoute) && <Link className="nav-link active me-3" aria-current="page" to="/login"  style={{fontWeight: "bold"}}><i className="fa-solid fa-user" style={{transform: 'translateY(-1px) translateX(-4px)'}}></i>Login</Link>}
            {(currentPath==='/login' || currentPath==='/'  || currentPath === '/signup' || currentPath === '/forgot-password' || isResetPasswordRoute) && <Link className="nav-link active me-3" aria-current="page" to="/signup"  style={{fontWeight: "bold"}}><i className="fa-solid fa-user-plus"  style={{transform: 'translateY(-1px) translateX(-4px)'}}></i>Sign Up</Link>}
            {currentPath!=='/login' && currentPath!=='/' && currentPath!=='/signup' && permission && currentPath!=='/forgot-password' && !isResetPasswordRoute && <Link className="nav-link active me-3" aria-current="page" to="/manager_deshboard" style={{fontWeight: "bold"}}><i className="fa-solid fa-gear" style={{transform: 'translateY(0px) translateX(-4px)'}}></i>Admin Panel</Link>}
          </div>
          
          {/* Logo Section */}
          <img src={logo} style={{ width: '211px', height: '50px' }} alt="MI Logo" />
        </div>
      </nav>
      <hr style={{ border: '2px solid black', margin: "0" }} />
      
      {/* Inline CSS for responsive design */}
      <style>
        {`
          @media (max-width: 768px) {
            .navbar .container-fluid {
              flex-direction: column;
              align-items: center;
            }
            .navbar h2 {
              margin: 10px 0;
            }
          }
        `}
      </style>
      <ToastContainer/>
    </>
  );
}

export default Navbar;
