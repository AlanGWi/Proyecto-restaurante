<template>
  <div>
    <HederViewVue></HederViewVue>
    
    <div class="menu-header">Menú</div>

    <div class="container mx-auto text-center">
      <!-- Iteramos sobre las categorías únicas -->
      <div v-for="Categoria in categoriasUnicas" :key="Categoria.Categoria" class="categoria">
        <!-- Título de la categoría -->
        <h2 class="categoria-titulo">{{ Categoria.Categoria }}</h2>

        <!-- Productos dentro de la categoría -->
        <div class="row" style="padding: 20px">
          <div class="col-sm-6 col-md-4 col-lg-3" v-for="producto in ListaProducto.filter(u => u.Categoria === Categoria.Categoria)" :key="producto._id">
            <div class="producto">
              <img :src="producto.imagenUrl" class="producto-imagen" :alt="producto.nombre">
              <h5 class="producto-nombre">{{ producto.nombre }}</h5>
              <p class="producto-descripcion">{{ producto.descripcion }}</p>
              <p class="producto-categoria">{{ producto.Categoria }}</p>
              <p class="producto-precio">{{ producto.precio }}</p>

              <!-- Botones de acción -->
              <a class="btn btn-primary" @click="carro(producto._id); showModal = true;">Agregar al carrito</a>
             
              <a v-if="this.rols==='ADMIN'" @click="editar(producto._id)" class="btn btn-primary">editar</a>
              <a v-if="this.rols==='ADMIN'" data-bs-toggle="modal" 
                data-bs-target="#terminarPedidoModal" @click="eliminarproducto=producto._id" class="btn btn-primary">eliminar</a>
              <a v-if="this.rols==='ADMIN'" @click="deshabilitar(producto._id)" class="btn btn-primary">deshabilitar</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para eliminar producto -->
    <div class="modal fade eliminar-pedido-modal" id="terminarPedidoModal" tabindex="-1" aria-labelledby="eliminarPedidoModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eliminarPedidoModalLabel">Eliminar producto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ¿Estás seguro de que deseas eliminar este producto?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirmareliminar()">Confirmar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar al carrito -->
    <div>
      <my-modal v-model:show="showModal" click-outside-to-close>
      <div v-if="Array.isArray(ListaProducto) && carrito.length > 0">
        <div v-for="Categoria in ListaProducto.filter(u => carrito.includes(u._id))" :key="Categoria._id">
          <p v-if="Categoria === ListaProducto.filter(u => carrito.includes(u._id)).slice(-1)[0]">
            Se agregó al carrito: {{ Categoria.nombre }} Elementos en el carrito: {{ carrito.length }}
          </p>
        </div>

        <!-- Solo se muestra el botón si hay elementos en el carrito -->
        <button class="btn btn-primary" @click="confirmarCarrito">Ir al carrito</button>
      </div>
    </my-modal>
    </div>

    <MyFooter></MyFooter>
  </div>
</template>
<script >

import HederViewVue from '@/components/HederView.vue';
import MyModal from '@/components/ModalVue.vue';
import MyFooter from '@/components/FooterVue.vue';


import axios from 'axios'

export default{

  

name:"FormNue",
components:{
  HederViewVue,
  MyModal,
  MyFooter
},

mounted:function(){

this.fetchMenuItems()

},



data:function(){
    return { 
      ListaProducto:"",
      eliminarproducto:"",
      categoriasUnicas:"", 
      showModal: false,
      carrito: [],
      token:"",
    }
},
methods:{


  confirmareliminar(){
    console.log(this.eliminarproducto)
    this.eliminar(this.eliminarproducto)
    this.fetchMenuItems();
  },


  fetchMenuItems() {
    this.rols = localStorage.getItem("role");
    console.log(this.rols)

    this.token = localStorage.getItem("token");
    let direccion = "http://localhost:3000/api/menu/allMenu" ;
    axios.get(direccion).then( data =>{
      console.log(data.data);
      this.ListaProducto = data.data.filter(producto => producto.Habilitado === true);
      console.log(this.ListaProducto)

      this.categoriasUnicas = this.ListaProducto.filter(function(item, index, self) {
        return self.findIndex(function(i) {
          return i.Categoria === item.Categoria;
        }) === index;
      }).map(function(item) {
        return { Categoria: item.Categoria };
      });
      console.log(this.categoriasUnicas);
    
    });
  },
  editar(id){
 this.$router.push("/editar/"+id);
  },

  eliminar(id) {
  axios.delete(`http://localhost:3000/api/menu/${id}`, { 
    headers: { "Access-Control-Allow-Origin": "*" },
    params: { token: this.token} 
  }).then(response => {
    console.log(response.data);
    this.fetchMenuItems();
  }).catch(error => {
    console.error(error);
  });
},
carro(id) {
      this.carrito.push(id); // agregar el id al array carrito
      this.showModal = true; // Mostrar el modal después de agregar al carrito
    },
    confirmarCarrito() {
      if (this.carrito.length > 0) {
        const ids = this.carrito.join(',');
        this.$router.push("/carrito/" + ids); // pasar el array carrito como parámetro en la ruta
      }
    },
  deshabilitar(id){

  
    axios.put('http://localhost:3000/api/menu/estado/' + id, { habilitado: false })
  .then(response => {
    console.log(response);
    this.fetchMenuItems();
  })
  .catch(error => {
    console.error(error);
  });
      

  }
 
},


}



</script>

<style>
.menu-header {
  font-size: 1.5em;
  text-align: center;
  margin-bottom: 20px;
}

.producto {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 20px;
}

.producto-imagen {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.producto-nombre {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.producto-descripcion {
  margin-bottom: 5px;
}

.producto-categoria {
  margin-bottom: 5px;
}

.producto-precio {
  font-size: 1.2rem;
  font-weight: bold;
}



.modal-backdrop.show {
  z-index: 20;
}

</style>