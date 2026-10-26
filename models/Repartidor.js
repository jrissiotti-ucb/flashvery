const mongoose = require('mongoose');

const licenciaSchema = new mongoose.Schema({
  numero: { type: String, required: true },
  tipo: { type: String, required: true },
  fecha_vencimiento: { type: Date, required: true }
}, { _id: false });

const repartidorSchema = new mongoose.Schema({
  placa: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  telefonos: [{ type: String }],
  supervisor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Repartidor', default: null },
  licencia: { type: licenciaSchema, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Repartidor', repartidorSchema);
