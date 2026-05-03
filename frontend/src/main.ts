import { createApp } from 'vue';
import { Quasar } from 'quasar';
import App from './App.vue';
import { router } from './router';

import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import './styles/main.css';

const app = createApp(App);
app.use(router);
app.use(Quasar, { plugins: {} });
app.mount('#app');
