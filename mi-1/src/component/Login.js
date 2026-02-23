import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError } from '../ulits';
import Image from './Image/background.png'
import {UserLogin} from '../services/Auth';

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copySignupInfo = {...loginInfo};
    copySignupInfo[name] = value;
    setLoginInfo(copySignupInfo)
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const {email, password} = loginInfo;
    if(!email || !password){
      return handleError('Email, or, password are required')
    }
    const result = await UserLogin({loginInfo});
    if(result){
      setTimeout(()=>{
            navigate('/')
        },500)
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-99">
      <div style={{backgroundImage: `url(${Image})`,backgroundRepeat: 'repeat-y',backgroundSize: 'contain',width: '100%',height: "95vh"}}/>
      <div className="card shadow-3d p-4" style={{position: 'absolute', top: '20vh', width: '100%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '10px 20px 40px rgba(0, 0, 0, 0.2), 0 10px 15px rgba(0, 0, 0, 0.1)'}}>
        <h2 className="text-center mb-2">MI Profile Generator<text style={{fontSize: "12px"}}>(1.1)</text></h2>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{fontWeight: 'bold'}}>Email</label>
              <input
                type="text"
                name="email"
                id="email"
                className="form-control"
                style={{border: '1px solid black'}}
                value={loginInfo.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{fontWeight: 'bold'}}>Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                style={{border: '1px solid black'}}
                value={loginInfo.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-dark w-40 my-4">Login</button>
          </fieldset>
        </form>
        <ToastContainer/>
        <p className="text-center mt-3">
          <Link to="/forgot-password">Forgot your password</Link>
        </p>
        <p className="text-center">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
