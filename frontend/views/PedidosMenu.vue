<template>
  <HederViewVue></HederViewVue>
  <h1 class="mb-3 text-center">Órdenes</h1>

<!-- Botón de mesero -->
<div class="d-flex justify-content-center mb-3">
  <button class="btn btn-primary me-2" @click="mostrarAccordion = true; mostrarTabla = false">
    Mesero
  </button>
</div>

<!-- Botones de subcategorías -->
<div class="d-flex flex-wrap justify-content-center gap-2">
  <button 
    v-for="subCategoria in subcategoriasUnicas" 
    :key="subCategoria.subCategoria"
    class="btn btn-outline-secondary"
    @click="pedidoSub = subCategoria.subCategoria; mostrarAccordion = false; mostrarTabla = true; cargarPedidos();"
  >
    {{ subCategoria.subCategoria }}
  </button>
</div>
 
  <div class="container mx-auto text-center">

    <div v-if="mostrarTabla" class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="pedidos1 in pedidosFiltrados" :key="pedidos1._id">
                      <td>{{ pedidos1.nombre }}</td>
                      <td>{{ pedidos1.cantidad }}</td>
                      
                      <td>{{ pedidos1.preparado ? 'preparado' : 'no preparado'}}</td>
                      <td>
                        <button class="btn btn-primary " @click="actualizarEstado(pedidos1._id)">preparado</button>
                        <button class="btn btn-primary " @click="actualizarRetirado(pedidos1._id)">Retirado</button>
                      </td>
                    </tr>
                  </tbody>
     
                </table>
              </div>





    <div v-if="mostrarAccordion" class="accordion" id="accordionPedidos">
      <div v-for="(mesaPedidos, index) in pedidosPorMesa" :key="index">
        <div class="card">
          <div  :id="'mesa-' + mesaPedidos.numeroMesa">
            <h2 class="mb-0">
              <button class="accordion-button collapsed show" type="button" data-bs-toggle="collapse"
                      :data-bs-target="'#collapse-' + mesaPedidos.numeroMesa " 
                      aria-expanded="false" :aria-controls="'collapse-' + mesaPedidos.numeroMesa">
                Mesa {{ mesaPedidos.numeroMesa }}
              </button>
            </h2>
          </div>
          <div :id="'collapse-' + mesaPedidos.numeroMesa" class="collapse"
               :aria-labelledby="'mesa-' + mesaPedidos.numeroMesa"
               data-bs-parent="#accordionPedidos">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Servido</th>
                      <th>Preparado</th>
                      <th>confirmado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(pedido, index) in mesaPedidos.productos" :key="index">
                      <td>{{ pedido.nombre }}</td>
                      <td>{{ pedido.cantidad }}</td>
                      <td> ${{ pedido.precio }}</td>
                      <td>{{ pedido.servido ? 'Servido' : 'no servido' }}</td>
                      <td>{{ pedido.preparado ? 'preparado' : 'no preparado'}}</td>
                      <td>{{ pedido.confirmado ? 'si' : 'no'}}</td>
                      <td>
                        <button class="btn btn-primary boton-eliminar" 
                        data-bs-toggle="modal" 
                        data-bs-target="#eliminarPedidoModal"
                        @click="pedidoAEliminar = pedido._id">
                        Eliminar
                      </button>
                        <button class="btn btn-primary boton-servido mx-2" @click="actualizarPedido(pedido._id)">Servido</button>
                        <button class="btn btn-primary boton-sumar mx-1" @click=" sumarCantidad(pedido); ">+</button>
                        <button class="btn btn-primary boton-restar" @click="restarCantidad(pedido);">-</button>
                        <button class="btn btn-primary mx-2" @click="confirmarPedido(pedido._id)">confirmar Pedido</button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
      <tr >
        <td colspan="2"></td>
        <td>Total:</td>
        <td>{{mesaPedidos.total }}</td>
        <td></td>
      </tr>
    </tfoot>
                </table>
              </div>
              
              <button class="btn btn-primary" data-bs-toggle="modal" 
                      data-bs-target="#terminarPedidoModal" @click="finalizarPedido = mesaPedidos">Pedido Terminado</button>
            </div>
          </div>
        </div>



           
      </div>
    </div>
  </div>
  
  

  <!-- Contenido del modal -->
  <div class="modal fade eliminar-pedido-modal"  id="eliminarPedidoModal" tabindex="-1" aria-labelledby="eliminarPedidoModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="eliminarPedidoModalLabel">Eliminar pedido</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ¿Estás seguro de que deseas eliminar este pedido?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirmarEliminarPedido();">Confirmar</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade eliminar-pedido-modal" id="terminarPedidoModal" tabindex="-1" aria-labelledby="eliminarPedidoModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="eliminarPedidoModalLabel">Eliminar pedido</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ¿Estás seguro de que deseas terminar este pedido?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirmarTerminarPedido();">Confirmar</button>
      </div>
    </div>
  </div>
</div>


</template>
<script>


import axios from 'axios';
import HederViewVue from '@/components/HederView.vue';


export default {
  data() {
    return {
      mostrarAccordion: true,
      mostrarTabla:false,
      precioTotal: 0,
      pedidosFiltrados:"",
      pedidoSub:null,
      pedidosFiltradosSubcategoria:"",
      pedidosPorMesa: [],
      token:"",
      rols:"",
      pedidoAEliminar: null,
      finalizarPedido:null,
      ListaUsuario:"",
      categoriasUnicas:"",
      subcategoriasUnicas:"",
      Username:""
      
      
    }
  },
  components:{
    HederViewVue,
    },
    mounted:function() {

      
  this.Username = localStorage.getItem("Username");
  this.rols = localStorage.getItem("role");
  console.log("roles"+ this.Username)
  this.token = localStorage.getItem("token");
       




    
    this.cargarPedidos();

    this.menuDesa();
    
    
  },

  methods: {

    actualizarRetirado(id){
      console.log(id)
      axios.put(`http://localhost:3000/api/pedidos/pedidos/${id}`, {
      retirado: true,
      token:this.token
    })
    .then(() => this.cargarPedidos())
      .catch(error => {
        console.error('Error al actualizar el pedido:', error);
      });

      

    },
    actualizarEstado(id){
      console.log(id)
      axios.put(`http://localhost:3000/api/pedidos/pedidos/${id}`, {
      preparado: true,
      token:this.token
    })
    .then(() => this.cargarPedidos())
      .catch(error => {
        console.error('Error al actualizar el pedido:', error);
      });

      

    },

    filtropedidos(filtro){
      console.log(filtro)
    },

confirmarPedido(id){
  console.log(id)
      axios.put(`http://localhost:3000/api/pedidos/pedidos/${id}`, {
      confirmado: true,
      token:this.token,
     

    })
    .then(() => this.cargarPedidos())
      .catch(error => {
        console.error('Error al actualizar el pedido:', error);
      });
},


    confirmarEliminarPedido() {
    this.eliminarPedido(this.pedidoAEliminar); 

  },

  confirmarTerminarPedido(){

    this.finalizar(this.finalizarPedido)
  },

  eliminarPedido(pedidoId) {
      axios
        .delete(`http://localhost:3000/api/pedidos/${pedidoId}`, { 
          headers: { "Access-Control-Allow-Origin": "*" },
          params: { token: this.token } 
        })
        .then(() => this.cargarPedidos())
        .catch(error => {
          console.error('Error al eliminar el pedido:', error);
        });
    },
    
    menuDesa(){
      let direccion = "http://localhost:3000/api/menu/allMenu" ;
        axios.get(direccion).then( data =>{
          
          this.ListaUsuario = data.data.filter(producto => producto.Habilitado === false);
          console.log("lista")
            console.log(this.ListaUsuario)

            const Lista = data.data;
  this.categoriasUnicas = this.ListaUsuario.filter(function(item, index, self) {
    return self.findIndex(function(i) {
      return i.Categoria === item.Categoria;
    }) === index;
  }).map(function(item) {
    return { Categoria: item.Categoria };
  });

  this.subcategoriasUnicas = Lista.filter(function(item, index, self) {
        return self.findIndex(function(i) {
          return i.subCategoria === item.subCategoria;
        }) === index;
      }).map(function(item) {
        return { subCategoria: item.subCategoria };
      });

  console.log(this.categoriasUnicas);
  console.log(this.categoriasUnicas);
                        

        });

    },
    cargarPedidos() {
  this.token = localStorage.getItem('token');
  axios
    .get('http://localhost:3000/api/pedidos/pedidos')
    .then(response => {
      
      this.pedidosFiltrados =response.data.filter(pedido => !pedido.eliminado && pedido.subCategoria ===this.pedidoSub &&!pedido.retirado &&pedido.confirmado);
      console.log(this.pedidosFiltrados)
      const pedidosFiltradosMesa = response.data.filter(pedido => !pedido.eliminado); // Filtrar los pedidos no eliminados
      this.pedidosPorMesa = this.agruparPedidosPorMesa(  pedidosFiltradosMesa); 
      this.pedidosFiltradosSubcategoria = this.pedidosFiltrados;
      console.log(  "pedidos")
      console.log(this.pedidosFiltrados)
    })
    .catch(error => {
      console.error('Error al cargar los pedidos:', error);
    });
},

    agruparPedidosPorMesa(pedidos) {
     
      
  const pedidosPorMesa = {};
  console.log(pedidosPorMesa)

  pedidos.forEach(pedido => {
    if (pedidosPorMesa[pedido.mesa]) {
      pedidosPorMesa[pedido.mesa].productos.push({
        nombre: pedido.nombre,
        cantidad: pedido.cantidad,
        precio: pedido.precio,
        eliminado: pedido.eliminado,
        servido: pedido.servido,
        preparado:pedido.preparado,
        confirmado:pedido.confirmado,
        _id: pedido._id
      });
      pedidosPorMesa[pedido.mesa].total += parseInt(pedido.precio)*parseInt(pedido.cantidad); // Sumar el precio al total de la mesa
    } else {
      pedidosPorMesa[pedido.mesa] = {
        numeroMesa: pedido.mesa,
        productos: [{
          nombre: pedido.nombre,
          cantidad: pedido.cantidad,
          precio: pedido.precio,
          eliminado: pedido.eliminado,
          servido: pedido.servido,
          preparado:pedido.preparado,
          confirmado:pedido.confirmado,
          _id: pedido._id
        }],
        total: parseInt(pedido.precio)*parseInt(pedido.cantidad) // Inicializar el total de la mesa con el precio del primer pedido
      };
    }
  });
  console.log(pedidosPorMesa)

  return Object.values(pedidosPorMesa);
},
    actualizarPedido(id) {
      console.log(id)
      axios.put(`http://localhost:3000/api/pedidos/pedidos/${id}`, {
      servido: true,
      retirado:true,
      token:this.token,
      ServidoPor:this.Username

    })
    .then(() => this.cargarPedidos())
      .catch(error => {
        console.error('Error al actualizar el pedido:', error);
      });

      
  },
  sumarCantidad(pedido) {
    axios.put(`http://localhost:3000/api/pedidos/pedidos/${pedido._id}`, {
      cantidad: parseInt(pedido.cantidad)+1,
      token:this.token
    })
    .then(() => this.cargarPedidos())
    .catch(error => {
      console.error('Error al actualizar el pedido:', error);
    });
  },
  restarCantidad(pedido) {
    if (pedido.cantidad > 1) {
      axios.put(`http://localhost:3000/api/pedidos/pedidos/${pedido._id}`, {
        cantidad: parseInt(pedido.cantidad)-1,
        token:this.token
      })
      .then(() => this.cargarPedidos())
      .catch(error => {
        console.error('Error al actualizar el pedido:', error);
      });
    }
  },


finalizar(mesaPedidos) {
  mesaPedidos.productos.forEach(pedido => {
    axios.put(`http://localhost:3000/api/pedidos/pedidos/${pedido._id}`, {
      eliminado: true,
      servido:true,
      token:this.token,
      ServidoPor:this.Username
    })
      .then(response => {
        console.log(response.statusText)
        location.reload();
      })
      .catch(error => {
        console.error('Error al actualizar el pedido:', error);
      });
  });
  this.cargarPedidos();
 
}   
  },
 
}
</script>

<style>
.boton-eliminar {
  background-color: red;
  color: white;
  border-color: transparent;
}

.boton-servido {
  background-color: green;
  color: white;
  border-color: transparent;
}

.boton-sumar, .boton-restar {
  background-color: blue;
  color: white;
}

.boton-sumar:hover, .boton-restar:hover {
  background-color: darkblue;
  color: white;
}

.table{

color: #040404;

tachment:fixed;
background-size:cover;
}

.accordion-button {
  background-color: rgb(34, 33, 33);
    color: white;
    height: 4.5pc;
  }
  .card-header {
    
    background-color: rgb(0 0 0);
   
}

.modal {
  display: none; 
  position: fixed; 
  z-index: 1; 
  padding-top: 100px; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  overflow: auto; 
  background-color: rgba(0, 0, 0, 0.4);
}
.eliminar-pedido-modal {
  /* Estilos específicos para este modal */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* ...otros estilos... */
  z-index: 21;
}
.modal-backdrop.show {
   
    z-index: 20;
}
</style>