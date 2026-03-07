import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './router';
import SmoothScrollProvider from './components/layout/SmoothScrollProvider';
import { NetworkStatusBanner } from './components/ui/NetworkStatusBanner';
import { ResponsiveWrapper } from './components/ui/ResponsiveWrapper';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <ResponsiveWrapper>
          <SmoothScrollProvider>
            {/* Network status banner for low connectivity */}
            <NetworkStatusBanner />
            <AppRouter />
          </SmoothScrollProvider>
        </ResponsiveWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
