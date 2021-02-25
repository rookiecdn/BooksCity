<!--
  *
  *  我的 模块  展示
  *
-->
<template>
    <div class="index">
        <bscroll ref="bscroll">
            <div class="indexBox">
                <!-- 头像和个人信息 -->
                <div class="itmes" disabled="!Logined" @click="Login()">
                    <div class="itmes-userIMG">
                        <img :src="USERIMG" alt="">
                    </div>
                    <div class="items-textMSG ID">
                        <div v-if="!Logined" class="MSGitems">昵称:{{userMSG.username}}</div>
                        <div v-if="!Logined" class="MSGitems">账号:{{userMSG.account}}</div>
                        <div v-if="Logined" class="MSGitems setUp">请登录</div>
                    </div>
                </div>
                <!-- 功能列表-->
                <div  v-if="!Logined"  class="itmes" v-for="mYitmes in listValue" @click="Events(mYitmes.id)">
                    <div class="itmes-userIMG">
                        <img :src="mYitmes.img" alt="">
                    </div>
                    <div class="items-textMSG">
                        <div class="MSGitems setUp">{{mYitmes.title}}</div>
                    </div>
                </div>
            </div>
        </bscroll>
    </div>
</template>

<script>
    import bscroll from "../betterScroll/index"
    //判断是否有登录记录
    import {getDate, removeDate, removeAll, setDate} from "../../storage";
    import {rootPath} from "../../pathAlias/replace"

    export default {
        name: "index",
        data(){
            return {
                //列表
                listValue:[
                    {
                        id:2,
                        title:"我的帖子",
                        img:require('img/booksitme.png')
                    },
                    {
                        id:3,
                        title:"我喜欢的",
                        img:require('img/myloves.png')
                    },
                    {
                        id:4,
                        title:"管理",
                        img:require('img/delete.png')
                    },
                    {
                        id:-1,
                        title: "退出",
                        img:require('img/out.png')
                    }
                ],
                //用户登录信息
                userMSG:{
                    //用户id标识
                    id:null,
                    //用户账号
                    account:null,
                    //昵称
                    username:null,
                    //头像地址
                    img:null,
                    sex:null
                },
                //默认url
                USERIMG:require("img/my.png")
            }
        },
        mounted() {
           //关闭跳转
            this.$store.commit("AppLoadOnOFF")
            console.log(getDate("loginMSG"))
            //判断本地存储的是否有值
           //  console.log(JSON.parse(getDate("loginMSG")))
           //  console.log(this.$store.state.UserLoads)
            if(getDate("loginMSG") === null){
               //初始化数据
               this.userMSG  = this.$store.state.UserLoads
           }else{
               let data = JSON.parse(getDate("loginMSG"))
               this.$store.commit("AppUserLoginSuccess",data)
           }
        },
        methods:{
            Events(id){
                var that = this
                //开启幕布
                //开启加载动画
                that.$store.commit("AppLoadOnOFF",{
                    isShow:true
                })
                switch (id) {
                    case -1:
                        //删除数据
                        that.$store.commit("AppUserLoginSuccess")
                        //提示
                        that.$store.commit("AppErrMSG",{
                            errArr:["退出成功"],
                            isShow:true
                        })
                        //清除所有本地缓存
                        removeAll()
                        this.$store.commit("AppLoadOnOFF")
                    break;
                    case 2:
                    case 3:
                    case 4:
                        if(getDate("loginMSG") == null){
                            that.$store.commit("AppErrMSG",{
                                errArr:['未登录'],
                                isShow:true
                            })
                            return
                        }
                        if(id==3){
                            //获取我喜欢的
                            that.$store.dispatch("AppMyLovesArticleHttpServer",{
                                //用户id
                                authorId:that.userMSG.id,
                                //默认显示五条
                                len:5
                            }).then(d=>{
                                setDate("LOVESDATA",JSON.stringify(d.data))
                                that.$router.push({
                                    path:'/myarticle/600/1'
                                })
                                //关闭幕布
                                that.$store.commit("AppLoadOnOFF")
                            })
                            return
                        }
                        that.$store.dispatch("AppGetMyArticleHttpServer",{
                            id:this.userMSG.id,
                            success(){
                                //获取我的帖子,进行分组编辑
                                let url = {
                                    path:"",
                                }
                                if(id==4){
                                    url.path = "/manage"
                                }else{
                                    url.path = "/myarticle/400/0"
                                }
                                that.$router.push(url)
                                //关闭幕布
                                that.$store.commit("AppLoadOnOFF")
                            }
                        })
                    break;
                }
            },
            Login(){
                let that = this
                //开启幕布
                //开启加载动画
                that.$store.commit("AppLoadOnOFF",{
                    isShow:true
                })
                if(that.userMSG.id === null || typeof that.userMSG.id === 'undefined'){
                    that.$store.commit("AppLoadOnOFF",{
                        state:"执行",
                        showMSG:"正在跳转",
                        isShow:true
                    })
                    that.$router.push("/login")
                    //关闭幕布
                    that.$store.commit("AppLoadOnOFF")
                }else{
                    //开启加载动画
                    that.$store.commit("AppLoadOnOFF",{
                        isShow:true
                    })
                    //跳转到我的个人信息里面,可以进行修改
                    that.$router.push("/personalData")
                   //去修改页面关闭幕布
                }
            }
        },
        computed:{
            //判断用户是否登录
            Logined(){
                return this.userMSG.id == null
            },
            UserLoads() {
                return this.$store.state.UserLoads
            }
        },
        watch:{
            UserLoads(){
                this.userMSG = this.UserLoads
                this.USERIMG = rootPath(this.userMSG.img)
            }
        },
        components:{
            bscroll
        }
    }
</script>

<style scoped lang="scss">
    .indexBox{
        .itmes{
            padding: 0 4vw;
            margin: 5vw;
            height: 12vh;
            height: 4.9rem;
            background: aquamarine;
            display: flex;
            .itmes-userIMG{
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 70%;
                    border-radius: 50%;
                }
            }
            .items-textMSG{
                padding: 3vw;
                flex: 4;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .MSGitems{
                    padding:1vw 0 0 0;
                    font-weight: 200;
                }
                .setUp{
                    font-size: 5vw;
                }
            }
            .ID{
                font-size: 4vw;
            }
            .loginOut{
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 70%;
                }
            }
        }
    }
</style>