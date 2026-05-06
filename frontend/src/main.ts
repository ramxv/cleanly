import { createApp } from 'vue';
import { Quasar } from 'quasar';
import App from './App.vue';
import { router } from './router';
import { runSeed } from './utils/seed';

import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import './styles/main.css';

// Ejecutar seed antes de montar la app
runSeed();

const app = createApp(App);
app.use(router);
app.use(Quasar, { plugins: {} });
app.mount('#app');
