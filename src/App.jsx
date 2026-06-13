import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import Chargements from './pages/Chargements/Chargements';
import Camions from './pages/Camions/Camions';
import Chauffeurs from './pages/Chauffeurs/Chauffeurs';
import Groupes from './pages/Groupes/Groupes';
import Zones from './pages/Zones/Zones';
import Statistiques from './pages/Statistiques/Statistiques';
import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/camions" element={
          <ProtectedRoute><Camions /></ProtectedRoute>
        } />
        <Route path="/chauffeurs" element={
          <ProtectedRoute><Chauffeurs /></ProtectedRoute>
        } />
        <Route path="/groupes" element={
          <ProtectedRoute><Groupes /></ProtectedRoute>
        } />
        <Route path="/zones" element={
          <ProtectedRoute><Zones /></ProtectedRoute>
        } />
        <Route path="/chargements" element={
          <ProtectedRoute><Chargements /></ProtectedRoute>
        } />
        <Route path="/statistiques" element={
          <ProtectedRoute><Statistiques /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;