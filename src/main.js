import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false


//添加饿了么，网上有，就是照着做
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//引用axios用来做ajax请求
import './api/index'



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
