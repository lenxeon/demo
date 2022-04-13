import store from '../store/index'
import router from '../router/index'
import Vue from 'vue'
import ElementUI from 'element-ui'
import qs from 'qs'

window.qs = qs

import axios from 'axios'

//发送请求全局拦截，就是每个请求都会执行这里
axios.interceptors.request.use(
  (config) => {
    //这里是为了将关闭请求的token存入全局的store，说白了就是一个window上的全局数组，这样如果切换页面的时候，就可以把之前的请求都关闭了
    config.cancelToken = new axios.CancelToken(function (cancel) {
      store.pushToken({
        cancelToken: cancel,
      })
    })
  },
  (error) => {
    return Promise.reject(error)
  }
)

//设置一些默认的header信息，比如默认的头信息用json方式。
// axios.defaults.baseURL = 'http://localhost:8092/';
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN'
// application/x-www-form-urlencoded;charset=ISO-8859-1
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8'

window.$axios = axios.create({
  baseURL: '/',
  // headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  // },
  validateStatus: function (status) {
    return status < 400
  },
})

window.$axiosTokens = []

$axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // $LoadingBar.start();
    config.cancelToken = new axios.CancelToken(function (cancel) {
      $axiosTokens.push(cancel)
    })

    config.paramsSerializer = (params) => {
      //拦截，给每一个请求，添加上ticket参数，这个参数的值是从本地的localStoreage上读出来的，登陆成功的地方会把服务器给的ticket凭证写进去
      let ticket = localStorage.getItem('ticket')
      if (ticket) {
        params.ticket = ticket
      }
      //qs 用来把对象格式化成表单的样式
      return qs.stringify(params, { indices: false })
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

//通用的返回r拦截
$axios.interceptors.response.use(
  (response) => {
    // $LoadingBar.finish();
    switch (response.status) {
      case 201: {
        //遇到201表示创建成功，因为201服务器不直接返回创建的结果，而是给一个location，里面是
        let location = response.headers['location']
        if (location) {
          return $axios.get(location)
        }
        break
      }
      //401认为是没有登陆，反正这个就是后端定的，跳登陆去
      case 401: {
        $router.push('/users/login')
        break
      }
    }
    return response
  },
  (error) => {
    window.console.log(
      '----------------------------------error------------------------------------',
      error.response
    )
    // $LoadingBar.error();
    if (axios.isCancel(error)) {
      // console.log('Request canceled==============>');
      return Promise.reject()
    } else {
      if (error.response) {
        switch (error.response.status) {
          case 401: {
            // // 401 清除token信息并跳转到登录页面
            // store.commit(types.LOGOUT);
            router.replace({
              path: '/users/login',
              query: {},
            })
            break
          }
          // case 404: {
          //     console.log(error.response)
          //     router.replace({
          //         path: '/404',
          //         query: {redirect: router.currentRoute.fullPath}
          //     })
          //     break;
          // }
        }
      }
      let data = error.response && error.response.data
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (ex) {}
      }

      // window.console.log("----------------------------------error2------------------------------------", data && data.errorMsg && data.errorMsg != '');
      if (data && data.errorMsg) {
        ElementUI.Message({
          message: data.errorMsg,
          type: 'error',
        })
      } else {
        ElementUI.Message({
          message: '未定义的系统错误',
          type: 'error',
        })
      }

      // window.console.log("----------------------------------error------------------------------------");
      // window.console.log(error.response);
      return Promise.reject(data)
    }
  }
)

window.$API = global.$API = {}
const routersContext = require.context('@/modules', true, /api\/index.js$/)
window.console.log('routersContext===>', routersContext.keys())

routersContext.keys().map((key) => {
  let router = routersContext(key).default
  key = key.substr(2) //remove ./
  key = key.substr(0, key.indexOf('/'))
  global.$API[key] = router
})
