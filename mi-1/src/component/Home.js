import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../App.css'
import Image2 from './Image/HomeImage-2.jpg'
import Image from './Image/background.png'
import Footer from './Footer';



function Home() {

  useEffect(() => {
    return () => {
      // Remove leftover modal backdrop
      document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());

      // Reset body state
      document.body.classList.remove('modal-open');
      document.body.style.overflow = "auto";   // ✅ re-enable scroll
      document.body.style.removeProperty('padding-right');
    };
  }, []);


  return (
    <>
    <div className='button-container' style={{backgroundImage: `url(${Image})`,backgroundRepeat: 'repeat-y',backgroundSize: 'contain',width: '100%',height: "95vh"}}>
      <div style={{backgroundColor: "white", padding: "10px 40px", borderRadius: "40px",  boxShadow: '10px 20px 40px rgba(0, 0, 0, 0.2), 0 10px 15px rgba(0, 0, 0, 0.1)', border: "1px solid black"}}>
      <h1 className='mb-4' style={{textAlign: "center"}}>Mi Creator</h1>
      <div className='button-wrapper-container'>
        <div className="button-wrapper mx-2">
        <Link to="/mydrawing">
          <button className='Button'>
            <img className='Image'
              src="https://i.pinimg.com/originals/11/7e/2e/117e2ed7ebe96dd0c3838cfa10f07311.jpg"
              alt="Button Icon"
            />
          </button>
          </Link>
          <div className='button-text'>Start From Scratch</div>
        </div>
        <div className="button-wrapper mx-2">
          <Link to="/from-temp">
            <button className='Button'>
              <img className='Image'
                src={Image2}
                alt="Button Icon"
              />
            </button>
          </Link>
          <div className='button-text'>Generate From Template</div>
        </div>
        <div className="button-wrapper mx-2">
        <Link to="/from-dxf">
          <button className='Button'>
            <img className='Image'
              src="https://cdn-icons-png.flaticon.com/512/7448/7448106.png"
              alt="Button Icon"
            />
          </button>
        </Link>
          <div className='button-text'>From Dxf</div>
        </div>
      </div>
      </div>
      
    </div>
    <Footer/>
    </>
  );
}

export default Home;
