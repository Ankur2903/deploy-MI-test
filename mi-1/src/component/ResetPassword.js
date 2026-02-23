import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {UserPasswordReset} from '../services/Auth'

function ResetPassword() {
  const navigate = useNavigate();
    const [password,setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const {id, token} = useParams()
    
 
    const handleSubmit = async(e) => {
        e.preventDefault();
        const result = await UserPasswordReset({id, token, password, confirmPassword});
        if(result){
          setTimeout(()=>{
              navigate('/login')
          },500)
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

