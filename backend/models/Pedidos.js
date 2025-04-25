const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  Categoria: { type: String },
  subCategoria:{type: String}, //cocina, cafereria
  cantidad: { type: String },
  ServidoPor: { type: String,default:"nadie" },
  mesa: { type: String },
  nombre: { type: String },
  precio: { type: String },
  eliminado: { type: Boolean, default: false },
  servido: { type: Boolean, default: false },
  preparado: { type: Boolean, default: false },
  confirmado: { type: Boolean, default: false },
  retirado: { type: Boolean, default: false },
  fecha: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setHours(date.getHours() - 4);
      return date;
    }
  },
});

module.exports = mongoose.model('Pedidos', PedidoSchema);