import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="page-container">
      <main className="content-wrap">
        <Outlet /> {/* This renders the matched route */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;