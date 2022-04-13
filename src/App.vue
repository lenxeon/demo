<template>
  <div id="app">
    <nav>
      <router-link to="/admin">Admin</router-link> |
      <router-link to="/user">User</router-link> |
      <router-link to="/other">Other</router-link> |
      <router-link to="/login">Login</router-link>
    </nav>
    <router-view/>
    <div>
      <ul>
        <li>假定登陆页面不登陆就可以看</li>
        <li>假定user页面只要登陆了就能看，登陆的人拥有最低权限user</li>
        <li>假定admin页面需要有管理权限的人才能看到</li>
      </ul>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
