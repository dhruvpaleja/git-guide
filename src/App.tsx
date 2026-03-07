import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './router';
import SmoothScrollProvider from './components/layout/SmoothScrollProvider';
import { NetworkStatusBanner } from './components/ui/NetworkStatusBanner';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <SmoothScrollProvider>
          {/* Network status banner for low connectivity */}
          <NetworkStatusBanner />
          <AppRouter />
        </SmoothScrollProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
