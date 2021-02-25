<!--
  *
    此组件用于存放公共样式的底部导航
  *
-->
<template>
    <div class="navBottom">
        <div class="nav" v-show="show">
            <a class="navItems" v-for="(item,i) in list" @click="trans(item.url,i)">
                <div :class="['itemImg',{'avtive':i==current}]">
                    <img class="imgItem" :src="item.imgurl" alt="">
                </div>
                <div class="itemText">
                    {{item.listName}}
                </div>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "navBottom",
        data(){
            return {
                list:[
                    {
                        listName:"推荐",
                        url:"/",
                        imgurl:require('img/tj.png')
                    },
                    {
                        listName:"创作",
                        url:"/writeIndex",
                        imgurl:require('img/tch.png')
                    },
                    {
                        listName:"消息",
                        url:"/message",
                        imgurl:require('img/xx.png')
                    },
                    {
                        listName:"我的",
                        url:"/my",
                        imgurl:require('img/my.png')
                    }
                ],
                show:true,
                current:0
            }
        },
        methods:{
            trans(url,index){
                this.current = index
                this.$router.push(url)
            }
        },
        computed:{
            GetStoreAppBottom(){
                return this.$store.state.AppBottom
            }
        },
        mounted() {
            this.show = this.$store.state.AppBottom
        },
        watch:{
            GetStoreAppBottom(){
                this.show = this.GetStoreAppBottom
            }
        }

    }
</script>

<style scoped lang="scss">
    .navBottom{
        width: 100%;
        background: white;
        padding: 0 3vw;
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 1;
    }
    .nav{
        display: flex;
        a{
            text-decoration: none;
            color: #8d8d8d;
        }
        .navItems{
            flex: 1;
            height: 20vw;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 4vw;
            font-weight: 200;
            flex-direction: column;
            .itemImg{
                img{
                    width: 9vw;
                }
            }
            .avtive{
                img{
                    transition:.25s ease-in-out;
                    width: 10vw;
                }
            }
        }
    }
</style>