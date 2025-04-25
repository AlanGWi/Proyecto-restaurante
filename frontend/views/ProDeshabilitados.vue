<template>
  <HederViewVue />
  <h2>Productos Deshabilitados</h2>
  
  <div v-for="categoria in categoriasUnicas" :key="categoria.Categoria" class="accordion" id="accordionPanelsStayOpenExample">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#' + categoria.Categoria" aria-expanded="false" :aria-controls="categoria.Categoria">
          {{ categoria.Categoria }}
        </button>
      </h2>
      <div :id="categoria.Categoria" class="accordion-collapse collapse">
        <div class="row p-3">
          <div class="col-sm-6 col-md-4 col-lg-3" v-for="producto in productosPorCategoria(categoria.Categoria)" :key="producto._id">
            <div class="producto">
              <img :src="producto.imagenUrl" class="producto-imagen" :alt="producto.nombre">
              <h5 class="producto-nombre">{{ producto.nombre }}</h5>
              <p class="producto-descripcion">{{ producto.descripcion }}</p>
              <p class="producto-precio">{{ producto.precio }}</p>
              <button v-if="rol === 'ADMIN'" @click="habilitarProducto(producto._id)" class="btn btn-primary">Habilitar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import HederViewVue from '@/components/HederView.vue';

export default {
  components: { HederViewVue },
  data() {
    return {
      rol: localStorage.getItem("role"),
      token: localStorage.getItem("token"),
      categoriasUnicas: [],
      listaProductos: []
    };
  },
  mounted() {
    this.cargarProductosDeshabilitados();
  },
  methods: {
    cargarProductosDeshabilitados() {
      axios.get("http://localhost:3000/api/menu/allMenu")
        .then(({ data }) => {
          this.listaProductos = data.filter(p => !p.Habilitado);
          this.categoriasUnicas = [...new Set(this.listaProductos.map(p => p.Categoria))]
            .map(categoria => ({ Categoria: categoria }));
        })
        .catch(error => console.error("Error al cargar productos:", error));
    },
    productosPorCategoria(categoria) {
      return this.listaProductos.filter(p => p.Categoria === categoria);
    },
    habilitarProducto(id) {
      axios.put(`http://localhost:3000/api/menu/estado/${id}`, { habilitado: true })
        .then(() => this.cargarProductosDeshabilitados())
        .catch(error => console.error("Error al habilitar producto:", error));
    }
  }
};
</script>
