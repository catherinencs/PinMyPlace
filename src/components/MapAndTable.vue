<template>
  <div>
    <!-- Title for locations section -->
    <h2>Locations</h2>
    <!-- Container for the Google Map -->
    <div id="map" style="height: 400px;"></div>
    <!-- Table to display location data -->
    <table>
      <!-- Table headers -->
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone Number</th>
          <th>Latitude</th>
          <th>Longitude</th>
        </tr>
      </thead>
      <!-- Table body with data from locations -->
      <tbody>
        <!-- Loop through locations and display each location's data in a row -->
        <tr v-for="location in locations" :key="location._id">
          <td>{{ location.name }}</td>
          <td>{{ location.phone }}</td>
          <td>{{ location.latitude }}</td>
          <td>{{ location.longitude }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/* global google */

import axios from 'axios';

export default {
  name: 'MapAndTable',
  data() {
    return {
      locations: [], // Array to store locations fetched from server
      map: null // Google map instance
    };
  },
  mounted() {
    // Fetch locations and initialize map when component is mounted
    this.fetchLocations();
    this.initMap();
  },
  methods: {
    initMap() {
      // Initialize the Google map with default center and zoom level
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45.5, lng: 9.2 }, // Default center (in this case, Europe since most locations shared are here)
        zoom: 5 // Default zoom level
      });
    },
    async fetchLocations() {
      // Fetch locations from server
      try {
        const response = await axios.get('http://localhost:8083/api/locations');
        this.locations = response.data;
        // Add a marker on the map for each location
        this.locations.forEach(location => {
          this.addMarker(location);
        });
      } catch (error) {
        // Handle errors in fetching locations
        console.error('Error fetching locations:', error);
      }
    },
    addMarker(location) {
      // Create content string for info window with location data
      const contentString = `<div id="content">
        <h1 id="firstHeading" class="firstHeading">${location.name}</h1>
        <div id="bodyContent">
        <p><b>Phone:</b> ${location.phone}</p>
        <p><b>Latitude:</b> ${location.latitude}</p>
        <p><b>Longitude:</b> ${location.longitude}</p>
        </div>
        </div>`;

      // Create a new info window with the content string
      const infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      // Create a new marker on the map at the location's coordinates
      const marker = new google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: this.map
      });

      // Add event listeners to show and hide the info window on mouseover and mouseout
      marker.addListener("mouseover", function() {
        infowindow.open(this.map, marker);
      });

      marker.addListener("mouseout", function() {
        infowindow.close();
      });
    }
  }
};

</script>

<style>
/* TODO: Bulma CSS */
</style>
