
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Research from './pages/Research';
import CV from './pages/CV';
import Memory from './pages/Memory';
import Admin from './pages/Admin';
import { INITIAL_CMS_DATA } from './data';
import { CMSData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<CMSData>(INITIAL_CMS_DATA);

  // Load from local storage if exists
  useEffect(() => {
    const savedData = localStorage.getItem('hajun_portfolio_cms');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse local storage data", e);
      }
    }
  }, []);

  const handleUpdate = (newData: CMSData) => {
    setData(newData);
    localStorage.setItem('hajun_portfolio_cms', JSON.stringify(newData));
    window.scrollTo(0, 0);
  };

  return (
    <Router>
      <Layout data={data}>
        <Routes>
          <Route path="/" element={<About data={data} />} />
          <Route path="/research" element={<Research data={data} />} />
          <Route path="/cv" element={<CV data={data} />} />
          <Route path="/memory" element={<Memory data={data} />} />
          
          {/* Admin page is now directly accessible without a password */}
          <Route 
            path="/admin" 
            element={<Admin data={data} onUpdate={handleUpdate} />} 
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
