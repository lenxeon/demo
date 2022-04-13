import Vue from 'vue'
import VueRouter from 'vue-router'
import AdminView from '../views/AdminView.vue'
import utils from '@/common/Utils.js';

Vue.use(VueRouter)

const routes = [
  {
    path: '/admin',
    name: 'admin',
    meta: { auth: "admin" },
    component: AdminView
  },
  {
    path: '/user',
    name: 'user',
    meta: { auth: "user" },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/UserView.vue')
  },
  {
    path: '/other',
    name: 'other',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/OtherView.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: { requiresAuth: false },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


const canView = function(user, auth){
  return user && user.auth && user.auth.indexOf(auth) >= 0;
}

//注册一个用来拦截页面访问权限的
router.beforeResolve(async(to, from, next) => {
  console.log(to.meta);
  if (to.meta) {
    if(to.meta.requiresAuth===false){
      //如果说这个页面不需要验证登陆
      next();
    } else{
      let user = utils.checkLogin();
      if(to.meta.auth){
        //如果说这个跳转的路由需要权限
        try {
          let result = await canView(user, to.meta.auth);
          if(result){
            console.log('验证有没有权限', user.auth, to.meta.auth, result);
            next();
          }
        } catch (error) {
          if (error) {
            // ... 处理错误，然后取消导航
            return false
          } else {
            // 意料之外的错误，取消导航并把错误传给全局处理器
            throw error
          }
        }
      } else {
        //那看看有没有登陆，如果没有登陆直接跳到登陆上面
        console.log(utils.checkLogin);
        if(user){
          next()
        } else{
          next({path:'/login', name:'login'})
        }
      }
    }
  }
})

export default router
