// import React from 'react';
// import ReactDOM from 'react-dom/client'; // Import from react-dom/client
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './index.css';
// import App from './App';
// import CoinDetails from './CoinDetails';

// const root = ReactDOM.createRoot(document.getElementById('root')); // Create root element
// root.render(
//   <Router>
//     <Routes>
//       <Route path="/" element={<App />} />
//       <Route path="/coin/:coinId" element={<CoinDetails />} />
//     </Routes>
//   </Router>
  
// );
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Layout from './Layout';
import App from './App';
import CoinDetails from './CoinDetails';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<App />} />
        <Route path="/coin/:coinId" element={<CoinDetails />} />
      </Route>
    </Routes>
  </Router>
);