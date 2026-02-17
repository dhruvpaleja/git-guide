import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from '@/pages/SplashScreen';
import LandingPage from '@/pages/sections/landing_page/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
