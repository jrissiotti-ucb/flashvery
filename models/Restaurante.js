const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true, min: 0 }
}, { _id: false });

const restauranteSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  especialidades: [{ type: String }],
  productos: [productoSchema]
}, { timestamps: true });

module.exports = mongoose.model('Restaurante', restauranteSchema);
