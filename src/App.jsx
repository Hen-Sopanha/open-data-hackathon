import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Dashboard from './routes/Dashboard.jsx';
import Replay from './routes/Replay.jsx';
import AlertPreview from './routes/AlertPreview.jsx';
import Partners from './routes/Partners.jsx';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/replay" element={<Replay />} />
          <Route path="/alert" element={<AlertPreview />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
