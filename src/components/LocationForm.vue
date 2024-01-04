<template>
  <div class="container" style="margin-bottom: 40px;">

  <h1 class="title is-1">PinMyPlace</h1>
  <h5 class="subtitle is-5">Location Sharing App</h5>

  <!-- Display the form only if location is not yet shared -->
    <div v-if="!locationShared">
      <form @submit.prevent="submitForm">
      
      <!-- Form to input name, phone number and share location -->
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input class="input" type="text" placeholder="Enter name" v-model="name">
          </div>
        </div>

        <div class="field">
          <label class="label">Phone Number</label>
          <div class="control">
              <vue-tel-input 
              v-model="phone" 
              mode="international"
              :preferred-countries="['ID', 'US', 'CA', 'GB']">
              </vue-tel-input>
          </div>
        </div>

        <div class="control">
          <button class="button is-primary">Share Location</button>
        </div>
      </form>
    </div>

    <!-- Message displayed after location is shared -->
    <div v-else>
      <p>Location shared!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LocationForm",
  data() {
    // Component state for form data and location shared status
    return {
      name: '',
      phone: '',
      latitude: null,
      longitude: null,
      locationShared: false
    };
  },
  methods: {
    // Method to handle form submission
    async submitForm() {
        console.log("submitForm triggered");
        // Check if browser supports geolocation
      if (navigator.geolocation) {
        // Get current position of the user
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            try {
                // Post data to the server
              const response = await this.$http.post('/api/submit-location', {
                name: this.name,
                phone: this.phone,
                latitude: this.latitude,
                longitude: this.longitude
              });
              console.log(response);
              console.log("Setting locationShared to true");
              // Update state to indicate location is shared
              this.locationShared = true;
            } catch (error) {
                // Handle errors such as server not reachable
              console.error(error);
            }
          },
          (error) => {
            // Handle errors in obtaining geolocation
            console.error("Error getting location: ", error);
          }
        );
      } else {
        // Handle case where geolocation is not supported by browser
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }
};
</script>