
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import About from './pages/About';
import CV from './pages/CV';
import BookPage from './pages/Book';
import { INITIAL_CMS_DATA } from './data';

const App: React.FC = () => {
  // Pulling data directly from data.ts
  const data = INITIAL_CMS_DATA;

  return (
    <ThemeProvider>
      <Router>
        <Layout data={data}>
          <Routes>
            <Route path="/" element={<About data={data} />} />
            <Route path="/book" element={<BookPage data={data} />} />
            <Route path="/cv" element={<CV data={data} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
