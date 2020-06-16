import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from '../components/login/login.vue'
const login=()=>import(/*webpackChunkName:'group-a'*/ '../components/login/login.vue')
 
const home=()=>import(/*webpackChunkName:'group-b'*/ '../components/home/home.vue')
 
const user=()=>import(/*webpackChunkName:'group-c'*/ '../components/home/homeChild/user.vue')

const roles=()=>import(/*webpackChunkName:'group-c'*/ '../components/home/homeChild/roles.vue')

const rights=()=>import(/*webpackChunkName:'group-c'*/ '../components/home/homeChild/rights.vue')

const shopCategories=()=>import(/*webpackChunkName:'group-d'*/ '../components/home/homeChild/shopManage/shopCategories.vue')

const params=()=>import(/*webpackChunkName:'group-d'*/ '../components/home/homeChild/shopManage/params.vue')

const shopList=()=>import(/*webpackChunkName:'group-d'*/ '../components/home/homeChild/shopManage/shopList.vue')

const addShop=()=>import(/*webpackChunkName:'group-e'*/ '../components/home/homeChild/shopManage/addShop.vue')

const orders=()=>import(/*webpackChunkName:'group-f'*/ '../components/home/homeChild/ordersManage/orders.vue')

const reports=()=>import(/*webpackChunkName:'group-g'*/ '../components/home/homeChild/reportsManager/reports.vue')

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
        path:'/categories',
        component:shopCategories
      },{
        path:'/params',
        component:params
      },{
        path:'/goods',
        component:shopList
      },{
        path:'/addShop',
        component:addShop
      },{
        path:'/orders',
        component:orders
      },{
        path:'/reports',
        component:reports
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
