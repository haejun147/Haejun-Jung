
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Research from './pages/Research';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CV from './pages/CV';
import { INITIAL_CMS_DATA } from './data';

const App: React.FC = () => {
  // Pulling data directly from data.ts
  const data = INITIAL_CMS_DATA;

  return (
    <Router>
      <Layout data={data}>
        <Routes>
          <Route path="/" element={<About data={data} />} />
          <Route path="/research" element={<Research data={data} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/cv" element={<CV data={data} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
