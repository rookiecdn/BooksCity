<!--
  *
    此组件是评论详细组件,用于显示用户评论的详细信息
    点击帖子详情页的简述评论调用
    此组件是独立的模板
  *
-->
<template>
    <div class="replyDetailed">
       <bscroll ref="bscroll">
           <article-reviews id="articleReviews" :in-detail="thisData">
               <!-- 评论详细页的头 -->
               <template v-slot:heads>
                   <div class="detailedTitle">
                       <div class="back" @click="backs()">
                           <img  src="~img/backs.png" alt="">
                       </div>
                       <div class="title">
                           详细
                       </div>
                       <div class="more">
                           <img src="~img/more.png" alt="">
                       </div>
                   </div>
               </template>
               <template v-slot:about>
                   <div class="heads">
                       <div class="text">
                           <a :href="goUrl" @click="senc(thisData[0])" class="btn btn-sm btn-primary">回复</a>
                       </div>
                       <div class="orderBy"><span class="btn btn-sm btn-primary">排序</span></div>
                   </div>
               </template>
               <!-- 评论详细页的所有内容 -->
               <template v-slot:myReplyConcise>
                   <!-- 评论我的所有评论 -->
                   <div v-for="(v,i) in thisRepys" class="item">
                   <!-- 在这里编写评论我的样式 -->
                       <div class="myreplys">
                           <div class="myreplyHead">
                               <div class="myreplyHeadImg">
                                   <img :src="setImgUrl(v.userImg)" alt="">
                               </div>
                               <div class="myreplyHeadNames">
                                   <div class="NamesAndDate">
                                       <span>{{v.userName}}</span>
                                       <span>{{v.createTime}}</span>
                                   </div>
                                   <div class="Loves">
                                       <img src="~img/loves.png" alt="">
                                       <span>{{v.userLoves}}</span>
                                   </div>
                               </div>
                           </div>
                           <div class="myreplysBodys">
                              <div class="textBody">
                                  {{v.userContentText}}
                              </div>
                               <div class="imgBody">
                                   <img v-for="Is in v.userContentImg" :src="setImgUrl(Is.img)" alt="">
                               </div>
                           </div>
                       </div>
                   </div>
               </template>
           </article-reviews>
       </bscroll>
    </div>
</template>

<script>
    //评论详情页
    import articleReviews from "./articleReviews";
    import bscroll from "../betterScroll/index"
    //获取我们保存的页面下面的指定的某一条详细的评论
    import {getDate, removeDate, setDate} from "../../storage"
    import $ from "jquery"
    //解析服务器获取的路径
    import {rootPath} from "../../pathAlias/replace";
    export default {
        name: "replyDetailed",
        data(){
            return {
                //一条一级评论和多个二级评论
                thisData:{},
                //分理处二级评论
                thisRepys:[],
                //判断登录状态
                loginState:false,
                //跳转路径
                goUrl:'#'
            }
        },
        methods:{
            backs(){
                history.back();
            },
            senc(value){
                //判断登录状态
                if(this.loginState){
                    //清除帖子articleId
                    removeDate('articleId')
                    //点击一级评论的回复,获取一级评论的id
                    setDate("id",value.id)
                    return
                }
                this.$store.commit("AppErrMSG",{
                    errArr:["未登录"],
                    isShow:true
                })
            }
        },
        mounted() {
            //获取文章id
            //处理数据
            let Data
            if(getDate('rps') == null){
                Data = JSON.parse(getDate('replyDetailed'))
                //保存选择的文章id
                setDate("selectArticledId",Data[0].articleId)
            }else {
                //如果是rps 获取后就销毁
                Data = JSON.parse(getDate('rps'))['data']
                removeDate('rps')
            }
            //默认保存的数据
            this.thisData = Data
            //获取id
            setDate("reId",this.thisData[0].id)
            this.thisRepys = this.thisData[0].thisReplys
            //判断登录状态
            //判断本地化是否有值
            let Brower = JSON.parse(getDate('loginMSG'))
            //获取state存储
            let House = this.$store.state.UserLoads
            //本地化没有值和state存储都没有值 就表示没有登陆
            if(Brower === null && House.id == null) {
                this.loginState = false
                this.goUrl = "javascript:;"
            }else {
                this.loginState = true
                this.goUrl = "/replays"
            }
            //刷新高度
            //等一下做监听刷新
            setTimeout(()=>{
                let appHeight = $(window).outerHeight(true)
                this.$refs.bscroll.setScrollHeight(appHeight)
                console.log("ok")
            },200)
        },
        updated() {
            //更新数据重新加载
            let appHeight = $(window).outerHeight(true)
            this.$refs.bscroll.setScrollHeight(appHeight)
        },
        computed:{
            //解析路径
            setImgUrl() {
                return (imgName)=>{
                    //i == 1  头像   i == 2 评论   i == 3  系统
                    return rootPath(imgName)
                }
            }
        },
        components:{
            articleReviews,bscroll
        }
    }
</script>

<style scoped lang="scss">
    .detailedTitle{
        display: flex;
        height: 50px;
        .back,.more{
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 50%;
            }
        }
        .title{
            flex: 5;
            display: flex;
            align-items: center;
            justify-content: center;
            color: chocolate;
        }
    }
    .heads{
        padding: 1vw 0;
        display: flex;
        justify-content: space-between;
        .text{
            font-size: 4vw;
        }
    }
    .myreplys{
        padding: 8px 5px;
        font-size: .7rem;
        display: flex;
        flex-direction: column;
        .myreplyHead{
            display: flex;
            .myreplyHeadImg{
                flex: 1;
                justify-content: center;
                align-items: center;
                img{
                    width: 10vw;
                    height: 10vw;
                    border-radius: 50%;
                }
            }
            .myreplyHeadNames{
                flex: 5;
                display: flex;
                justify-content: space-between;
                .NamesAndDate{
                    display: flex;
                    flex-direction: column;
                }
                .Loves{
                    display: flex;
                    align-items: center;
                    img{
                        width: 25px;
                        height: 25px;
                    }
                }
            }
        }
        .myreplysBodys{
            .textBody{
                padding: 3px 0;
            }
            .imgBody{
                img{
                    width: 20vw;
                    height: 20vw;
                    margin: 5px 5px 5px 0;
                    border-radius: 5px;
                }
            }
        }
    }
    .btn-sm, .btn-group-sm > .btn {
        font-size: 0.5rem;
        background: gray;
        border: 0;
    }
</style>