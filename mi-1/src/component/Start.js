import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../App.css'
import Image from './Image/Screenshot 2025-01-31 105054.png'
import { Center } from '@react-three/drei';


function Start() {
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "76vh"}}>
    {/* Background Image */}
    <img src={Image} alt="Background" style={{width: "100vw", objectFit: "cover" }}/>
    <Link to="/login" style={{position: 'absolute', objectFit: "cover", maxWidth: "80vw" , boxShadow: "20px 20px 40px rgba(0, 0, 0, 0.2), 0 10px 15px rgba(0, 0, 0, 0.1)", borderRadius: "4vw", padding: "2vw", border: "0", backgroundColor: "rgba(255, 255, 255, 0.9)", textDecoration: "none"}}>
      <h2 style={{fontSize: "clamp(1rem, 3vw, 3rem)", fontWeight: "bold", color: "black",textAlign: "center"}}>Welcome to MI Profile Generator</h2>
    <h3 style={{fontSize: "clamp(1rem, 3vw, 3rem)", color: "black",textAlign: "center"}}>Click here to Login</h3></Link>
   
    </div>
  );
}

export default Start;