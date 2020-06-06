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

Vue.use(ElementUI)
Vue.component(ZkTable.name, ZkTable)

Vue.prototype.$http=axios
axios.defaults.baseURL='http://119.23.53.78:8888/api/private/v1'
axios.interceptors.request.use(function (config) {
  config.headers.Authorization=sessionStorage.getItem('token')
  return config
});

Vue.prototype.$message=Message

Vue.config.productionTip = false



new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')
