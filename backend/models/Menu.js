const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
  _id:{type:String},
  Categoria: { type: String },
  subCategoria: { type: String }, //cafeteria cocina
  nombre: { type: String },
  precio: { type: String },
  descripcion: { type: String },
  imagen_nombre: { type: String }, // Nuevo campo para el nombre y la extensión de la imagen
  Habilitado: {type: Boolean, default: true}
  
});

module.exports = Menu = mongoose.model("Menus", MenuSchema);