import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login/login.vue'
import home from '../components/home/home.vue'
import user from '../components/home/homeChild/user.vue'
import roles from '../components/home/homeChild/roles.vue'
import rights from '../components/home/homeChild/rights.vue'
import shopList from '../components/home/homeChild/shopManage/shopList.vue'
import params from '../components/home/homeChild/shopManage/params.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path:'',
    redirect:'/login'
  },
  {
    path: '/login',
    component: login
  },{
    path:'/home',
    component:home,
    children:[
      {
        path:'/users',
        component:user
      },
      {
        path:'/roles',
        component:roles,
      },{
        path:'/rights',
        component:rights
      },{
        path:'/goods',
        component:shopList
      },{
        path:'/params',
        component:params
      }
    ]
  }
]



const router = new VueRouter({
  routes,
})

router.beforeEach((to,from,next)=>{
  if(to.path==='/login')return next()
  if(!sessionStorage.getItem('token'))return next('/login')
  next()
})


export default router
