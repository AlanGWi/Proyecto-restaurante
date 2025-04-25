<template>
  <div>
    <HederViewVue></HederViewVue>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">dias</div>
            <div class="card-body">
              <canvas id="myChartDays" ></canvas> 
            </div>
          </div>
        </div>
      </div>


      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">meses</div>
            <div class="card-body">
              <canvas id="myChartMonths" ></canvas> 
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">años</div>
            <div class="card-body">
              <canvas id="myChartYears" ></canvas> 
            </div>
          </div>
        </div>
      </div>
    

</template>

<script>
import { Chart } from 'chart.js/auto';
import axios from "axios";
import HederViewVue from '@/components/HederView.vue'
export default {
  name: "PedidosGraficaVue",
  components:{
  HederViewVue
},
  data() {
    return {
      title: "Gráfica de pedidos eliminados por día, mes y año",
      chartDays: null,
      chartMonths: null,
      chartYears: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {

    async fetchData() {
  try {
    const response = await axios.get("http://localhost:3000/api/pedidos/pedidos");
    const data = response.data.filter((pedido) => pedido.eliminado === true);
    console.log(data);
    const groupedData = data.reduce((accumulator, current) => {
  const date = new Date(current.fecha);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const yearMonthKey = `${year}-${month}`;
  const yearMonthDayKey = `${year}-${month}-${day}`;
  const yearKey = `${year}`;


  if (!accumulator.year[yearKey]) {
    accumulator.year[yearKey] = { date: yearKey, total: 0 };
  }
  if (!accumulator.yearMonth[yearMonthKey]) {
    accumulator.yearMonth[yearMonthKey] = { date: yearMonthKey, total: 0 };
  }
  if (!accumulator.yearMonthDay[yearMonthDayKey]) {
    accumulator.yearMonthDay[yearMonthDayKey] = { date: yearMonthDayKey, total: 0 };
  }
  
  console.log(yearKey)
  accumulator.year[yearKey].total += parseInt(current.precio) * parseInt(current.cantidad);
  accumulator.yearMonth[yearMonthKey].total += parseInt(current.precio) * parseInt(current.cantidad);
  accumulator.yearMonthDay[yearMonthDayKey].total += parseInt(current.precio) * parseInt(current.cantidad);
  console.log(yearMonthDayKey, accumulator.yearMonthDay[yearMonthDayKey].total);
  return accumulator;
}, { year: {}, yearMonth: {}, yearMonthDay: {} });
    console.log(groupedData.year)

    const dateValuePairs = Object.entries(groupedData.yearMonthDay)
  .map(([dateStr, { total }]) => ({ date: new Date(dateStr), total }))
  .filter(({ date }) => (Date.now() - date.getTime()) / (24 * 60 * 60 * 1000) <= 7);
 

  const dayLabels = dateValuePairs.map(({ date }) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
});
const dayValues = dateValuePairs.map(({ total }) => total);

    console.log(dateValuePairs);

    this.createChartDays(dayLabels, dayValues);


    const dateValuePairsMonths = Object.entries(groupedData.yearMonth)
    .map(([dateStr, { total }]) => ({ date: new Date(dateStr), total }))
    .filter(({ date }) => (Date.now() - date.getTime()) / (24 * 60 * 60 * 1000) <= 365)
    .sort((a, b) => a.date - b.date);

  const monthLabels = dateValuePairsMonths.slice(-12).map(({ date }) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month}`;
  });

  const monthValues = dateValuePairsMonths.slice(-12).map(({ total }) => total);

      console.log(dateValuePairsMonths);
      this.createChartMonths(monthLabels, monthValues);

      const yearData = Object.values(groupedData.year);

      // Ordenar el array por año
      yearData.sort((a, b) => a.date - b.date);

      // Crear arrays para las etiquetas del eje X (años) y los valores del eje Y (precios acumulados)
      const yearLabels = yearData.map(({ date }) => date);
      const yearValues = yearData.map(({ total }) => total);

      const latestYearLabels = yearLabels.slice(-5);
      const latestYearValues = yearValues.slice(-5)

      // Llamar a la función createChartYears con los arrays de etiquetas y valores
      this.createChartYears(latestYearLabels, latestYearValues);


      

  } catch (error) {
    console.error(error);
  }
},
createChartDays(dayLabels, dayValues) {
  // Aquí va el código que crea el gráfico
  const config = {
    type: 'line',
    data: {
      labels: dayLabels,
      datasets: [{
        label: 'Precios Acumulados por Día',
        data: dayValues,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  };
   new Chart(
    document.getElementById('myChartDays'),
    config
  );
},
createChartMonths(monthLabels, monthValues) {
  // Aquí va el código que crea el gráfico
  const config = {
    type: 'line',
    data: {
      labels: monthLabels,
      datasets: [{
        label: 'Precios Acumulados por meses',
        data: monthValues,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  };
   new Chart(
    document.getElementById('myChartMonths'),
    config
  );
},

createChartYears(latestYearLabels, latestYearValues) {
  // Aquí va el código que crea el gráfico
  const config = {
    type: 'line',
    data: {
      labels: latestYearLabels,
      datasets: [{
        label: 'Precios Acumulados por años',
        data: latestYearValues,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  };
   new Chart(
    document.getElementById('myChartYears'),
    config
  );
}

}

}


</script>
  
  <style scoped>
  .card-header {
    background-color: #393636;
    color: rgb(255, 252, 252);
    font-weight: bold;
  }
  .card {
  background-color: #f9f4f4;
  color: #ffffff;
}
  </style>