import { Box, Typography, Avatar } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <Box sx={{
      height: 64,
      background: 'rgba(13,13,31,0.95)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 3,
      backdropFilter: 'blur(10px)',
    }}>
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
        Guinée Mining SA
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Notifications sx={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }} />
        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {user?.username || 'Admin'}
        </Typography>
        <Avatar sx={{
          width: 35,
          height: 35,
          background: 'linear-gradient(135deg, #f97316, #eab308)',
          fontSize: 14,
          fontWeight: 700,
        }}>
          {user?.username?.[0]?.toUpperCase() || 'A'}
        </Avatar>
      </Box>
    </Box>
  );
}