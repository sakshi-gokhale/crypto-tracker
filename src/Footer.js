import React from 'react';
import './App.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        Created with ❤️ by <strong>Sakshi Gokhale</strong> | &copy; {new Date().getFullYear()} Crypto Tracker
      </p>
    </footer>
  );
};

export default Footer;