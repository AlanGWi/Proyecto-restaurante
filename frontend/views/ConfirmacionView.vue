<template>
    <div class="container text-center">
      <h1>Confirmando pago...</h1>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    mounted() {
      this.confirmarPago();
    },
    methods: {
      confirmarPago() {
        const params = new URLSearchParams(window.location.search);
        const token_ws = params.get("token_ws");
  
        if (token_ws) {
          axios.post("http://localhost:3000/api/transbank/confirmar-transaccion", {
            token_ws
          })
          .then(response => {
            console.log("Pago confirmado:", response.data);
            alert("Pago exitoso!");
          })
          .catch(error => {
            console.error("Error al confirmar el pago:", error);
            alert("Error al confirmar el pago.");
          });
        }
      }
    }
  };
  </script>