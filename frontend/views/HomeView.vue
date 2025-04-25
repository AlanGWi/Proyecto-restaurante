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
          <div class="col-sm-6 col-md-4 col-lg-3" v-for="producto in ListaUsuario.filter(u => u.Categoria === Categoria.Categoria)" :key="producto._id">
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
        <div v-if="Array.isArray(ListaUsuario)">
          <div v-for="Categoria in ListaUsuario.filter(u => carrito.includes(u._id))" :key="Categoria._id">
            <p v-if="Categoria === ListaUsuario.filter(u => carrito.includes(u._id)).slice(-1)[0]">
              Se agregó al carrito: {{ Categoria.nombre }} Elementos en el carrito: {{ carrito.length }}
            </p>
          </div>
        </div>
        <button class="btn btn-primary" @click="confirmarCarrito()">Ir al carrito</button>
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
      ListaUsuario:"",
      eliminarproducto:"",
      categoriasUnicas:"", 
      subcategoriasUnicas:"",
      showModal: false,
      carrito: [],
      token:"",
    }
},
methods:{

  confirmareliminar(){
    this.eliminar(this.eliminarproducto)
  },


  fetchMenuItems() {
    this.rols = localStorage.getItem("role");
    console.log(this.rols)

    this.token = localStorage.getItem("token");
    let direccion = "http://localhost:3000/api/menu/allMenu" ;
    axios.get(direccion).then( data =>{
      this.ListaUsuario = data.data.filter(producto => producto.Habilitado === true);
      console.log(this.ListaUsuario)

      this.categoriasUnicas = this.ListaUsuario.filter(function(item, index, self) {
        return self.findIndex(function(i) {
          return i.Categoria === item.Categoria;
        }) === index;
      }).map(function(item) {
        return { Categoria: item.Categoria };
      });


      this.subcategoriasUnicas = this.ListaUsuario.filter(function(item, index, self) {
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
  carro(id){
    console.log(id)
    this.carrito.push(id); // agregar el id al array carrito
    console.log(this.carrito)
    
  },

  confirmarCarrito() {
    if (this.carrito.length > 0) {
      const ids = this.carrito.join(',');
      this.$router.push("/carrito/"+ids); // pasar el array carrito como parámetro en la ruta
    }
  },
  deshabilitar(id){

  
    axios.put('http://localhost:3000/api/menu/estado/' + id, { habilitado: false })
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
      

  }
 
},


}



</script>

<style>
.menu-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  
}

.menu-container {
  display: flex;
  justify-content: right;
  align-items: center;
  width: 100%;
}

.category {
  width: 30%;
  text-align: center;
}
.menu-header {
  font-size: 1.5em;
  text-align: center;
  margin-bottom: 20px;
}



/* Estilos para pantallas medianas */
@media screen and (max-width: 768px) {
  .menu-wrapper {
    width: 90%;
  }

  .menu-container {
    flex-wrap: wrap;
  }

  .category {
    width: 45%;
    margin-bottom: 20px;
  }
}

/* Estilos para pantallas pequeñas */
@media screen and (max-width: 480px) {
  .category {
    width: 100%;
  }
}



  .accordion-button {
    background-color: rgb(34, 33, 33);
    color: white;
    height: 4.5pc;
  }
  
  .accordion-button:focus {
    box-shadow: none;
  }
  
  .accordion-button:not(.collapsed)::after {
    background-image: none;
  }
  
  .accordion-item {
    margin-bottom: 25px;
  }
  
  .accordion-body {
    background-color: rgb(254, 254, 254);
    color: rgb(0, 0, 0); 
  }
 

.accordion {
            --bs-accordion-btn-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
            --bs-accordion-btn-active-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
          
        }

.accordion-button:not(.collapsed) {
  color: white;
  background-color: black;
  
}

.accordion-button:not(.collapsed)::after {
  
        background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>") !important;    
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
  
  .producto-cantidad {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }
  

  .eliminar-pedido-modal {
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