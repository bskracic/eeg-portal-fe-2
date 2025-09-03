import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n';
import router from './router';

import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import { useAuthStore } from './stores/authStore';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(i18n)
app.use(ToastService);
app.use(ConfirmationService);
app.use(pinia);

const authStore = useAuthStore();
authStore.initializeAuth()

app.mount('#app');
