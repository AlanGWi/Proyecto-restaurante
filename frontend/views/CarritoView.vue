<template>
  <div class="container my-5">
    <h1 class="mb-3">Detalles del carrito</h1>

    <div class="row">
      <div class="col-sm-6 col-md-4 col-lg-3" v-for="producto in productosAgrupados" :key="producto._id">
        <div class="producto">
          <img :src="producto.imagenUrl" class="producto-imagen" :alt="producto.nombre">
          <h5 class="producto-nombre">{{ producto.nombre }}</h5>
          <p class="producto-descripcion">{{ producto.descripcion }}</p>
          <p class="producto-categoria">{{ producto.Categoria }}</p>
          <p class="producto-precio">{{ producto.precio }}</p>
          <div class="producto-cantidad">
            <button class="producto-cantidad-resta" @click="restarCantidad(producto)">-</button>
            <span class="producto-cantidad-numero">{{ producto.cantidad }}</span>
            <button class="producto-cantidad-suma" @click="sumarCantidad(producto)">+</button>
          </div>
          <button class="producto-eliminar" @click="eliminarProducto(producto)">Eliminar</button>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <div class="form-group">
        <label for="numero-mesa">Número de mesa</label>
        <input type="number" class="form-control" id="numero-mesa" v-model="numeroMesa" @change="guardarNumeroMesa" min="1">
      </div>
      <button class="btn btn-primary" @click="llamarMesero">Llamar al mesero</button>
      <button class="btn btn-secondary" @click="$router.go(-1)">Volver</button>
    </div>
  </div>

</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      productosAgrupados: [],
      numeroMesa: localStorage.getItem("numeroMesa") || "", // obtiene el valor del Local Storage, si no hay valor por defecto se deja vacío
    };
  },
  mounted() {
   
  // Obtener los parámetros de la ruta actual
  const rutaActual = this.$route;
  const idsParam = rutaActual.params.ids;

  // Convertir la cadena de texto en un array de IDs
  const ids = idsParam.split(",");

  // Obtener los detalles de los productos correspondientes a los IDs del carrito
  const promesas = ids.map((id) => axios.get("http://localhost:3000/api/menu/" + id));

Promise.all(promesas).then((respuestas) => {
  const productosAgrupados = {};
respuestas.forEach((respuesta) => {
  const producto = respuesta.data;
  const cantidadLocal = localStorage.getItem(`cantidad-${this.numeroMesa}-${producto._id}`);
  if (cantidadLocal) {
    producto.cantidad = parseInt(cantidadLocal);
  } else if (producto._id in productosAgrupados) {
    productosAgrupados[producto._id].cantidad += 1;
    return; // Saltar el resto del código para evitar agregar el producto nuevamente
  } else {
    producto.cantidad = 1;
  }
  productosAgrupados[producto._id] = producto;
});

  const productos = Object.values(productosAgrupados);

  this.productosAgrupados = productos;
  console.log(this.productosAgrupados)

});
window.addEventListener('popstate', this.borrarLocalStorage);

},
  methods: {

    mostrarNotificacion(mensaje, tipo) {
    // Crear un div de notificación
    const notificacion = document.createElement("div");
    notificacion.classList.add("notificacion", tipo);
    notificacion.innerText = mensaje;
    
    // Agregar la notificación al cuerpo
    document.body.appendChild(notificacion);
    
    // Eliminar la notificación después de 4 segundos
    setTimeout(() => {
      notificacion.remove();
    }, 10000);
  },

    guardarNumeroMesa() {
  if (this.numeroMesa < 1) {
    this.numeroMesa = 1;
  }
  localStorage.setItem("numeroMesa", this.numeroMesa);
},

   borrarLocalStorage() {
  for (let clave in localStorage) {
    if (clave.startsWith(`cantidad-${this.numeroMesa}-`)) {
      localStorage.removeItem(clave);
    }
  }
},

    sumarCantidad(producto) {
    producto.cantidad++ ;
    localStorage.setItem(`cantidad-${this.numeroMesa}-${producto._id}`, producto.cantidad);
  
    
  },
  restarCantidad(producto) {
    if (producto.cantidad > 1) {
       producto.cantidad --;
       localStorage.setItem(`cantidad-${this.numeroMesa}-${producto._id}`, producto.cantidad);
   
    }
  },
  
    eliminarProducto(producto) {
      const index = this.productosAgrupados.indexOf(producto);
  if (index > -1) {
    this.productosAgrupados.splice(index, 1);
    localStorage.removeItem(`cantidad-${this.numeroMesa}-${producto._id}`);
  }
    },
    llamarMesero() {
  if (!this.numeroMesa) {
    alert("Por favor ingrese el número de mesa");
    return;
  }

  console.log("Número de mesa:", this.numeroMesa);

const productos = this.productosAgrupados;
productos.forEach(producto => {
  const pedido = {
    
    Categoria: producto.Categoria,
    nombre: producto.nombre,
    precio: producto.precio,
    mesa: this.numeroMesa,
    cantidad: producto.cantidad,
    subCategoria:producto.subCategoria
    
  };

  console.log(pedido)

  axios.post("http://localhost:3000/api/pedidos/pedidos", pedido)
    .then(response => {
      console.log("Producto agregado al pedido:", response.data);

          // Crear una notificación en la interfaz
    this.mostrarNotificacion("Espere al mesero, su pedido está siendo procesado...", "info");

      // Redirigir a la página de confirmación del pedido
      this.$router.push("/#");
    })
    .catch(error => {
      console.error("Error al agregar producto al pedido:", error);
    });
});

},
  },
};
</script>

  <style>
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
  
  .producto-cantidad-resta,
  .producto-cantidad-suma {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 10px;
    }



    .notificacion {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  opacity: 0;
  animation: notificacion-fade 0.5s forwards;
}

.notificacion.info {
  background-color: #007bff; /* Azul */
}

.notificacion.error {
  background-color: #dc3545; /* Rojo */
}

@keyframes notificacion-fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>