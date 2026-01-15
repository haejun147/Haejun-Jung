
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Research from './pages/Research';
import CV from './pages/CV';
import Memory from './pages/Memory';
import { INITIAL_CMS_DATA } from './data';

const App: React.FC = () => {
  // The data is now strictly pulled from INITIAL_CMS_DATA in data.ts
  // You can edit data.ts directly on GitHub to update the site content.
  const data = INITIAL_CMS_DATA;

  return (
    <Router>
      <Layout data={data}>
        <Routes>
          <Route path="/" element={<About data={data} />} />
          <Route path="/research" element={<Research data={data} />} />
          <Route path="/cv" element={<CV data={data} />} />
          <Route path="/memory" element={<Memory data={data} />} />
          
          {/* Fallback to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
