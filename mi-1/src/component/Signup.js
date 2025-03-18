import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../ulits';
import Image from './Image/background.png'
import ReCAPTCHA from "react-google-recaptcha"

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    phoneNo: '',
    password: '',
    company: '',
    department: '',
    designation: '',
  })
  const [confirmPassword, setConfirmPassword] = useState("");
  const [capVal, setCapVal] = useState(true)

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const copySignupInfo = {...signupInfo};
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo)
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("working")
    const {name, email, phoneNo, password, company, department, designation} = signupInfo;
   
    console.log(signupInfo)
    if(!name || !email || !password || !company){
      return handleError('Name, Email, Company or, password are required')
    }
    if(password !== confirmPassword){
      return handleError('password and confirm Password are not equil')
    }
    try {
      const url = "https://deploy-mi-test-api.vercel.app/auth/signup";
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
    <div className="d-flex justify-content-center align-items-center">
     <div style={{backgroundImage: `url(${Image})`,backgroundRepeat: 'repeat-y',backgroundSize: 'contain',width: '100%',height: "1100px"}}/>
      <div className="card shadow-3d p-4" style={{position: 'absolute', top: '20vh', width: '100%', maxWidth: '400px',  backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 10px 15px rgba(0, 0, 0, 0.1)',}}>
        <h2 className="text-center mb-2">MI Profile Generator<text style={{fontSize: "12px"}}>(Beta-2.0)</text></h2>
        <h2 className="text-center mb-4">Signup</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <div className="mb-3">
              <label htmlFor="name" className="form-label" style={{fontWeight: 'bold'}}>Name*</label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                style={{border: '1px solid black'}}
                autoFocus
                value={signupInfo.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="company" className="form-label" style={{fontWeight: 'bold'}}>Company Name*</label>
              <input
                type="text"
                name="company"
                id="company"
                className="form-control"
                style={{border: '1px solid black'}}
                value={signupInfo.company}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="department" className="form-label" style={{fontWeight: 'bold'}}>Department</label>
              <input
                type="text"
                name="department"
                id="department"
                className="form-control"
                style={{border: '1px solid black'}}
                value={signupInfo.department}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="designation" className="form-label" style={{fontWeight: 'bold'}}>Designation</label>
              <input
                type="text"
                name="designation"
                id="designation"
                className="form-control"
                style={{border: '1px solid black'}}
                value={signupInfo.designation}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNo" className="form-label" style={{fontWeight: 'bold'}}>Phone Number</label>
              <input
                type="number"
                name="phoneNo"
                id="phoneNo"
                className="form-control"
                style={{border: '1px solid black'}}
                value={signupInfo.phoneNo}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{fontWeight: 'bold'}}>Email*</label>
              <input
                type="text"
                name="email"
                id="email"
                className="form-control"
                style={{border: '1px solid black'}}
                value={signupInfo.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{fontWeight: 'bold'}}>Password*</label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                style={{border: '1px solid black'}}
                value={signupInfo.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label" style={{fontWeight: 'bold'}}>Confirm Password*</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="form-control"
                style={{border: '1px solid black'}}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <ReCAPTCHA sitekey='6Ld_MvMqAAAAAGVcZwC6VbsWSgAsO61kPvOGyQCa' onChange={val => setCapVal(val)}/>
            <button type="submit" className="btn btn-dark w-40 my-4"  disabled={!capVal}>Sign Up</button>
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


