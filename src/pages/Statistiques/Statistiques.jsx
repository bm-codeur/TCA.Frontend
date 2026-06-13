import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, Grid, CircularProgress,
  Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import Layout from '../../components/Layout/Layout';
import api from '../../services/api';

export default function Statistiques() {
  const [statsJour, setStatsJour] = useState(null);
  const [statsMois, setStatsMois] = useState([]);
  const [primes, setPrimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [jourRes, moisRes, primesRes] = await Promise.all([
        api.get('/statistiques/journalieres'),
        api.get('/statistiques/mensuelles'),
        api.get('/primes/chauffeurs'),
      ]);
      setStatsJour(jourRes.data);
      setStatsMois(moisRes.data);
      setPrimes(primesRes.data);
    } catch {
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const formatGNF = (v) => Number(v || 0).toLocaleString() + ' GNF';

  if (loading) return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress sx={{ color: '#f97316' }} />
      </Box>
    </Layout>
  );

  return (
    <Layout>
      <Box>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
          Statistiques
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>
          Journalières et mensuelles
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Stats du jour */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Chargements aujourd\'hui', value: statsJour?.chargementsJour || 0, color: '#f97316' },
            { label: 'Carburant consommé', value: `${statsJour?.carburantConsomme || 0} L`, color: '#ef4444' },
            { label: 'Revenus du jour', value: formatGNF(statsJour?.revenusJour), color: '#22c55e' },
            { label: 'Camions actifs', value: statsJour?.camionsActifs || 0, color: '#3b82f6' },
          ].map((s) => (
            <Grid item xs={12} sm={6} lg={3} key={s.label}>
              <Card sx={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${s.color}33`,
                borderRadius: 3, p: 3, textAlign: 'center',
              }}>
                <Typography variant="h4" sx={{ color: s.color, fontWeight: 700 }}>{s.value}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>{s.label}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Graphique mensuel */}
        <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
            Chargements du mois
          </Typography>
          {statsMois.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statsMois}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  labelStyle={{ color: 'white' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Bar dataKey="chargements" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', py: 4 }}>
              Aucune donnée disponible
            </Typography>
          )}
        </Card>

        {/* Tableau primes chauffeurs */}
        <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Primes Chauffeurs ce mois
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Chauffeur', 'Zone', 'Chargements', 'Prime totale'].map((h) => (
                    <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)', fontWeight: 600 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!primes || primes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', py: 4, borderColor: 'rgba(255,255,255,0.08)' }}>
                      Aucune prime calculée
                    </TableCell>
                  </TableRow>
                ) : (
                  primes.map((p, i) => (
                    <TableRow key={i} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                      <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.08)' }}>{p.chauffeurNom}</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{p.zoneNom}</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{p.nombreChargements}</TableCell>
                      <TableCell sx={{ color: '#22c55e', fontWeight: 600, borderColor: 'rgba(255,255,255,0.08)' }}>{formatGNF(p.primeTotale)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Layout>
  );
}