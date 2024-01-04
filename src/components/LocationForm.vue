<template>
  <div class="container">
    <div v-if="!locationShared">
      <form @submit.prevent="submitForm">
      
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input class="input" type="text" placeholder="Enter name" v-model="name">
          </div>
        </div>

        <div class="field">
          <label class="label">Phone Number</label>
          <div class="control">
              <vue-tel-input v-model="phone" mode="international"></vue-tel-input>
          </div>
        </div>

        <div class="control">
          <button class="button is-primary">Share Location</button>
        </div>
      </form>
    </div>
    <div v-else>
      <p>Location shared!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LocationForm",
  data() {
    return {
      name: '',
      phone: '',
      latitude: null,
      longitude: null,
      locationShared: false
    };
  },
  methods: {
    async submitForm() {
        console.log("submitForm triggered");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            try {
              const response = await this.$http.post('/api/submit-location', {
                name: this.name,
                phone: this.phone,
                latitude: this.latitude,
                longitude: this.longitude
              });
              console.log(response);
              console.log("Setting locationShared to true");
              this.locationShared = true;
            } catch (error) {
              console.error(error);
            }
          },
          (error) => {
            console.error("Error getting location: ", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }
};
</script>

<style>
/* Bulma */
</style>
