import React from 'react';

const Footer = () => {

  const joinWhatsAppGroup = () => {
    // Replace with your actual WhatsApp group invite link
    window.open("https://chat.whatsapp.com/Lfy6xBKjPM76BMgGkuCiqF?mode=ac_t", "_blank");
  };


  return (
    <div
    title='Join our WhatsApp Group'
      onClick={joinWhatsAppGroup}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#25D366',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        zIndex: 1000,
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        style={{ width: '30px', height: '30px' }}
      />
    </div>
   
  );
};

export default Footer;
