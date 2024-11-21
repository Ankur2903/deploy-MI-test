import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../ulits';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  })

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("hello")
    const copySignupInfo = {...signupInfo};
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo)
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const {name, email, password} = signupInfo;
    console.log("hello:")
    if(!name || !email || !password){
      return handleError('Name, Email, or, password are required')
    }
    try {
      const url = "https://deploy-mi-test-api.vercel.app//auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(signupInfo)
      })
      const result = await response.json();
      const {success, message, error} = result;
      if(success){
        handleSuccess(message);
        setTimeout(()=>{
          navigate('/login')
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
      handleError(err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="text-center mb-4">Signup</h1>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                placeholder="Enter Your Name"
                autoFocus
                value={signupInfo.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                placeholder="Enter Your Email"
                value={signupInfo.email}
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
                value={signupInfo.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-dark w-100">Sign Up</button>
          </fieldset>
        </form>
        <ToastContainer/>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
