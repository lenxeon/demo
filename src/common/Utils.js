const checkLogin = () =>{
    let user = localStorage.getItem('user');
    if(user!=null){
      return JSON.parse(user);
    } else {
      return null;
    }
}
export default {
    checkLogin
}