const mongoose = require('mongoose');

const detalleSchema = new mongoose.Schema({
  producto_codigo: { type: String, required: true },
  producto_nombre: { type: String, required: true },
  precio_unitario: { type: Number, required: true },
  cantidad: { type: Number, required: true, min: 1 }
}, { _id: false });

const estadoSchema = new mongoose.Schema({
  orden: { type: Number, required: true },
  hora: { type: Date, required: true },
  descripcion: { type: String, required: true }
}, { _id: false });

const pedidoSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  fecha: { type: Date, default: Date.now },
  monto_total: { type: Number, required: true, min: 0 },
  restaurante_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurante', required: true },
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  repartidor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Repartidor', default: null },
  detalles: { type: [detalleSchema], required: true },
  historial_estados: { type: [estadoSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);
