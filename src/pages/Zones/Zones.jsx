import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress, IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import api from '../../services/api';

export default function Zones() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nom: '', distance: '', tarifChargement: '',
    toursMaxParJour: '', chargementMaxMois: '',
    primeChauffeurParChargement: '',
    primeSuperviseurGroupeParChargement: '',
    primeSuperviseurZoneParChargement: '',
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/zones');
      setZones(res.data);
    } catch {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (zone = null) => {
    setSelected(zone);
    setForm(zone ? {
      nom: zone.nom,
      distance: zone.distance,
      tarifChargement: zone.tarifChargement,
      toursMaxParJour: zone.toursMaxParJour,
      chargementMaxMois: zone.chargementMaxMois,
      primeChauffeurParChargement: zone.primeChauffeurParChargement,
      primeSuperviseurGroupeParChargement: zone.primeSuperviseurGroupeParChargement,
      primeSuperviseurZoneParChargement: zone.primeSuperviseurZoneParChargement,
    } : {
      nom: '', distance: '', tarifChargement: '',
      toursMaxParJour: '', chargementMaxMois: '',
      primeChauffeurParChargement: '',
      primeSuperviseurGroupeParChargement: '',
      primeSuperviseurZoneParChargement: '',
    });
    setError('');
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!form.nom || !form.distance) {
      setError('Nom et distance sont obligatoires');
      return;
    }
    setSubmitting(true);
    try {
      if (selected) {
        await api.put(`/zones/${selected.id}`, form);
        setSuccess('Zone modifiée avec succès !');
      } else {
        await api.post('/zones', form);
        setSuccess('Zone ajoutée avec succès !');
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
      await api.delete(`/zones/${selected.id}`);
      setSuccess('Zone supprimée avec succès !');
      setOpenDeleteDialog(false);
      fetchData();
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  const formatGNF = (v) => Number(v).toLocaleString() + ' GNF';

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>Zones</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>{zones.length} zones minières</Typography>
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
            Nouvelle zone
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
                    {['Zone', 'Distance', 'Tarif', 'Tours max/jour', 'Prime chauffeur', 'Prime sup. groupe', 'Prime sup. zone', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)', fontWeight: 600 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {zones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', py: 6, borderColor: 'rgba(255,255,255,0.08)' }}>
                        Aucune zone enregistrée
                      </TableCell>
                    </TableRow>
                  ) : (
                    zones.map((z) => (
                      <TableRow key={z.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell sx={{ color: 'white', fontWeight: 600, borderColor: 'rgba(255,255,255,0.08)' }}>{z.nom}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{z.distance} km</TableCell>
                        <TableCell sx={{ color: '#22c55e', borderColor: 'rgba(255,255,255,0.08)' }}>{formatGNF(z.tarifChargement)}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{z.toursMaxParJour} tours</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{formatGNF(z.primeChauffeurParChargement)}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{formatGNF(z.primeSuperviseurGroupeParChargement)}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{formatGNF(z.primeSuperviseurZoneParChargement)}</TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                          <IconButton onClick={() => handleOpen(z)} sx={{ color: '#3b82f6' }}><Edit fontSize="small" /></IconButton>
                          <IconButton onClick={() => { setSelected(z); setOpenDeleteDialog(true); }} sx={{ color: '#ef4444' }}><Delete fontSize="small" /></IconButton>
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
          PaperProps={{ sx: { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, minWidth: 500 } }}>
          <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
            {selected ? 'Modifier la zone' : 'Nouvelle zone'}
          </DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
              <TextField fullWidth label="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} sx={inputStyle} />
              <TextField fullWidth label="Distance (km)" type="number" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} sx={inputStyle} />
              <TextField fullWidth label="Tarif chargement (GNF)" type="number" value={form.tarifChargement} onChange={(e) => setForm({ ...form, tarifChargement: e.target.value })} sx={inputStyle} />
              <TextField fullWidth label="Tours max/jour" type="number" value={form.toursMaxParJour} onChange={(e) => setForm({ ...form, toursMaxParJour: e.target.value })} sx={inputStyle} />
              <TextField fullWidth label="Chargements max/mois" type="number" value={form.chargementMaxMois} onChange={(e) => setForm({ ...form, chargementMaxMois: e.target.value })} sx={inputStyle} />
              <TextField fullWidth label="Prime chauffeur/chargement" type="number" value={form.primeChauffeurParChargement} onChange={(e) => setForm({ ...form, primeChauffeurParChargement: e.target.value })} sx={inputStyle} />
              <TextField fullWidth label="Prime sup. groupe/chargement" type="number" value={form.primeSuperviseurGroupeParChargement} onChange={(e) => setForm({ ...form, primeSuperviseurGroupeParChargement: e.target.value })} sx={inputStyle} />
              <TextField fullWidth label="Prime sup. zone/chargement" type="number" value={form.primeSuperviseurZoneParChargement} onChange={(e) => setForm({ ...form, primeSuperviseurZoneParChargement: e.target.value })} sx={inputStyle} />
            </Box>
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
              Voulez-vous vraiment supprimer la zone <strong style={{ color: 'white' }}>{selected?.nom}</strong> ?
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