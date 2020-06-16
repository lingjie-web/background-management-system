import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import { Message } from "element-ui";
import './assets/font_1838581_jib3ul41fok/iconfont.css'
import './assets/font_manus/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'
import echarts from 'echarts'
import loadsh from 'lodash'

Vue.use(ElementUI)
Vue.component(ZkTable.name, ZkTable)
Vue.prototype.$echarts=echarts

Vue.prototype.$lodash=loadsh

Vue.prototype.$http=axios
axios.defaults.baseURL='http://119.23.53.78:8888/api/private/v1'
axios.interceptors.request.use(function (config) {
  config.headers.Authorization=sessionStorage.getItem('token')
  return config
});

Vue.prototype.$message=Message

Vue.config.productionTip = false

Vue.filter('dateFil',function (par) {
  const date = new Date(par);
  const Y = date.getFullYear();
  const M = (date.getMonth()+1+'').padStart(2,'0');
  const D = (date.getDay()+'').padStart(2,'0');
  const h = (date.getHours()+'').padStart(2,'0');
  const m = (date.getMinutes()+'').padStart(2,'0');
  return `${Y}-${M}-${D} ${h}:${m}`
})

new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')
