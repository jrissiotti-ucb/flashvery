const express = require('express');
const router = express.Router();
const Repartidor = require('../models/Repartidor');

router.post('/', async (req, res) => {
  try {
    const repartidor = await Repartidor.create(req.body);
    res.status(201).json(repartidor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await Repartidor.find().populate('supervisor_id', 'nombre apellidos placa').sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Repartidor.findById(req.params.id).populate('supervisor_id', 'nombre apellidos placa');
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Repartidor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Repartidor.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
