<template>
  <HederViewVue></HederViewVue>
  <h1 class="mb-3 text-center">Pago</h1>

  <div class="container mx-auto text-center">
    <div v-if="pedidosPorMesa">
      <h2>Mesa {{ pedidosPorMesa.numeroMesa }}</h2>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pedido, index) in pedidosPorMesa.productos" :key="index">
              <td>{{ pedido.nombre }}</td>
              <td>{{ pedido.cantidad }}</td>
              <td>${{ pedido.precio }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2"><strong>Total:</strong></td>
              <td><strong>${{ pedidosPorMesa.total }}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <button class="btn btn-primary" @click="pagar(pedidosPorMesa.total)">Pagar</button>
    </div>

    <div v-else>
      <h3>No hay pedidos para esta mesa.</h3>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import HederViewVue from '@/components/HederView.vue';

export default {
  data() {
    return {
      pedidosPorMesa: null,
    };
  },
  components: {
    HederViewVue,
  },
  mounted() {
    this.cargarPedidos();
  },
  methods: {
    cargarPedidos() {
      const numeroMesa = localStorage.getItem("numeroMesa");

      axios
        .get("http://localhost:3000/api/pedidos/pedidos")
        .then((response) => {
          const pedidosFiltrados = response.data.filter(
            (pedido) => !pedido.eliminado && pedido.mesa == numeroMesa
          );

          if (pedidosFiltrados.length > 0) {
            this.pedidosPorMesa = {
              numeroMesa: numeroMesa,
              productos: pedidosFiltrados.map((pedido) => ({
                nombre: pedido.nombre,
                cantidad: pedido.cantidad,
                precio: pedido.precio,
              })),
              total: pedidosFiltrados.reduce((acc, pedido) => acc + pedido.precio * pedido.cantidad, 0),
            };
          }
        })
        .catch((error) => {
          console.error("Error al cargar los pedidos:", error);
        });
    },
    pagar(total) {
  axios.post("http://localhost:3000/api/transbank/crear-transaccion", {
    monto: total,
    ordenCompra: `OC${Date.now()}`, // Genera un número de orden único
    sesionId: `SESION${Date.now()}`,
    returnUrl: "http://localhost:8080/confirmacion",
  })
  .then(response => {
    if (response.data.url && response.data.token) {
      window.location.href = `${response.data.url}?token_ws=${response.data.token}`;
    }
  })
  .catch(error => {
    console.error("Error al procesar el pago:", error);
  });
}
  },
};
</script>