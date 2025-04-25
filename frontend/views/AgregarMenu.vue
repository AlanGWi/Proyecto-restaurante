<template>
  <HederViewVue />

  <div class="container">
    <form @submit.prevent="Guardar">
      <div class="row">
        <!-- Primera columna -->
        <div class="col-md-6">
          <fieldset>
            <legend>Información básica</legend>

            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre:</label>
              <input v-model="form.nombre" type="text" id="nombre" required placeholder="Ejemplo: torta" class="form-control" />
            </div>

            <div class="mb-3">
              <label for="precio" class="form-label">Precio:</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input v-model="form.precio" type="text" class="form-control" id="precio" aria-label="Precio en dólares" />
              </div>
            </div>

            <div class="mb-3">
              <label for="descripcion" class="form-label">Descripción:</label>
              <textarea v-model="form.descripcion" class="form-control" id="descripcion" rows="3"></textarea>
            </div>
          </fieldset>
        </div>

        <!-- Segunda columna -->
        <div class="col-md-6">
          <fieldset>
            <legend>Categorías</legend>

            <!-- Tipo -->
            <div class="mb-3">
              <label class="form-label">Tipo:</label>
              <ul class="nav nav-tabs">
                <li class="nav-item">
                  <button class="nav-link active" id="opciones-tab" data-bs-toggle="tab" data-bs-target="#opciones" type="button">Opciones</button>
                </li>
                <li class="nav-item">
                  <button class="nav-link" id="manual-tab" data-bs-toggle="tab" data-bs-target="#manual" type="button">Manual</button>
                </li>
              </ul>

              <div class="tab-content">
                <div class="tab-pane fade show active" id="opciones">
                  <select v-model="form.Categoria" class="form-select">
                    <option v-for="Categoria in categoriasUnicas" :key="Categoria.Categoria">{{ Categoria.Categoria }}</option>
                  </select>
                </div>
                <div class="tab-pane fade" id="manual">
                  <input v-model="form.Categoria" type="text" class="form-control" placeholder="Escriba el tipo manualmente" />
                </div>
              </div>
            </div>

            <!-- Subtipo -->
            <div class="mb-3">
              <label class="form-label">Lugar de Preparacion:</label>
              <ul class="nav nav-tabs">
                <li class="nav-item">
                  <button class="nav-link active" id="opciones-tab2" data-bs-toggle="tab" data-bs-target="#opciones2" type="button">Opciones</button>
                </li>
                <li class="nav-item">
                  <button class="nav-link" id="manual-tab2" data-bs-toggle="tab" data-bs-target="#manual2" type="button">Manual</button>
                </li>
              </ul>

              <div class="tab-content">
                <div class="tab-pane fade show active" id="opciones2">
                  <select v-model="form.subCategoria" class="form-select">
                    <option v-for="subCategoria in subcategoriasUnicas" :key="subCategoria.subCategoria">{{ subCategoria.subCategoria }}</option>
                  </select>
                </div>
                <div class="tab-pane fade" id="manual2">
                  <input v-model="form.subCategoria" type="text" class="form-control" placeholder="Escriba el subtipo manualmente" />
                </div>
              </div>
            </div>
          </fieldset>

          <!-- Imagen -->
          <fieldset>
            <legend>Imagen</legend>
            <div class="mb-3">
              <div class="input-group">
                <input type="file" @change="onFileChange" name="imagen" class="form-control" id="imagen" />
                <label class="input-group-text">Subir</label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      <!-- Botón de guardar -->
      <div class="text-center mt-3">
        <button type="submit" class="btn btn-primary">Guardar</button>
      </div>
    </form>
  </div>
</template>
  <script>
  
  import HederViewVue from '@/components/HederView.vue';
  
  import axios from 'axios'
  
  export default{
      name:"cambioVar",
  
    components:{
    HederViewVue
    },
  
    data: function() {
    return {
      selected1: '',
      ListaUsuario: "",
      categoriasUnicas: "",
      subcategoriasUnicas: "",
      form: {
        nombre: "",
        precio: "",
        descripcion: "",
        Categoria: "",
        subCategoria:"",
        imagen: null, // nueva propiedad para la imagen
        token:"",
        
      },
     
    }
  
  },
  methods:{
  
    onFileChange(e) {
    this.form.imagen = e.target.files[0];
  },
  
  Guardar() {
    const formData = new FormData();
    formData.append('nombre', this.form.nombre);
    formData.append('precio', this.form.precio);
    formData.append('descripcion', this.form.descripcion);
    formData.append('Categoria', this.form.Categoria);
    formData.append('subCategoria', this.form.subCategoria);
    formData.append('imagen', this.form.imagen);
   formData.append("token",this.form.token)
  
    console.log(formData)
 
  
  axios.post('http://localhost:3000/api/menu/addMenu', formData )
      .then(data => {
        console.log(data);
      });
  }
  },
  
  mounted:function(){
    this.form.token = localStorage.getItem("token")
  
          let direccion = "http://localhost:3000/api/menu/allMenu" ;
          axios.get(direccion).then( data =>{
            this.ListaUsuario= data.data;
              console.log(data.data)
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
              
          });
      }
  }
  </script>
  
  <style>
  .btn-guardar {
    width: 90%;
    height: 50px;
    margin-bottom: 70px;
  }
  </style>