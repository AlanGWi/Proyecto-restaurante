const PedidoController = require("../controllers/pedidos");
const express = require("express");
const router = express.Router();
var authorize = require('../controllers/permisos')

// Ruta para crear un nuevo pedido
router.post("/pedidos", PedidoController.crearPedido);

// Ruta para obtener todos los pedidos
router.get("/pedidos", PedidoController.obtenerPedidos);

// Ruta para actualizar un pedido
router.put("/pedidos/:id",authorize(['MESERO','ADMIN']), PedidoController.actualizarPedido);

// Ruta para eliminar un pedido
router.delete("/pedidos/:id",authorize(['MESERO','ADMIN']), PedidoController.eliminarPedido);
router.delete("/:id",authorize(['MESERO','ADMIN']), PedidoController.eliminarPedidoId);

module.exports = router;