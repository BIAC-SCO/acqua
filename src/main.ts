import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/index';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';
import * as filters from '@/utils/FiltersMethods';
import * as moment from 'moment';
import { LoggingApi } from '@/api/LoggingApi';
import 'moment/locale/fr';
import '@/utils/Extensions';
moment.locale('fr');

Vue.config.productionTip = false;
Vue.config.keyCodes.f2 = 113;
Vue.config.keyCodes.del = 46;
Vue.config.keyCodes.plus = 107;

// Register global filter functions
Object.keys(filters).forEach((key) => {
  Vue.filter(key, (filters as { [key: string]: Function })[key]);
});

Vue.config.errorHandler = function(err: any, vm, info) {
  if (process.env.NODE_ENV === 'production') {
    LoggingApi.generateLog(err, vm, info);
  } else {
    console.log(err);
    console.log(vm);
    console.log(info);
  }
};

window.onerror = function(message, source, lineno, colno, error) {
  console.log('Exception: ', error);
};

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
