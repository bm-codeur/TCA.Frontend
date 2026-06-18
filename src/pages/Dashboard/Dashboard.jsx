import React from 'react';
import { Box, Grid, Card, Typography, CircularProgress } from '@mui/material';
import { LocalShipping, Inventory, LocalGasStation, AttachMoney } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import api from '../../services/api';

const StatCard = ({ title, value, icon, color, suffix }) => (
  <Card sx={{
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
    p: 3,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    transition: 'transform 0.2s',
    '&:hover': { transform: 'translateY(-4px)', borderColor: color },
  }}>
    <Box sx={{
      width: 55,
      height: 55,
      borderRadius: 2,
      background: `${color}22`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
    </Box>
    <Box>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
        {value} {suffix}
      </Typography>
    </Box>
  </Card>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [totalPrimes, setTotalPrimes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          statsRes,
          primesChauffeursRes,
          primesGroupesRes,
          primesZonesRes,
          primeGeneralRes,
        ] = await Promise.all([
          api.get('/statistiques/journalieres'),
          api.get('/primes/chauffeurs'),
          api.get('/primes/superviseurs-groupe'),
          api.get('/primes/superviseurs-zone'),
          api.get('/primes/superviseur-general'),
        ]);

        const primesChauffeurs = primesChauffeursRes.data.reduce((total, prime) => total + Number(prime.primeTotal || 0), 0);
        const primesGroupes = primesGroupesRes.data.reduce((total, prime) => total + Number(prime.primeTotal || 0), 0);
        const primesZones = primesZonesRes.data.reduce((total, prime) => total + Number(prime.primeTotal || 0), 0);
        const primeGeneral = Number(primeGeneralRes.data?.primeTotal || 0);

        setStats(statsRes.data);
        setTotalPrimes(primesChauffeurs + primesGroupes + primesZones + primeGeneral);
      } catch {
        setStats({
          totalChargements: 0,
          totalCarburant: 0,
          totalRevenus: 0,
          chargementsEnCours: 0,
        });
        setTotalPrimes(0);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatNumber = (value) => Number(value || 0).toLocaleString('fr-FR');

  return (
    <Layout>
      <Box>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>
          Vue d'ensemble de la journée
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress sx={{ color: '#f97316' }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Camions actifs"
                value={stats?.chargementsEnCours || 0}
                icon={<LocalShipping />}
                color="#3b82f6"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Chargements du jour"
                value={stats?.totalChargements || 0}
                icon={<Inventory />}
                color="#f97316"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Carburant consommé"
                value={formatNumber(stats?.totalCarburant)}
                icon={<LocalGasStation />}
                color="#ef4444"
                suffix="L"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Revenus du jour"
                value={formatNumber(stats?.totalRevenus)}
                icon={<AttachMoney />}
                color="#22c55e"
                suffix="GNF"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Primes du mois"
                value={formatNumber(totalPrimes)}
                icon={<AttachMoney />}
                color="#a855f7"
                suffix="GNF"
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Layout>
  );
}
