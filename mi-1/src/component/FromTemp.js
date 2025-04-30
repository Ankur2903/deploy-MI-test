import React from 'react';
import { useEffect, useState } from "react";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import image1 from './Image/Image-1.png';
import image2 from './Image/Image-2.png';
import image3 from './Image/Image-3.png';
import image4 from './Image/Image-4.png';
import image5 from './Image/Image-5.png';
import image6 from './Image/Image-6.png';
import image7 from './Image/Image-7.png';
import image8 from './Image/Image-8.png';
import image9 from './Image/Image-9.png';
import image10 from './Image/Image-10.png';
import image11 from './Image/Image-11.png';
import image12 from './Image/Image-12.png';
import image13 from './Image/Image-13.png';
import image14 from './Image/Image-14.png';
import image15 from './Image/Image-15.png';
import image16 from './Image/Image-16.png';
import image17 from './Image/Image-17.jpg';
import image18 from './Image/Image-18.jpg';
import image19 from './Image/Image-19.jpg';
import image20 from './Image/Image-20.jpg';
import image21 from './Image/Image-21.jpg';
import image22 from './Image/Image-22.jpg';
import image23 from './Image/Image-23.jpg';
import image24 from './Image/Image-24.png';
import image25 from './Image/Image-25.png';
import image26 from './Image/Image-26.png';
import image27 from './Image/Image-27.png';
import image28 from './Image/Image-28.png';
import image29 from './Image/Image-29.png';
import image30 from './Image/Image-30.png';
import image31 from './Image/Image-31.png';
import image32 from './Image/Image-32.png';
import image33 from './Image/Image-33.png';
import image34 from './Image/Image-34.png';
import image35 from './Image/Image-35.png';
import image36 from './Image/Image-36.png';
import image37 from './Image/Image-37.png';
import image38 from './Image/Image-38.png';
import image39 from './Image/Image-39.png';
import image40 from './Image/Image-40.png';
import image41 from './Image/Image-41.png';


const Button = styled.button`
  padding: 10px 15px;
  display: flex;
  align-items: center;
  border: 2px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #000000;
  }
`;

const ButtonWrapperContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 20px;

  @media (max-width: 1024px) {
    gap: 15px;
  }

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 10px; /* Tight spacing for mobile */
  }
`;

const Image = styled.img`
  width: 150px;
  height: 150px;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const Heading = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;

  @media (max-width: 768px) {
    margin-bottom: 15px;
    font-size: 22px;
  }

  @media (max-width: 480px) {
    margin-bottom: 10px;
    font-size: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
`;

const ButtonText = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: bold;
  margin-top: 8px;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  max-width: 25%; /* Ensures that only 4 items per line */

  @media (max-width: 1024px) {
    max-width: 33.33%; /* Adjust for smaller screens */
  }

  @media (max-width: 768px) {
    max-width: 50%; /* Adjust for smaller screens */
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    max-width: 100%; /* Adjust for mobile screens */
     margin-bottom: 10px; /* Add bottom spacing */
  }
`;

function FromTemp() {

    const containerStyle = {
      display: "flex",
      height: "100vh", // Full viewport height
      // margin: 0,
      // padding: 0,
    };
  
    const leftStyle = {
      flex: 1, // Takes half the space
      padding: "10px"
    };
  
    const rightStyle = {
      flex: 1, // Takes half the space
      padding: "10px"
    };

    const [dividerHeight, setDividerHeight] = useState(0);
  
    useEffect(() => {
      const updateHeight = () => {
        const height = document.documentElement.scrollHeight - 10;
        setDividerHeight(height);
      };
  
      requestAnimationFrame(updateHeight); // waits for layout to finish
  
      // Optional: add resize listener if height may change dynamically
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }, []); 

    const dividerStyle = {
      width: "2px", // Thin vertical line
      backgroundColor: 'black', // Black color for the line
      height: `${dividerHeight - 60}px`
    };

  return (
    <ButtonContainer>
      <div style={containerStyle}>
      <div style={leftStyle}>
      <Heading>Close Shapes</Heading>
      <ButtonWrapperContainer className='col-md-12'>      
        {/* <!-- Button trigger modal --> */}
        <ButtonWrapper>
          <Button type="button" className="btn btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <Image src={image3} alt="Description of Image" />
          </Button>
          <ButtonText>Round Tube</ButtonText>
        </ButtonWrapper>
        {/* <!-- Modal --> */}
        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Round Tube</h3>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <ButtonWrapperContainer className='col-md-11'>
                  <ButtonWrapper>
                    <Link to="/round">
                      <Button data-bs-dismiss="modal">
                        <Image src={image3} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Round Tube</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/round-4">
                      <Button data-bs-dismiss="modal">
                        <Image src={image29} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Pipe Lappet</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/elliptical">
                      <Button data-bs-dismiss="modal">
                        <Image src={image9} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Elliptical</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/flat_oval">
                      <Button data-bs-dismiss="modal">
                        <Image src={image10} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Flat Oval</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/round-1">
                      <Button data-bs-dismiss="modal">
                        <Image src={image19} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Water Drop</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/round-2">
                      <Button data-bs-dismiss="modal">
                        <Image src={image21} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Segmented Arc-end Tube</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/round-3">
                      <Button data-bs-dismiss="modal">
                        <Image src={image23} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Hand Rail</ButtonText>
                  </ButtonWrapper>
                </ButtonWrapperContainer>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        
        
        <ButtonWrapper>
          <Link to="/square">
            <Button>
              <Image src={image4} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Square Tube</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/rectangle">
            <Button>
              <Image src={image2} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Rectangle Tube</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/d_section">
            <Button>
              <Image src={image33} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>D Section(Featherlite)</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/triangular">
            <Button>
              <Image src={image11} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Triangular Tube</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/d_shap">
            <Button>
              <Image src={image13} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>D-Shaped Section</ButtonText>
        </ButtonWrapper>

        
        <ButtonWrapper>
          <Button type="button" className="btn btn" data-bs-toggle="modal" data-bs-target="#exampleModal3">
            <Image src={image14} alt="Description of Image" />
          </Button>
          <ButtonText>Guide Rail Sections</ButtonText>
        </ButtonWrapper>
        <div className="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Guide Rail Sections</h3>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <ButtonWrapperContainer className='col-md-11'>
                  <ButtonWrapper>
                    <Link to="/t_shap_2">
                      <Button data-bs-dismiss="modal">
                        <Image src={image14} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Tube-1</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/t_shap">
                      <Button data-bs-dismiss="modal">
                        <Image src={image27} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Tube-2</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/t_shap_3">
                      <Button data-bs-dismiss="modal">
                        <Image src={image28} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Tube-3</ButtonText>
                  </ButtonWrapper>
                </ButtonWrapperContainer>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>




        <ButtonWrapper>
          <Link to="/figure_of_eight">
            <Button>
              <Image src={image15} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Butterfly Section</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/double_center_mullion">
            <Button>
              <Image src={image37} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Double Center Mullion</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/beam-window-frame">
            <Button>
              <Image src={image24} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Beam Window Frame</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/beam-window-frame-1">
            <Button>
              <Image src={image38} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>40*20*10*1.0 Section</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/z-section">
            <Button>
              <Image src={image40} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Z Section</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/waist-rail-section">
            <Button>
              <Image src={image39} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Waist Rail Section</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/stiffner">
            <Button>
              <Image src={image25} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Stiffner</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/good-knight-tube">
            <Button>
              <Image src={image26} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Good Knight Tube</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/sole-bar-section">
            <Button>
              <Image src={image41} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Sole Bar Section</ButtonText>
        </ButtonWrapper>
      </ButtonWrapperContainer>
      </div>

      <div style={dividerStyle}></div>


      <div style={rightStyle}>
      <Heading>Open Shapes</Heading>
      <ButtonWrapperContainer  className='col-md-12'>
      <ButtonWrapper>
          <Button type="button" className="btn btn" data-bs-toggle="modal" data-bs-target="#exampleModal2">
            <Image src={image1} alt="Description of Image" />
          </Button>
          <ButtonText>Angle Profile</ButtonText>
        </ButtonWrapper>
        {/* <!-- Modal --> */}
        <div className="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Angle Profile</h3>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <ButtonWrapperContainer className='col-md-11'>
                  <ButtonWrapper>
                    <Link to="/l-angle">
                      <Button data-bs-dismiss="modal">
                        <Image src={image1} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>L Angle</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/l-angle-1">
                      <Button data-bs-dismiss="modal">
                        <Image src={image16} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>U-Channel Profile</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/l-angle-2">
                      <Button data-bs-dismiss="modal">
                        <Image src={image17} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Double U-Channel</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/l-angle-3">
                      <Button data-bs-dismiss="modal">
                        <Image src={image18} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Step Beam</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/l-angle-4">
                      <Button data-bs-dismiss="modal">
                        <Image src={image20} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Track Profile</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/l-angle-5">
                      <Button data-bs-dismiss="modal">
                        <Image src={image22} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Z-Shape Profile</ButtonText>
                  </ButtonWrapper>        
                </ButtonWrapperContainer>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        <ButtonWrapper>
          <Link to="/c-channel">
            <Button>
              <Image src={image5} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Lip Channel</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/u-channel">
            <Button>
              <Image src={image6} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>U-Channel</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/al-lip-channel">
            <Button>
              <Image src={image35} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>AL-Lip Channel</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/triangular-slit">
            <Button>
              <Image src={image7} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Triangular Slit</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/Door_channel">
            <Button>
              <Image src={image8} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Door Channel</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/stiffner_front_edge">
            <Button>
              <Image src={image30} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Stiffner-Front Edge</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/door_edge_profile">
            <Button>
              <Image src={image31} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Door Edge Profile</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/top_hat">
            <Button>
              <Image src={image12} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Top Hat Section</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/cover_tray">
            <Button>
              <Image src={image36} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Cover Tray</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/thcm_m">
            <Button>
              <Image src={image32} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>THCM-M Section</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/al-h-section">
            <Button>
              <Image src={image34} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>AL H-Section</ButtonText>
        </ButtonWrapper>
      </ButtonWrapperContainer>
      
      </div>
    </div>
    </ButtonContainer>
  );
}

export default FromTemp;
