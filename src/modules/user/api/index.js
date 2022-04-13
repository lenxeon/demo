/**
 * 服务器相关的请求
 */
 import qs from 'qs'
 
 export default {
   /**
    * 登陆
    */
   login(id, password) {
     console.log(id, password);
    //模拟登陆不同的角色
    return $axios.get(`/${id}_login.json`, {
      params: {
          id,
          password
      },
    })
   }
 }
 