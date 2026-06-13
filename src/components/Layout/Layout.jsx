import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0a0a1a' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}