import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../ulits';

function ForgotPassword() {
    const [email,setEmail] = useState("");
 
    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!email)  return handleError("Email is required");
        console.log(email)
        try{
          const url = "https://deploy-mi-test-api.vercel.app/forgot-password";
          const response = await fetch(url, {
            method: "POST",
            headers: {
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({email})
          }
        )
        const result = await response.json();
        const {success, message} = result;
        console.log(result)
        if(success){
          handleSuccess(message);
        }
        else{
          handleError(message);
        }
        }
        catch(err) {
          handleError(err);
        }
    }

  return (
    <div className="d-flex justify-content-center align-items-center vh-99">
      <div className="card shadow-3d p-4" style={{position: 'absolute', top: '25vh', width: '100%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 10px 15px rgba(0, 0, 0, 0.1)'}}>
        <h1 className="text-center mb-4">Forgot Password</h1>
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
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-dark w-40 my-4">Send Email</button>
          </fieldset>
        </form>
        <ToastContainer/>
        <p className="text-center">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

