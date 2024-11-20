import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../ulits';

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
    console.log(loginInfo)
    if(!email || !password){
      return handleError('Email, or, password are required')
    }
    try {
      const url = "https://deploy-mi-test-api.vercel.app/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(loginInfo)
      })
      const result = await response.json();
      const {success, message, jwtToken, name, error} = result;
      if(success){
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name)
        setTimeout(()=>{
          navigate('/')
        },500)
      }else if(error){
          const details = error?.details[0].message;
          handleError(details)
      }else if(!success){
        handleError(message)
      }
      console.log(result)
    }
    catch(err) {
      handleError("hello");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="text-center mb-4">Login_1</h1>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                placeholder="Enter Your Email"
                value={loginInfo.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                placeholder="Enter Your Password"
                value={loginInfo.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-dark w-100">Login</button>
          </fieldset>
        </form>
        <ToastContainer/>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
