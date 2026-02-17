import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from '@/pages/SplashScreen';
import LandingPage from '@/pages/LandingPage';

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
