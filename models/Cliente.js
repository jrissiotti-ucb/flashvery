const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
  calle: { type: String, required: true },
  numero: { type: String, required: true },
  zona: { type: String, required: true }
}, { _id: false });

const clienteSchema = new mongoose.Schema({
  dni: { type: String, required: true, unique: true },
  direccion: { type: direccionSchema, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Cliente', clienteSchema);
