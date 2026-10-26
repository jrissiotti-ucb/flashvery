const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');

router.post('/', async (req, res) => {
  try {
    if (!req.body.historial_estados || req.body.historial_estados.length === 0) {
      req.body.historial_estados = [{
        orden: 1,
        hora: new Date(),
        descripcion: 'Pedido recibido'
      }];
    }
    const pedido = await Pedido.create(req.body);
    res.status(201).json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await Pedido.find()
      .populate('restaurante_id', 'codigo nombre')
      .populate('cliente_id', 'dni direccion')
      .populate('repartidor_id', 'placa nombre apellidos')
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Pedido.findById(req.params.id)
      .populate('restaurante_id')
      .populate('cliente_id')
      .populate('repartidor_id');
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/estados', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'No encontrado' });

    const nuevoOrden = pedido.historial_estados.length + 1;
    pedido.historial_estados.push({
      orden: nuevoOrden,
      hora: new Date(),
      descripcion: req.body.descripcion
    });

    await pedido.save();
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Pedido.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
