import { createApp } from 'vue';
import App from './App.vue';
import Oruga from '@oruga-ui/oruga-next';
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';
import axios from 'axios';
import 'bulma/css/bulma.css';

const globalOptions = {
    mode: 'auto',
  };

const app = createApp(App);


// Set axios to $http for global use
app.config.globalProperties.$http = axios;

// Enable Vue Devtools
if (process.env.NODE_ENV === 'development') {
    app.config.devtools = true;
  }
app.use(VueTelInput, globalOptions);
app.use(Oruga);
app.mount("#app");