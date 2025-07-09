import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© {new Date().getFullYear()} Mother India Forming PVT. LTD. All rights reserved.</p>
      <i class="fa-brands fa-whatsapp"></i>
    </footer>
  );
};

const styles = {
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px 0',
    zIndex: 1000,
  },
  text: {
    margin: 0,
    fontSize: '14px',
  },
};

export default Footer;
