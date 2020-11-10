import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import '@/assets/scss/common.scss';

import router from './router'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default global options } */)

import axios from 'axios';
Vue.prototype.$http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/web/api'
})

import FastClick from './assets/js/fastclick';
window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);
// 多指默认事件禁止
document.documentElement.addEventListener('touchmove', function(e) {
    if(e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
