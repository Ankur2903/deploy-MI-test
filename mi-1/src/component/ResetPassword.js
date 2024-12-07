import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../ulits';

function ResetPassword() {
    const [password,setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate()
    const {id, token} = useParams()
    
 
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
          const url = `https://deploy-mi-test-api.vercel.app/reset-password/${id}/${token}`;
          const response = await fetch(url, {
            method: "post",
            headers: {
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({password, confirmPassword})
          }
        )
          const result = await response.json();
          const {success, message} = result;
          if(success){
            handleSuccess("Password reset Successfully");
            setTimeout(()=>{
              navigate('/login')
            },500)
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
        <h1 className="text-center mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{fontWeight: 'bold'}}>Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                style={{border: '1px solid black'}}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{fontWeight: 'bold'}}> Confirm Password</label>
              <input
                type="password"
                name="confirm password"
                id="confirm password"
                className="form-control"
                style={{border: '1px solid black'}}
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-dark w-40 my-4">Update Password</button>
          </fieldset>
        </form>
        <ToastContainer/>
      </div>
    </div>
  );
}

export default ResetPassword;

