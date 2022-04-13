/**
 * 服务器相关的请求
 */
 import qs from 'qs'
 
 export default {
   /**
    * 登陆
    */
   login(id, password) {
    return $axios.get('/admin_login.json', {
      params: {
          id,
          password
      },
    })
   }
 }
 