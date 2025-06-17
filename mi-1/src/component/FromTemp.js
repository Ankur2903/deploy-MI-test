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
import image42 from './Image/Image-42.png';
import image43 from './Image/Image-43.png';
import image44 from './Image/Image-44.png';
import image45 from './Image/Image-45.png';
import image46 from './Image/Image-46.png';
import image47 from './Image/Image-47.png';
import image48 from './Image/Image-48.png';
import image49 from './Image/Image-49.png';
import image50 from './Image/Image-50.png';
import image51 from './Image/Image-51.png';
import image52 from './Image/Image-52.png';
import image53 from './Image/Image-53.png';
import image54 from './Image/Image-54.png';
import image55 from './Image/Image-55.png';
import image56 from './Image/Image-56.png';
import image57 from './Image/Image-57.png';
import image58 from './Image/Image-58.png';
import image59 from './Image/Image-59.png';
import image60 from './Image/Image-60.png';
import image61 from './Image/Image-61.png';
import image62 from './Image/Image-62.png';
import image63 from './Image/Image-63.png';
import image64 from './Image/Image-64.png';
import image65 from './Image/Image-65.png';
import image66 from './Image/Image-66.png';
import image67 from './Image/Image-67.png';
import image68 from './Image/Image-68.png';
import image69 from './Image/Image-69.png';
import image70 from './Image/Image-70.png';
import image71 from './Image/Image-71.png';
import image72 from './Image/Image-72.png';
import image73 from './Image/Image-73.png';
import image74 from './Image/Image-74.png';

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
  }`;

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
  }`;

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
  }`;

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
  }`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;`;

const ButtonText = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: bold;
  margin-top: 8px;

  @media (max-width: 480px) {
    font-size: 12px;
  }`;

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
  }`;

function FromTemp() {
    const containerStyle = {
      display: "flex",
      height: "100vh", // Full viewport height
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
      <Heading>Close Profile</Heading>
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
                  <ButtonWrapper>
                    <Link to="/t_shap_4">
                      <Button data-bs-dismiss="modal">
                        <Image src={image58} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Tube-4</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/t_shap_5">
                      <Button data-bs-dismiss="modal">
                        <Image src={image60} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Tube-5</ButtonText>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/t_shape_6">
                      <Button data-bs-dismiss="modal">
                        <Image src={image63} alt="Description of Image" />
                      </Button>
                    </Link>
                    <ButtonText>Tube-6</ButtonText>
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
          <Link to="/a-post">
            <Button>
              <Image src={image45} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>A-Post</ButtonText>
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
        <ButtonWrapper>
          <Link to="/trapiz-tube">
            <Button>
              <Image src={image43} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Trapiz Tube</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/guide-rail">
            <Button>
              <Image src={image44} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>40*10 Guide Rail</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/m-diamond-tube">
            <Button>
              <Image src={image50} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>M-Diamond Tube</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/l&t-cabin-section">
            <Button>
              <Image src={image52} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>L&T Cabin Section</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/bus-body-section">
            <Button>
              <Image src={image53} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Bus Body Section</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/c-post">
            <Button>
              <Image src={image56} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>C Post</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/al-skirt-rail">
            <Button>
              <Image src={image57} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Al-Skirt Rail</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/swiss-profile-section">
            <Button>
              <Image src={image59} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Swiss Profile Section</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/backhoe-a-piller">
            <Button>
              <Image src={image61} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Backhoe-A Piller</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/cat-a-piller">
            <Button>
              <Image src={image62} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Cat A-Piller</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/trip-tube">
            <Button>
              <Image src={image64} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Trip Tube</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/hand-rail-section">
            <Button>
              <Image src={image65} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>2 Hand Rail Section</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/front-cross-member">
            <Button>
              <Image src={image67} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Front Cross Member</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/frame-profile">
            <Button>
              <Image src={image68} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Frame Profile</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/formwork">
            <Button>
              <Image src={image70} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Formwork</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/c-pillar">
            <Button>
              <Image src={image71} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>C Pillar</ButtonText>
        </ButtonWrapper>
         <ButtonWrapper>
          <Link to="/a-post-2">
            <Button>
              <Image src={image72} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>A Post-2</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/front-st-a-pillar">
            <Button>
              <Image src={image73} alt="Description of Image"/>
            </Button>
          </Link>
          <ButtonText>Front ST A Pillar</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/d-pillar-rear">
            <Button>
              <Image src={image74} alt="Description of Image"/>
            </Button>
          </Link>
          <ButtonText>D Pillar Rear</ButtonText>
        </ButtonWrapper>
      </ButtonWrapperContainer>
      </div>

      <div style={dividerStyle}></div>

      <div style={rightStyle}>
      <Heading>Open Profile</Heading>
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
        <ButtonWrapper>
          <Link to="/sill-pressing">
            <Button>
              <Image src={image42} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Sill Pressing</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/lower-frame">
            <Button>
              <Image src={image46} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Lower Frame</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/support-tube">
            <Button>
              <Image src={image47} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Support Tube</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/al-lip-cover">
            <Button>
              <Image src={image48} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Al Lip-Cover Section</ButtonText>
        </ButtonWrapper>
         <ButtonWrapper>
          <Link to="/niko-bts">
            <Button>
              <Image src={image49} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Niko BTS</ButtonText>
        </ButtonWrapper>
         <ButtonWrapper>
          <Link to="/al-c-section">
            <Button>
              <Image src={image51} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Al C-Section</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/cabin-door-frame">
            <Button>
              <Image src={image54} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Cabin Door Frame</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/crimped-rail">
            <Button>
              <Image src={image55} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Crimped Rail</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/door-profile">
            <Button>
              <Image src={image66} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Door Profile</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/craftsman-c-rail">
            <Button>
              <Image src={image69} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Craftsman C-Rail</ButtonText>
        </ButtonWrapper>
      </ButtonWrapperContainer>
      </div>
    </div>
    </ButtonContainer>
  );
}

export default FromTemp;
