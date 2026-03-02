import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './router';
import SmoothScrollProvider from './components/layout/SmoothScrollProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <SmoothScrollProvider>
          <AppRouter />
        </SmoothScrollProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
