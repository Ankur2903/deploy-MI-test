import React, {useEffect, useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from './Image/logo.192.jpg';
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
  useEffect(() => {
    console.log("permission", permission)
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
      <nav className="navbar navbar-white bg-white">
        <div className="container-fluid d-flex align-items-center justify-content-between flex-lg-row flex-column text-lg-start text-center">
          {/* Links Section */}
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            {currentPath!=='/login' && currentPath!=='/signup' && <Link className="nav-link active me-3" aria-current="page" to="/" style={{fontWeight: "bold"}}>Home</Link>}
            {currentPath!=='/login' && currentPath!=='/signup' && permission && <Link className="nav-link active me-3" aria-current="page" to="/manager_deshboard" style={{fontWeight: "bold"}}>Deshboard</Link>}
            <Link className="nav-link active me-3" aria-current="page" to="/" onClick={(e) => {e.preventDefault();navigate(-1);}}  style={{fontWeight: "bold"}}>Back</Link>
           
            {currentPath!=='/login' && currentPath!=='/signup' && <button className="nav-link active me-3" onClick={handleLogout}  style={{fontWeight: "bold"}}>Logout</button>}
            {(currentPath==='/login' || currentPath === '/signup') && <Link className="nav-link active me-3" aria-current="page" to="/login"  style={{fontWeight: "bold"}}>Login</Link>}
            {(currentPath==='/login' || currentPath === '/signup') && <Link className="nav-link active me-3" aria-current="page" to="/signup"  style={{fontWeight: "bold"}}>Sign Up</Link>}
          </div>
          
          {/* Centered Title */}
          <h2 className="mb-2 mb-lg-0">Section Characteristics Calculator</h2>
          
          {/* Logo Section */}
          <img src={logo} style={{ width: '211px', height: '50px' }} alt="MI Logo" />
        </div>
      </nav>
      <hr style={{ border: '2px solid black' }} />
      
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


