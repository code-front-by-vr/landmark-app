import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { auth, onAuthStateChanged } from './api/firebase';
import { useAuthStore } from './stores/auth';

const app = createApp(App);

app.use(createPinia());
app.use(router);

const store = useAuthStore();

onAuthStateChanged(auth, user => {
  if (user) {
    store.setUser(user);
  } else {
    store.clearUser();
  }
});

app.mount('#app');
