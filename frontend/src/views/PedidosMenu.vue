<template>
  
  <HederViewVue></HederViewVue>
  <div class="container-fluid p-4">
    <div class="row">
      <div class="col-lg-10 mx-auto">
        <!-- Botones de cambio de vista -->
        <div class="btn-toolbar mb-4" role="toolbar">
          <div class="btn-group me-2" role="group">
            <button @click="vista = 'principal'" class="btn btn-outline-primary">
              Vista Principal
            </button>
          </div>
          <div class="btn-group" role="group">
            <button
              v-for="lugar in lugaresFabricacion"
              :key="lugar"
              @click="vista = lugar"
              class="btn btn-outline-secondary"
            >
              {{ lugar }}
            </button>
          </div>
        </div>

        <!-- Vista principal -->
        <!-- Vista principal -->
<div v-if="vista === 'principal'">
  <h1 class="h3 fw-bold mb-4">Pedidos</h1>

  <div v-for="pedido in pedidos" :key="pedido._id" class="card mb-4 shadow-sm">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <strong>Mesa:</strong>
<select
  :value="pedido.mesa"                
  @change="actualizarMesa(pedido._id, $event.target.value)"
  :disabled="pedido.confirmado"
  class="form-control d-inline-block w-auto mx-2"
  style="max-width: 100px"
>
  <option v-for="mesa in mesas" :key="mesa._id" :value="mesa._id">
    {{ mesa.numero }}                  <!-- Mostrar el número de la mesa -->
  </option>
</select>
        <strong>Total:</strong> ${{ pedido.total }} |
        <strong>Confirmado:</strong> {{ pedido.confirmado ? 'Sí' : 'No' }} |
        <strong>Terminado:</strong> {{ pedido.inhabilitar ? 'Sí' : 'No' }}
        
      </div>
      <div>
        <button
          @click="confirmarPedido(pedido._id)"
          v-if="!pedido.confirmado"
          class="btn btn-sm btn-outline-primary me-2"
        >
          Confirmar
        </button>
        <button
          @click="inhabilitarPedido(pedido._id)"
          v-if="!pedido.inhabilitar"
          class="btn btn-sm btn-outline-danger"
        >
          Terminar
        </button>
      </div>
    </div>

    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Producto</th>
              
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Preparado</th>
              <th>Servido</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in pedido.items" :key="item._id + index">
              <td>{{ item.producto?.nombre || 'Sin nombre' }}</td>
           
              <td>${{ item.producto?.precio }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <button @click="actualizarCantidad(pedido._id, item._id, item.cantidad - 1)" :disabled="pedido.confirmado || item.cantidad <= 1" class="btn btn-sm btn-outline-secondary">−</button>
                  <span class="mx-2">{{ item.cantidad }}</span>
                  <button @click="actualizarCantidad(pedido._id, item._id, item.cantidad + 1)" :disabled="pedido.confirmado" class="btn btn-sm btn-outline-secondary">+</button>
                </div>
              </td>
              <td>{{ item.preparado ? 'Sí' : 'No' }}</td>
              <td>{{ item.servido ? 'Sí' : 'No' }}</td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <button @click="() => { actualizarEstado(pedido._id, item._id, 'servido'); actualizarServidoPor(pedido._id); }"
                      class="btn btn-sm btn-success">
                Servir
              </button>
                  <button @click="eliminarProducto(pedido._id, item.producto._id)" class="btn btn-sm btn-warning">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card-footer text-end">
      <button @click="eliminarPedido(pedido._id)" class="btn btn-sm btn-danger">Eliminar Pedido</button>
    </div>
  </div>
</div>

        <!-- Vista para Área de Fabricación -->
        <div v-else>
  <h2 class="h4 fw-bold mb-4">Área de Fabricación: {{ vista }}</h2>

  <div class="row g-3">
    <div
      class="col-md-6 col-lg-4"
      v-for="pedido in pedidos.filter(p => p.confirmado)"
      :key="pedido._id"
    >
      <div
        v-for="item in pedido.items.filter(i =>
          i.producto.lugar_fabricacion === vista &&
          !(i.preparado && i.retirado)
        )"
        :key="item._id"
        class="card h-100"
      >
        <div class="card-body">
          <h5 class="card-title">{{ item.producto.nombre }}</h5>
          <p class="card-text">
            <strong>Cantidad:</strong> {{ item.cantidad }}<br />
            <strong>Preparado:</strong> {{ item.preparado ? 'Sí' : 'No' }}<br />
            <strong>Retirado:</strong> {{ item.retirado ? 'Sí' : 'No' }}
          </p>
        </div>
        <div class="card-footer d-flex justify-content-between">
          <button @click="actualizarEstado(pedido._id, item._id, 'preparado')" class="btn btn-sm btn-primary">
            Marcar preparado
          </button>
          <button @click="actualizarEstado(pedido._id, item._id, 'retirado')" class="btn btn-sm btn-success">
            Marcar retirado
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import HederViewVue from '@/components/HederView.vue';

export default {
  components: { HederViewVue },
  data() {
    return {
      pedidos: [],
      vista: 'principal', // Puede ser 'principal' o un lugar_fabricacion
      lugaresFabricacion: [],
      token: localStorage.getItem('token') || '',
      mesas: [],  
    }
  },
  mounted() {
    this.cargarPedidos()
     this.obtenerMesas();   // <-- Cargar mesas al montar
  },
  methods: {
    async obtenerMesas() {
    try {
      const res = await axios.get('http://localhost:3000/api/mesas');
      this.mesas = res.data;  // Guarda las mesas obtenidas
    } catch (error) {
      console.error('Error al obtener mesas:', error);
      alert("Ocurrió un error al obtener mesas: " + (error.response?.data?.message || error.message));
    }
  },
    cargarPedidos() {
      axios
        .get('http://localhost:3000/api/pedidos/pedidos')
        .then(response => {
          this.pedidos = response.data
           this.pedidos = response.data.filter(p => !p.inhabilitar);
          console.log(response.data)
          this.generarLugaresFabricacion();
        })
        .catch(error => {
          console.error('Error al cargar los pedidos:', error)
        })
    },

    generarLugaresFabricacion() {
      const lugaresSet = new Set();
      this.pedidos.forEach(pedido => {
        pedido.items.forEach(item => {
          const lugar = item.producto?.lugar_fabricacion || 'Sin lugar';
          lugaresSet.add(lugar);
        });
      });
      this.lugaresFabricacion = Array.from(lugaresSet);
    },
    actualizarEstado(pedidoId, itemId, campo) {
      axios
        .put(`http://localhost:3000/api/pedidos/pedidos`, {
          pedidoId,
          itemId,
          [campo]: true,
          token: this.token

          
        })
        .then(() => this.cargarPedidos())
        .catch(error => {
          console.error(`Error al actualizar ${campo}:`, error)
        })
    },

    actualizarServidoPor(pedidoId) {
  const userId = localStorage.getItem('id'); // Asumiendo que guardas el ID del usuario que sirve

  axios.put(`http://localhost:3000/api/pedidos/servido-por/${pedidoId}`, {
    userId,
    token: this.token
  })
  .then(() => this.cargarPedidos())
  .catch(error => {
    console.error('Error al actualizar ServidoPor:', error);
    alert('No se pudo registrar quién sirvió el pedido.');
  });
},
        actualizarCantidad(pedidoId, itemId, nuevaCantidad) {
      axios.put('http://localhost:3000/api/pedidos/pedidos', {
        pedidoId,
        itemId,
        cantidad: nuevaCantidad,
        token: this.token
      })
      .then(() => this.cargarPedidos())
      .catch(error => {
        console.error('Error al actualizar la cantidad:', error);
      });
      
    },
    eliminarPedido(pedidoId) {
      const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto del pedido?");
  if (!confirmar) return;
  
  axios.delete(`http://localhost:3000/api/pedidos/${pedidoId}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
      params: { token: this.token }
    })
    .then(() => this.cargarPedidos())
    .catch(error => {
      console.error('Error al eliminar el pedido:', error);
    });
    },
    eliminarProducto(pedidoId, productoId) {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto del pedido?");
  if (!confirmar) return;

  axios.put(`http://localhost:3000/api/pedidos/pedidos/${pedidoId}/${productoId}`, {
    eliminado: true,
    token: this.token
  })
  .then(() => this.cargarPedidos())
  .catch(error => {
    console.error('Error al eliminar el producto del pedido:', error);
  });
},
inhabilitarPedido(pedidoId) {
  const confirmar = window.confirm("¿Estás seguro de que quieres inhabilitar este pedido?");
  if (!confirmar) return;

  axios.put(`http://localhost:3000/api/pedidos/inhabilitar/${pedidoId}`, {
    token: this.token,
    inhabilitar: true
  })
  .then(() => this.cargarPedidos())
  .catch(error => {
    console.error('Error al inhabilitar el pedido:', error);
  });
},
confirmarPedido(pedidoId) {
  axios.put(`http://localhost:3000/api/pedidos/confirmar/${pedidoId}`, {}, {
    params: { token: this.token }
  })
  .then(() => this.cargarPedidos())
  .catch(error => {
    console.error('Error al confirmar el pedido:', error);
  });
},


actualizarMesa(pedidoId, nuevaMesa) {
  axios
    .put(`http://localhost:3000/api/pedidos/actualizar-mesa/${pedidoId}`, {
      nuevaMesa,
      token: this.token
    })
    .then(() => {
      this.cargarPedidos();
    })
    .catch(error => {
      console.error('Error al actualizar la mesa:', error);
      alert('No se pudo actualizar la mesa.');
    });
}


  }
}
</script>

<style scoped>
.btn {
  padding: 4px 8px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn:hover {
  background-color: #4338ca;
}
</style>