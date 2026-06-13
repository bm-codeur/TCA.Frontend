import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Chip, Alert, CircularProgress, IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import api from '../../services/api';

export default function Camions() {
  const [camions, setCamions] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCamion, setSelectedCamion] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ numero: '', groupeId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [camionsRes, groupesRes] = await Promise.all([
        api.get('/camions'),
        api.get('/groupes'),
      ]);
      setCamions(camionsRes.data);
      setGroupes(groupesRes.data);
    } catch {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (camion = null) => {
    setSelectedCamion(camion);
    setForm(camion ? { numero: camion.numero, groupeId: camion.groupeId } : { numero: '', groupeId: '' });
    setError('');
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!form.numero || !form.groupeId) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    setSubmitting(true);
    try {
      if (selectedCamion) {
        await api.put(`/camions/${selectedCamion.id}`, form);
        setSuccess('Camion modifié avec succès !');
      } else {
        await api.post('/camions', form);
        setSuccess('Camion ajouté avec succès !');
      }
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'opération');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/camions/${selectedCamion.id}`);
      setSuccess('Camion supprimé avec succès !');
      setOpenDeleteDialog(false);
      fetchData();
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
              Camions
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
              {camions.length} camions enregistrés
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{
              background: 'linear-gradient(135deg, #f97316, #eab308)',
              color: 'white',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            Nouveau camion
          </Button>
        </Box>

        {/* Alertes */}
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

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
                    {['#', 'Numéro', 'Groupe', 'Zone', 'Statut', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)', fontWeight: 600 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {camions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', py: 6, borderColor: 'rgba(255,255,255,0.08)' }}>
                        Aucun camion enregistré
                      </TableCell>
                    </TableRow>
                  ) : (
                    camions.map((c) => (
                      <TableRow key={c.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>{c.id}</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, borderColor: 'rgba(255,255,255,0.08)' }}>{c.numero}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{c.groupeNumero}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{c.zoneNom}</TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                          <Chip
                            label={c.estDisponible ? 'Disponible' : 'En route'}
                            size="small"
                            sx={{
                              background: c.estDisponible ? 'rgba(34,197,94,0.2)' : 'rgba(249,115,22,0.2)',
                              color: c.estDisponible ? '#22c55e' : '#f97316',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                          <IconButton onClick={() => handleOpen(c)} sx={{ color: '#3b82f6' }}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => { setSelectedCamion(c); setOpenDeleteDialog(true); }} sx={{ color: '#ef4444' }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        {/* Dialog Ajout/Modification */}
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
            {selectedCamion ? 'Modifier le camion' : 'Nouveau camion'}
          </DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              fullWidth
              label="Numéro du camion"
              value={form.numero}
              onChange={(e) => setForm({ ...form, numero: e.target.value })}
              sx={{ mt: 1, mb: 2, ...inputStyle }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Groupe</InputLabel>
              <Select
                value={form.groupeId}
                onChange={(e) => setForm({ ...form, groupeId: e.target.value })}
                label="Groupe"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#f97316' },
                  '& .MuiSvgIcon-root': { color: 'white' },
                }}
              >
                {groupes.map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.numero} — {g.zoneNom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
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
              {submitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : selectedCamion ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Suppression */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            sx: {
              background: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
            Confirmer la suppression
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Voulez-vous vraiment supprimer le camion <strong style={{ color: 'white' }}>{selectedCamion?.numero}</strong> ?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              sx={{
                background: 'rgba(239,68,68,0.2)',
                color: '#ef4444',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': { background: 'rgba(239,68,68,0.3)' },
              }}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
    '&:hover fieldset': { borderColor: '#f97316' },
    '&.Mui-focused fieldset': { borderColor: '#f97316' },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.5)',
    '&.Mui-focused': { color: '#f97316' },
  },
};