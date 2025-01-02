import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../App.css'



function Home() {
  return (
    <div className='button-container' style={{transform: 'translateY(-30px)'}}>
      <h1 className='mb-4'>MI Profile Generator</h1>
      <div className='button-wrapper-container'>
        <div className="button-wrapper mx-2">
        <Link to="/from_scratch">
          <button className='Button'>
            <img className='Image'
              src="https://i.pinimg.com/originals/11/7e/2e/117e2ed7ebe96dd0c3838cfa10f07311.jpg"
              alt="Button Icon"
            />
          </button>
          </Link>
          <div className='button-text'>From Scratch</div>
        </div>
        <div className="button-wrapper mx-2">
          <Link to="/from-temp">
            <button className='Button'>
              <img className='Image'
                src="https://cdn0.iconfinder.com/data/icons/metal-and-steel-products-elasto-font-next-2020/16/14_i-beam-bar-512.png"
                alt="Button Icon"
              />
            </button>
          </Link>
          <div className='button-text'>From Temp</div>
        </div>
        <div className="button-wrapper mx-2">
          <button className='Button'>
            <img className='Image'
              src="https://cdn-icons-png.flaticon.com/512/7448/7448106.png"
              alt="Button Icon"
            />
          </button>
          <div className='button-text'>From Dxf</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
