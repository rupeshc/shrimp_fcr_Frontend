import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import WelcomePage from './components/WelcomePage';
import MenuPage from './components/MenuPage';
import OverallVisualizationPage from './components/OverallVisualizationPage';
import PondHealthPage from './components/PondHealthPage';
import ShrimpSurvivalPage from './components/ShrimpSurvivalPage';
import FeedPredictionPage from './components/FeedPredictionPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/water-quality" element={<App />} />
        <Route path="/shrimp-growth" element={<App />} />
        <Route path="/feed-fcr" element={<App />} />
        <Route path="/feed-meals" element={<App />} />
        <Route path="/add-data" element={<App />} />
        <Route path="/overall-visualizations" element={<OverallVisualizationPage />} />
        <Route path="/pond-health" element={<PondHealthPage />} />
        <Route path="/shrimp-survival" element={<ShrimpSurvivalPage />} />
        <Route path="/feed-prediction" element={<FeedPredictionPage />} />
        <Route path="/shrimp-health-yield" element={<App />} /> {/* New route */}
      </Routes>
    </Router>
  </React.StrictMode>
);