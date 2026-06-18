import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem,
  Chip, Alert, CircularProgress,
} from '@mui/material';
import { Add, CheckCircle, Schedule } from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import api from '../../services/api';

export default function Chargements() {
  const [chargements, setChargements] = useState([]);
  const [camions, setCamions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCamion, setSelectedCamion] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const heureActuelle = new Date().getHours();
  const apres17h30 = heureActuelle >= 17 && new Date().getMinutes() >= 30 || heureActuelle >= 18;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [chargementsRes, camionsRes] = await Promise.all([
        api.get('/chargements'),
        api.get('/camions'),
      ]);
      setChargements(chargementsRes.data);
      setCamions(camionsRes.data);
    } catch {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleDepart = async () => {
    if (!selectedCamion) {
      setError('Veuillez sélectionner un camion');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/chargements/depart', { camionId: parseInt(selectedCamion) });
      setSuccess('Départ enregistré avec succès !');
      setOpenDialog(false);
      setSelectedCamion('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetour = async (id) => {
    try {
      await api.put(`/chargements/${id}/retour`, {});
      setSuccess('Retour enregistré avec succès !');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement du retour');
    }
  };

  const formatHeure = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
              Chargements
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Gestion des départs et retours
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            disabled={apres17h30}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: apres17h30 ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #f97316, #eab308)',
              color: 'white',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            {apres17h30 ? 'Départs fermés (après 17h30)' : 'Nouveau départ'}
          </Button>
        </Box>

        {/* Alertes */}
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
        {apres17h30 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            ⚠️ Il est après 17h30 — Aucun nouveau départ autorisé. Les retours restent possibles.
          </Alert>
        )}

        {/* Tableau */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress sx={{ color: '#f97316' }} />
          </Box>
        ) : (
          <Card sx={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 3,
          }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {['#', 'Camion', 'Zone', 'Date', 'Départ', 'Retour', 'Carburant (L)', 'Statut', 'Action'].map((h) => (
                      <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)', fontWeight: 600 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chargements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', py: 6, borderColor: 'rgba(255,255,255,0.08)' }}>
                        Aucun chargement aujourd'hui
                      </TableCell>
                    </TableRow>
                  ) : (
                    chargements.map((c) => (
                      <TableRow key={c.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.08)' }}>{c.id}</TableCell>
                        <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.08)' }}>{c.camionNumero}</TableCell>
                        <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.08)' }}>{c.zoneNom}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{formatDate(c.dateChargement)}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{formatHeure(c.heureDepart)}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{formatHeure(c.heureRetour)}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{c.carburant}</TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                          <Chip
                            label={c.estRetourne ? 'Retourné' : 'En route'}
                            size="small"
                            sx={{
                              background: c.estRetourne ? 'rgba(34,197,94,0.2)' : 'rgba(249,115,22,0.2)',
                              color: c.estRetourne ? '#22c55e' : '#f97316',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                          {!c.estRetourne && (
                            <Button
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleRetour(c.id)}
                              sx={{
                                background: 'rgba(34,197,94,0.2)',
                                color: '#22c55e',
                                borderRadius: 2,
                                textTransform: 'none',
                                '&:hover': { background: 'rgba(34,197,94,0.3)' },
                              }}
                            >
                              Retour
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        {/* Dialog Nouveau Départ */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              background: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3,
              minWidth: 400,
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
            <Schedule sx={{ mr: 1, color: '#f97316', verticalAlign: 'middle' }} />
            Enregistrer un départ
          </DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Sélectionner un camion</InputLabel>
              <Select
                value={selectedCamion}
                onChange={(e) => setSelectedCamion(e.target.value)}
                label="Sélectionner un camion"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#f97316' },
                  '& .MuiSvgIcon-root': { color: 'white' },
                }}
              >
                {camions.filter(c => c.estDisponible).map((camion) => (
                  <MenuItem key={camion.id} value={camion.id}>
                    {camion.numero} — {camion.groupeNumero} ({camion.zoneNom})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleDepart}
              disabled={submitting}
              sx={{
                background: 'linear-gradient(135deg, #f97316, #eab308)',
                color: 'white',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              {submitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Confirmer le départ'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
