const  Pedido  = require("../models/Pedidos");

const crearPedido = (req, res) => {
  console.log(req.body)
    const { Categoria, nombre, precio,mesa,cantidad, subCategoria} = req.body;
    const nuevoPedido = new Pedido({
      Categoria,
      nombre,
      precio,
      mesa,
      cantidad,
      subCategoria
    });
    nuevoPedido
      .save()
      .then((pedido) => res.status(201).json(pedido))
      .catch((error) => res.status(400).json(error));
  };

  const obtenerPedidos = (req, res) => {
    Pedido.find()
      .then((pedidos) => res.status(200).json(pedidos))
      .catch((error) => res.status(404).json(error));
  };
  

  const actualizarPedido = (req, res) => {
    const { eliminado,preparado, servido, cantidad, ServidoPor ,confirmado,retirado} = req.body;
    console.log(req.body)
  
    Pedido.findById(req.params.id)
      .then((pedido) => {
        if (pedido.ServidoPor === 'nadie') {
          const update = {preparado, eliminado, servido, cantidad, ServidoPor, confirmado ,retirado};
  
          Pedido.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
          )
            .then((pedidoActualizado) => res.status(200).json(pedidoActualizado))
            .catch((error) => res.status(500).json(error));
        } else if (pedido.ServidoPor !== 'nadie') {

          const update = {  preparado ,eliminado, servido, cantidad,retirado};

          Pedido.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
          )
            .then((pedidoActualizado) => res.status(200).json(pedidoActualizado))
            .catch((error) => res.status(500).json(error));
          
          
        } else {
          res.status(400).json({ message: 'No se puede actualizar el campo Username.' });
        }
      })
      .catch((error) => res.status(404).json(error));
  };

const eliminarPedido = (req, res) => {
    const pedidoId = req.params.id;
    Pedido.findByIdAndUpdate(pedidoId, { eliminado: true }, { new: true })
      .then((pedido) => {
        if (!pedido) {
          return res.status(404).send("Pedido no encontrado");
        }
        res.status(204).send();
      })
      .catch((error) => {
        res.status(500).send("Error al eliminar el pedido "+ error);
      });
  };

  const eliminarPedidoId = (req, res) => {
    const pedidoId = req.params.id;
    Pedido.findByIdAndDelete(pedidoId)
      .then((pedido) => {
        if (!pedido) {
          return res.status(404).send("Pedido no encontrado");
        }
        res.status(204).send();
      })
      .catch((error) => {
        res.status(500).send("Error al eliminar el pedido " + error);
      });
  };

module.exports = {
  crearPedido,
  obtenerPedidos,
  actualizarPedido,
  eliminarPedido,
  eliminarPedidoId
};