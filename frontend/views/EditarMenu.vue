<template>
  <HederViewVue />

  <div class="container">
    <form @submit.prevent="Guardar">
      <div class="row">
        <!-- Primera columna -->
        <div class="col-md-6">
          <div class="form-group">
            <label for="nombre" class="form-label">Nombre:</label>
            <input v-model="form.nombre" type="text" id="nombre" required placeholder="Ejemplo: torta" class="form-control">
          </div>

          <div class="form-group">
            <label for="precio" class="form-label">Precio:</label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input v-model="form.precio" type="text" class="form-control" id="precio" aria-label="Precio en dólares">
            </div>
          </div>

          <div class="form-group">
            <label for="descripcion" class="form-label">Descripción:</label>
            <textarea v-model="form.descripcion" class="form-control" id="descripcion" rows="3"></textarea>
          </div>
        </div>

        <!-- Segunda columna -->
        <div class="col-md-6">
          <!-- Tipo -->
          <div class="form-group">
            <label class="form-label">Tipo:</label>
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#opciones" type="button">Opciones</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#manual" type="button">Manual</button>
              </li>
            </ul>

            <div class="tab-content">
              <div class="tab-pane fade show active" id="opciones">
                <select v-model="form.Categoria" class="form-select">
                  <option v-for="Categoria in categoriasUnicas" :key="Categoria.Categoria">{{ Categoria.Categoria }}</option>
                </select>
              </div>
              <div class="tab-pane fade" id="manual">
                <input v-model="form.Categoria" type="text" class="form-control" placeholder="Escriba el tipo manualmente">
              </div>
            </div>
          </div>

          <!-- Subtipo -->
          <div class="form-group">
            <label class="form-label">Lugar de preparacion:</label>
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#opciones-subtipo" type="button">Opciones</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#manual-subtipo" type="button">Manual</button>
              </li>
            </ul>

            <div class="tab-content">
              <div class="tab-pane fade show active" id="opciones-subtipo">
                <select v-model="form.subCategoria" class="form-select">
                  <option v-for="subCategoria in subcategoriasUnicas" :key="subCategoria.subCategoria">{{ subCategoria.subCategoria }}</option>
                </select>
              </div>
              <div class="tab-pane fade" id="manual-subtipo">
                <input v-model="form.subCategoria" type="text" class="form-control" placeholder="Escriba el subtipo manualmente">
              </div>
            </div>
          </div>

          <!-- Imagen -->
          <div class="form-group">
            <label for="imagen" class="form-label">Imagen:</label>
            <div class="input-group mb-3">
              <input type="file" @change="onFileChange" name="imagen" class="form-control" id="imagen">
              <label class="input-group-text">Subir</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de guardar -->
      <div class="text-center mt-3">
        <button type="submit" class="btn btn-primary">Guardar edición</button>
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
    
      data() {
  return {
    categoriasUnicas: "",
    subcategoriasUnicas: "",
    form: {
      nombre: "",
      precio: "",
      descripcion: "",
      Categoria: "",
      subCategoria: "",  // <- Agregado
      imagen_nombre: "",
      imagen: null
    },
    MenuId: null,
    token: ""
  };
},
   
    methods:{
      
  
  onFileChange(e) {
  this.form.imagen = e.target.files[0];
  },

  
 Guardar(){
  const formData = new FormData();
  formData.append('nombre', this.form.nombre);
  formData.append('precio', this.form.precio);
  formData.append('descripcion', this.form.descripcion);
  formData.append('Categoria', this.form.Categoria);
  formData.append('subCategoria', this.form.subCategoria);
  formData.append('imagen', this.form.imagen);
  formData.append('imagenVieja', this.form.imagen_nombre);
  formData.append('token', this.token)

  console.log(formData)
    
        axios.put('http://localhost:3000/api/menu/menus/'+this.MenuId,formData)
        .then(datos =>{
            console.log(datos);  
          }) 
    
      }
    },
    
    
    mounted:function(){
        this.MenuId= this.$route.params.id;
        console.log("este es "+this.MenuId)

        this.token = localStorage.getItem("token");
        axios.get("http://localhost:3000/api/menu/"+this.MenuId).then(datos =>{
         
            this.form.id = datos.data._id
            this.form.Categoria = datos.data.Categoria
            this.form.descripcion = datos.data.descripcion
            this.form.nombre = datos.data.nombre
            this.form.precio = datos.data.precio
            this.form.subCategoria= datos.data.subCategoria
            this.form.imagen_nombre=datos.data.imagen_nombre
          
        })
        
    
            let direccion = "http://localhost:3000/api/menu/allMenu" ;
            axios.get(direccion).then( data =>{
              this.ListaUsuario= data.data;
                console.log(data.data)
            
                  // Obtener categorías únicas
                  this.categoriasUnicas = [...new Set(this.ListaUsuario.map(item => item.Categoria))].map(Categoria => ({ Categoria }));

                  // Obtener subcategorías únicas
                  this.subcategoriasUnicas = [...new Set(this.ListaUsuario.map(item => item.subCategoria))].map(subCategoria => ({ subCategoria }));
    
                console.log(this.categoriasUnicas);           
                
            });
        }
    }
    </script>

<style>
.btn-guardar {
  width: 550px;
  height: 50px;
  margin-bottom: -80px;
}
</style>