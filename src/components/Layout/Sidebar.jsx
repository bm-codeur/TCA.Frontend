import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography,
} from '@mui/material';
import {
  Dashboard, LocalShipping, Person,
  Group, Map, Inventory, BarChart, Logout,
} from '@mui/icons-material';
import useAuthStore from '../../store/authStore';

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Camions', icon: <LocalShipping />, path: '/camions' },
  { text: 'Chauffeurs', icon: <Person />, path: '/chauffeurs' },
  { text: 'Groupes', icon: <Group />, path: '/groupes' },
  { text: 'Zones', icon: <Map />, path: '/zones' },
  { text: 'Chargements', icon: <Inventory />, path: '/chargements' },
  { text: 'Statistiques', icon: <BarChart />, path: '/statistiques' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{
      width: 250,
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0d0d1f 0%, #1a1a2e 100%)',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Typography variant="h5" sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #f97316, #eab308)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: 3,
        }}>
          TCA
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
          Logistique Minière
        </Typography>
      </Box>

      {/* Menu */}
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  background: isActive ? 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,179,8,0.2))' : 'transparent',
                  borderLeft: isActive ? '3px solid #f97316' : '3px solid transparent',
                  '&:hover': {
                    background: 'rgba(249,115,22,0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#f97316' : 'rgba(255,255,255,0.5)', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: isActive ? 'white' : 'rgba(255,255,255,0.6)' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: 'rgba(255,255,255,0.5)',
            '&:hover': { background: 'rgba(255,0,0,0.1)', color: '#ff4444' },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Se déconnecter" />
        </ListItemButton>
      </Box>
    </Box>
  );
}