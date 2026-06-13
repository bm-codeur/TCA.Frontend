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

export default function Chauffeurs() {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [camions, setCamions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', camionId: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [chauffeursRes, camionsRes] = await Promise.all([
        api.get('/chauffeurs'),
        api.get('/camions'),
      ]);
      setChauffeurs(chauffeursRes.data);
      setCamions(camionsRes.data);
    } catch {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (chauffeur = null) => {
    setSelected(chauffeur);
    setForm(chauffeur ? { nom: chauffeur.nom, prenom: chauffeur.prenom, camionId: chauffeur.camionId } : { nom: '', prenom: '', camionId: '' });
    setError('');
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!form.nom || !form.prenom || !form.camionId) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    setSubmitting(true);
    try {
      if (selected) {
        await api.put(`/chauffeurs/${selected.id}`, form);
        setSuccess('Chauffeur modifié avec succès !');
      } else {
        await api.post('/chauffeurs', form);
        setSuccess('Chauffeur ajouté avec succès !');
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
      await api.delete(`/chauffeurs/${selected.id}`);
      setSuccess('Chauffeur supprimé avec succès !');
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
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>Chauffeurs</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>{chauffeurs.length} chauffeurs enregistrés</Typography>
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
            Nouveau chauffeur
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
                    {['#', 'Nom', 'Prénom', 'Camion', 'Groupe', 'Zone', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)', fontWeight: 600 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chauffeurs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', py: 6, borderColor: 'rgba(255,255,255,0.08)' }}>
                        Aucun chauffeur enregistré
                      </TableCell>
                    </TableRow>
                  ) : (
                    chauffeurs.map((c) => (
                      <TableRow key={c.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>{c.id}</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, borderColor: 'rgba(255,255,255,0.08)' }}>{c.nom}</TableCell>
                        <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.08)' }}>{c.prenom}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{c.camionNumero}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{c.groupeNumero}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>{c.zoneNom}</TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                          <IconButton onClick={() => handleOpen(c)} sx={{ color: '#3b82f6' }}><Edit fontSize="small" /></IconButton>
                          <IconButton onClick={() => { setSelected(c); setOpenDeleteDialog(true); }} sx={{ color: '#ef4444' }}><Delete fontSize="small" /></IconButton>
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
            {selected ? 'Modifier le chauffeur' : 'Nouveau chauffeur'}
          </DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField fullWidth label="Nom" value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              sx={{ mt: 1, mb: 2, ...inputStyle }} />
            <TextField fullWidth label="Prénom" value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              sx={{ mb: 2, ...inputStyle }} />
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Camion</InputLabel>
              <Select value={form.camionId} onChange={(e) => setForm({ ...form, camionId: e.target.value })} label="Camion"
                sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#f97316' }, '& .MuiSvgIcon-root': { color: 'white' } }}>
                {camions.map((cam) => (
                  <MenuItem key={cam.id} value={cam.id}>{cam.numero} — {cam.zoneNom}</MenuItem>
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
              Voulez-vous vraiment supprimer <strong style={{ color: 'white' }}>{selected?.nom} {selected?.prenom}</strong> ?
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