import React from 'react';

const Header = () => {
  return (
    <header style={{
      backgroundColor: '#0079BF',
      color: 'white',
      padding: '1rem',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Trello Clone</h1>
    </header>
  );
};

export default Header;
