import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Alert, CircularProgress, IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import api from '../../services/api';

export default function Groupes() {
  const [groupes, setGroupes] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ numero: '', zoneId: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [groupesRes, zonesRes] = await Promise.all([
        api.get('/groupes'),
        api.get('/zones'),
      ]);
      setGroupes(groupesRes.data);
      setZones(zonesRes.data);
    } catch {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (groupe = null) => {
    setSelected(groupe);
    setForm(groupe ? { numero: groupe.numero, zoneId: groupe.zoneId } : { numero: '', zoneId: '' });
    setError('');
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!form.numero || !form.zoneId) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    setSubmitting(true);
    try {
      if (selected) {
        await api.put(`/groupes/${selected.id}`, form);
        setSuccess('Groupe modifié avec succès !');
      } else {
        await api.post('/groupes', form);
        setSuccess('Groupe ajouté avec succès !');
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
      await api.delete(`/groupes/${selected.id}`);
      setSuccess('Groupe supprimé avec succès !');
      setOpenDeleteDialog(false);
      fetchData();
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>Groupes</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>{groupes.length} groupes enregistrés</Typography>
          </Box>
          <Button
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{
              background: 'linear-gradient(135deg, #f97316, #eab308)',
              color: 'white', borderRadius: 2,
              textTransform: 'none', fontWeight: 600, px: 3,
            }}
          >
            Nouveau groupe
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress sx={{ color: '#f97316' }} />
          </Box>
        ) : (
          <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {['#', 'Numéro', 'Zone', 'Distance', 'Tours max/jour', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)', fontWeight: 600 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', py: 6, borderColor: 'rgba(255,255,255,0.08)' }}>
                        Aucun groupe enregistré
                      </TableCell>
                    </TableRow>
                  ) : (
                    groupes.map((g) => (
                      <TableRow key={g.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>{g.id}</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, borderColor: 'rgba(255,255,255,0.08)' }}>{g.numero}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{g.zoneNom}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{g.zoneDistance} km</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{g.toursMaxParJour} tours</TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                          <IconButton onClick={() => handleOpen(g)} sx={{ color: '#3b82f6' }}><Edit fontSize="small" /></IconButton>
                          <IconButton onClick={() => { setSelected(g); setOpenDeleteDialog(true); }} sx={{ color: '#ef4444' }}><Delete fontSize="small" /></IconButton>
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
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}
          PaperProps={{ sx: { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, minWidth: 400 } }}>
          <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
            {selected ? 'Modifier le groupe' : 'Nouveau groupe'}
          </DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField fullWidth label="Numéro du groupe" value={form.numero}
              onChange={(e) => setForm({ ...form, numero: e.target.value })}
              sx={{ mt: 1, mb: 2, ...inputStyle }} />
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Zone</InputLabel>
              <Select value={form.zoneId} onChange={(e) => setForm({ ...form, zoneId: e.target.value })} label="Zone"
                sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#f97316' }, '& .MuiSvgIcon-root': { color: 'white' } }}>
                {zones.map((z) => (
                  <MenuItem key={z.id} value={z.id}>{z.nom} — {z.distance} km</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={submitting}
              sx={{ background: 'linear-gradient(135deg, #f97316, #eab308)', color: 'white', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}>
              {submitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : selected ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Suppression */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{ sx: { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
          <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Voulez-vous vraiment supprimer le groupe <strong style={{ color: 'white' }}>{selected?.numero}</strong> ?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Annuler</Button>
            <Button onClick={handleDelete}
              sx={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { background: 'rgba(239,68,68,0.3)' } }}>
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
