import React from 'react';
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

    const dividerStyle = {
      width: "2px", // Thin vertical line
      backgroundColor: 'black', // Black color for the line
      height: "100%", // Full height
    };

  return (
    <ButtonContainer>
      <div style={containerStyle}>
      <div style={leftStyle}>
      <Heading>Close Shapes</Heading>
      <ButtonWrapperContainer className='col-md-12'>      
        {/* <!-- Button trigger modal --> */}
        <ButtonWrapper>
          <Button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <Image src={image3} alt="Description of Image" />
          </Button>
          <ButtonText>Round Tube</ButtonText>
        </ButtonWrapper>
        {/* <!-- Modal --> */}
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h3>Round Tube</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <ButtonWrapperContainer className='col-md-11'>
                  <ButtonWrapper>
                    <Link to="/round">
                      <Button data-bs-dismiss="modal">
                        <Image src={image3} alt="Description of Image" />
                      </Button>
                    </Link>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/elliptical">
                      <Button data-bs-dismiss="modal">
                        <Image src={image9} alt="Description of Image" />
                      </Button>
                    </Link>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/flat_oval">
                      <Button data-bs-dismiss="modal">
                        <Image src={image10} alt="Description of Image" />
                      </Button>
                    </Link>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/round-1">
                      <Button data-bs-dismiss="modal">
                        <Image src={image19} alt="Description of Image" />
                      </Button>
                    </Link>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/round-2">
                      <Button data-bs-dismiss="modal">
                        <Image src={image21} alt="Description of Image" />
                      </Button>
                    </Link>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/round-3">
                      <Button data-bs-dismiss="modal">
                        <Image src={image23} alt="Description of Image" />
                      </Button>
                    </Link>
                  </ButtonWrapper>
                </ButtonWrapperContainer>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
          <Link to="/t_shap">
            <Button>
              <Image src={image14} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Guide Rail Sections</ButtonText>
        </ButtonWrapper>
        <ButtonWrapper>
          <Link to="/figure_of_eight">
            <Button>
              <Image src={image15} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Butterfly Section</ButtonText>
        </ButtonWrapper>
      </ButtonWrapperContainer>
      </div>

      <div style={dividerStyle}></div>


      <div style={rightStyle}>
      <Heading>Open Shapes</Heading>
      <ButtonWrapperContainer  className='col-md-12'>
      <ButtonWrapper>
          <Button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal2">
            <Image src={image1} alt="Description of Image" />
          </Button>
          <ButtonText>Angle Profile</ButtonText>
        </ButtonWrapper>
        {/* <!-- Modal --> */}
        <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h3>Angle Profile</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <ButtonWrapperContainer className='col-md-11'>
                  <ButtonWrapper>
                    <Link to="/l-angle">
                      <Button data-bs-dismiss="modal">
                        <Image src={image1} alt="Description of Image" />
                      </Button>
                    </Link>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/l-angle-1">
                      <Button data-bs-dismiss="modal">
                        <Image src={image16} alt="Description of Image" />
                      </Button>
                    </Link>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/l-angle-2">
                      <Button data-bs-dismiss="modal">
                        <Image src={image17} alt="Description of Image" />
                      </Button>
                    </Link>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/l-angle-3">
                      <Button data-bs-dismiss="modal">
                        <Image src={image18} alt="Description of Image" />
                      </Button>
                    </Link>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/l-angle-4">
                      <Button data-bs-dismiss="modal">
                        <Image src={image20} alt="Description of Image" />
                      </Button>
                    </Link>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <Link to="/l-angle-5">
                      <Button data-bs-dismiss="modal">
                        <Image src={image22} alt="Description of Image" />
                      </Button>
                    </Link>
                  </ButtonWrapper>        
                </ButtonWrapperContainer>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
          <Link to="/top_hat">
            <Button>
              <Image src={image12} alt="Description of Image" />
            </Button>
          </Link>
          <ButtonText>Top Hat Section</ButtonText>
        </ButtonWrapper>
      </ButtonWrapperContainer>
      </div>
    </div>
    </ButtonContainer>
  );
}

export default FromTemp;


