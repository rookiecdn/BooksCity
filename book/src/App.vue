<template>
  <div id="app">
      <!-- 全局组件 -->
      <upload class="upload"/>
      <err/>
      <prompt/>
      <showImg/>
      <nav-bottom/>
      <router-view></router-view>
      <!-- 缓存指定 -->
<!--      <router-view v-slot="{ Component }">-->
<!--          <keep-alive include="myarticle" max="1">-->
<!--              <component class="view" :is="Component"/>-->
<!--          </keep-alive>-->
<!--      </router-view>-->
  </div>
</template>
<script>
//全局bottom菜单
import navBottom from "./views/nav/navBottom";
//全局加载样式
import upload from "./views/hint/upload";
//全局错误提示样式
import err from "./views/hint/err";
//全局提示
import prompt from "./views/hint/prompt";
//全局图片加载
import showImg from "./views/hint/showImg";
export default {
  name: 'app',
  components: {
    navBottom,
    upload,
    err,
    prompt,
    showImg
  },
  computed:{
    GetRouterName(){
      return this.$route.name
    }
  },
  watch:{
    GetRouterName(){
      //当路由发生改变 并且路由地址非导航页面
      let indexURL = ["SearchIndex","writeIndex","message","my"]
      let boo = ( indexURL.indexOf(this.GetRouterName)==-1) ? false : true
      this.$store.commit('NoneAppBottom',boo)
    }
  }
}
</script>

<style>
  #app{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>
