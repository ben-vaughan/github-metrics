import Vue from 'vue';
import Router from 'vue-router';
import App from './App.vue';
import '@/assets/main.css';

Vue.use(Router);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
