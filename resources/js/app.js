import bootstrap from './bootstrap';
import Vue from 'vue';
import router from './routes';
import store from './store';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import errorTextFormat from './filters/errorTextFormat';
import timeFormat from './filters/timeFormat';
import VeeValidate from 'vee-validate';
import axios from 'axios';

Vue.filter('timeFormat', timeFormat);
Vue.filter('errorTextFormat', errorTextFormat);

// VeeValidate
Vue.use(VeeValidate);
import veeValidateErrorMessageZhTW from 'vee-validate/dist/locale/zh_TW';
import veeValidateFieldNameZhTW from './i18n/zh_TW/attributes';

VeeValidate.Validator.localize('zh_TW', { ...veeValidateErrorMessageZhTW, ...veeValidateFieldNameZhTW });

// Fa icon
library.add(fas, fab);
Vue.component('font-awesome-icon', FontAwesomeIcon);

// Include All Components
const files = require.context('./components', true, /\.vue$/i);
files.keys().forEach(key => {
    Vue.component(key.split('/').pop().split('.')[0], files(key).default);
});

// Add global 403 error Handler
axios.interceptors.response.use(
    response => response,
    (error) => {
        switch (error.response.status) {
            case 403:
                router.push('/403');
                store.dispatch('auth/pushRequiredPermissions', error.response.data.data.required);
                break;
            default:
                return Promise.reject(error);

        }
    }
);

const vue = new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store,
});

