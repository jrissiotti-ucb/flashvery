const mongoose = require('mongoose');
const Restaurante = require('./models/Restaurante');
const Repartidor = require('./models/Repartidor');
const Cliente = require('./models/Cliente');
const Pedido = require('./models/Pedido');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/bd-flashdelivery';

async function seed() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Conectado a MongoDB');

    await Restaurante.deleteMany({});
    await Repartidor.deleteMany({});
    await Cliente.deleteMany({});
    await Pedido.deleteMany({});
    console.log('Colecciones limpiadas');

    const rest1 = await Restaurante.create({
      codigo: 'REST001',
      nombre: 'Pizza Express Sucre',
      especialidades: ['pizza', 'italiana'],
      productos: [
        { codigo: 'P001', nombre: 'Pizza Margarita', precio: 45 },
        { codigo: 'P002', nombre: 'Pizza Pepperoni', precio: 52 },
        { codigo: 'P003', nombre: 'Lasaña', precio: 48 }
      ]
    });

    const rest2 = await Restaurante.create({
      codigo: 'REST002',
      nombre: 'Burger House',
      especialidades: ['hamburguesas', 'americana'],
      productos: [
        { codigo: 'H001', nombre: 'Hamburguesa Clasica', precio: 35 },
        { codigo: 'H002', nombre: 'Hamburguesa Doble', precio: 48 },
        { codigo: 'H003', nombre: 'Papas Fritas', precio: 18 }
      ]
    });

    console.log('Restaurantes creados');

    const rep1 = await Repartidor.create({
      placa: 'ABC-123',
      nombre: 'Carlos',
      apellidos: 'Mamani Quispe',
      telefonos: ['70012345', '71123456'],
      licencia: {
        numero: 'LIC-998877',
        tipo: 'A',
        fecha_vencimiento: new Date('2027-08-15')
      }
    });

    const rep2 = await Repartidor.create({
      placa: 'XYZ-789',
      nombre: 'Maria',
      apellidos: 'Condori Lopez',
      telefonos: ['69988776'],
      supervisor_id: rep1._id,
      licencia: {
        numero: 'LIC-554433',
        tipo: 'B',
        fecha_vencimiento: new Date('2026-12-20')
      }
    });

    console.log('Repartidores creados');

    const cli1 = await Cliente.create({
      dni: '8456123',
      direccion: {
        calle: 'Calle Bolivar',
        numero: '125',
        zona: 'Centro'
      }
    });

    const cli2 = await Cliente.create({
      dni: '7123456',
      direccion: {
        calle: 'Av. Hernando Siles',
        numero: '890',
        zona: 'San Antonio'
      }
    });

    console.log('Clientes creados');

    await Pedido.create({
      numero: 'PED-001',
      monto_total: 97,
      restaurante_id: rest1._id,
      cliente_id: cli1._id,
      repartidor_id: rep1._id,
      detalles: [
        {
          producto_codigo: 'P001',
          producto_nombre: 'Pizza Margarita',
          precio_unitario: 45,
          cantidad: 1
        },
        {
          producto_codigo: 'P002',
          producto_nombre: 'Pizza Pepperoni',
          precio_unitario: 52,
          cantidad: 1
        }
      ],
      historial_estados: [
        { orden: 1, hora: new Date(), descripcion: 'Pedido recibido' },
        { orden: 2, hora: new Date(), descripcion: 'En preparacion' }
      ]
    });

    await Pedido.create({
      numero: 'PED-002',
      monto_total: 53,
      restaurante_id: rest2._id,
      cliente_id: cli2._id,
      repartidor_id: rep2._id,
      detalles: [
        {
          producto_codigo: 'H001',
          producto_nombre: 'Hamburguesa Clasica',
          precio_unitario: 35,
          cantidad: 1
        },
        {
          producto_codigo: 'H003',
          producto_nombre: 'Papas Fritas',
          precio_unitario: 18,
          cantidad: 1
        }
      ],
      historial_estados: [
        { orden: 1, hora: new Date(), descripcion: 'Pedido recibido' }
      ]
    });

    console.log('Pedidos creados');
    console.log('Seed completado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
}

seed();
