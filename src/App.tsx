import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import MachineMonitoring from './pages/MachineMonitoring';
import TechProfile from './pages/TechProfile';
import Ranking from './pages/Ranking';
import InterventionScanner from './pages/InterventionScanner';
import Settings from './pages/Settings';
import Machines from './pages/Machines';
import QRGenerator from './pages/QRGenerator';
import MachineHistory from './pages/MachineHistory';
import About from './pages/About';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return (
    <>
      {children}
      <Navigation />
    </>
  );
};

const AppContent = () => (
  <Routes>
    <Route path="/welcome" element={<Index />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<ProtectedLayout><MachineMonitoring /></ProtectedLayout>} />
    <Route path="/scan" element={<ProtectedLayout><InterventionScanner /></ProtectedLayout>} />
    <Route path="/intervention" element={<ProtectedLayout><InterventionScanner /></ProtectedLayout>} />
    <Route path="/history" element={<ProtectedLayout><MachineHistory /></ProtectedLayout>} />
    <Route path="/tech" element={<ProtectedLayout><TechProfile /></ProtectedLayout>} />
    <Route path="/ranking" element={<ProtectedLayout><Ranking /></ProtectedLayout>} />
    <Route path="/machines" element={<ProtectedLayout><Machines /></ProtectedLayout>} />
    <Route path="/qr-generator" element={<ProtectedLayout><QRGenerator /></ProtectedLayout>} />
    <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
