<!--
   *
     显示搜索主页面的所有内容
   *
-->
<template>
    <div class="Search">
        <!-- 显示搜索框,点击跳转到/searchBody搜索页面 -->
         <div ref="search" class="search" @click="searc()">
             <span class="text"> {{text}} </span>
             <img src="~img/search.png" alt="">
         </div>
        <!-- 显示搜索的内容 -->
        <!-- setHeight 自动获取网页的长度 -->
        <search-results :scroll="scrollLast" :setHeight="setHeight"/>
    </div>
</template>

<script>
    import searchResults from "./searchResults";
    import $ from 'jquery'
    //数据为空时加载页面
    import upload from "../hint/upload";
    import {getDate} from "../../storage";
    export default {
        name: "SearchIndex",
        data(){
            return {
                text:'今日特使',
                setHeight:"",
                //上一次观看的scroll地址
                scrollLast:0
            }
        },
        mounted() {
            //设置默认值一次
            //开启动画
            //获取当前高度
            let that = this
            this.setHeight = $(window).outerHeight(true) - $(this.$refs.search).outerHeight(true)
            //跳转到之前访问位置
            let PositionY = getDate('SearchIndex')
            this.scrollLast = (PositionY==null || isNaN(PositionY))?0:parseInt(PositionY)
            console.log(this.scrollLast)
            //获取用户id
        },
        methods:{
            searc(){
                this.$router.push('/searchBody')
            },
        },
        components:{
            searchResults,
            upload
        },
        activated() {
            console.log("----------进activated--------");
        },
        deactivated() {
            console.log("----------进deactivated--------");
        }
    }
</script>

<style scoped>
    .search{
        display: flex;
        border: 1px solid #cdcdcd;
        margin: 3vw;
        justify-content: flex-end;
        align-items: center;
    }
    .search img{
        width: 7vw;
        margin-right: 3vw;
    }
    .text{
        color: #cdcdcd;
        margin: auto;
        font-size: 4vw;
        padding: 3vw;
    }
</style>