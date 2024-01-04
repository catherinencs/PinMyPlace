<template>
  <LocationForm/>
    <MapAndTable/>
</template>

<script>
import LocationForm from './components/LocationForm.vue'
import MapAndTable from './components/MapAndTable.vue'


export default {
  name: 'App',
  components: {
    LocationForm,
    MapAndTable,
  }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
