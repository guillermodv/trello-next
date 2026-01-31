import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#333',
      color: 'white',
      padding: '1rem',
      textAlign: 'center',
      marginTop: 'auto', // Pushes the footer to the bottom
      boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
    }}>
      <p style={{ margin: 0, fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} Trello Clone. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
