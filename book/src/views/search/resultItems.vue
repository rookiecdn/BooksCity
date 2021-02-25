<!--
  *
     此模板主要是论坛简述的单个 模块
     此组件是模块 需要调用
  *
-->
<template>
    <div class="resultItems">
        <!-- 内部接受一个对象,不在内部循环在外部循环 -->
        <div class="items">
            <div class="itemsTitle">
                <slot name="userImg">
                    <img :src="authorImgName" ref="headImg" @load="loadImg()" alt="">
                </slot>
                <!-- 论坛简述的标题 -->
                <slot name="userTitle">
                    <span>
                     {{thisDATA.title}}
                    </span>
                </slot>
            </div>
            <div class="itemsBody">
                <div class="BodyHtml">
                    <!-- 你的论坛文章的描述50字以内 -->
                   <slot name="miaoshu">
                       {{thisDATA.content}}
                   </slot>
                </div>
                    <!-- 文章 -->
                <slot name="article"></slot>
                <div class="BodyTypes">
                    <span v-for="items in thisDATA.types" class="typeitem">{{items.typeValue}}</span>
                </div>
                <div class="aboutMessage">
                    <div>
                        <!-- 评论 -->
                        <img @click="Commonent(thisDATA.articleId,0,thisDATA.authorId)" src="~img/comment.png"  alt="">
                        <span>{{thisDATA.comment}}</span>
                    </div>
                    <div>
                        <!-- 点赞                               没点赞~img/loves.png   点赞~img/loveselect.png                 -->
                        <img @click="Commonent(thisDATA.articleId,1)" :src="IMGURL" :class="[{'animate':islike}]" alt="">
                        <span>{{thisDATA.loves}}
<!--                         {{islike}}-->
                        </span>
                    </div>
                    <div>
                        <img src="~img/dates.png" alt="">
                        <span>{{thisDATA.createTime}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    import {rootPath} from "../../pathAlias/replace";
    import {getDate, setDate} from "../../storage";
    import {format} from "../../pathAlias";
    export default {
        name: "resultItems",
        props:{
            thisData:{
                type:Array,
                default:[]
            }
        },
        data(){
            return {
                //显示数据
                thisDATA:{},
                //初始化时用户默认的头像
                authorImgName:"abc.jpg",
                //当前是否被点赞
                islike:false,
                //img地址
                IMGURL:""
            }
        },
        created() {
            console.log("组件创建")
        },
        mounted() {
            setTimeout(()=>{
                //获取帖子的简介信息
                this.thisDATA = this.thisData
                //初始化点赞默认值
                this.islike = (this.thisDATA.lovesPeops != null)?true:false
                //初始化时默认显示的头像
                this.IMGURL = format(((this.islike?'loveselect':'loves')+".png"),3)
                this.authorImgName = require('hmg/abc.jpg')
            },200)
        },
        methods:{
            //获取真实的头像
            loadImg(){
                this.authorImgName = this.setImgUrl(this.thisDATA.img)
            },
            //点击获取的文章id
            //添加一级评论
            Commonent(articleId,n,id=""){
                // n == 0  评论
                // n == 1  点赞
                //存放一级评论的id
                setDate("articleId",articleId)
                if(id!=""){
                    setDate("Aid",id)
                }
                //判断本地化是否有值
                let Brower = JSON.parse(getDate('loginMSG'))
                //获取state存储
                let House = this.$store.state.UserLoads
                //本地化没有值和state存储都没有值 就表示没有登陆  否则反之
                let that = this
                if(!(Brower === null && House.id == null)){
                    //判断路由是否合法
                    if(this.routeTest) return
                    if(n){
                        //判断边界值
                        this.islike = !this.islike
                        //更改数据
                        let DD = JSON.parse(getDate('CreateIndexMethod'))
                        //获取当前帖子的数据
                        let thisArticle = DD[getDate('Aindex')]
                        //通过初始值判断用户是否点赞
                        //操作前的用户点赞
                        let initDDLike = DD[getDate('Aindex')].lovesPeops
                        //如果为true就表示有数据,否则返回null
                        DD[getDate('Aindex')].lovesPeops = this.islike?{}:null
                        //操作后的用户点赞
                        let mountedLike = DD[getDate('Aindex')].lovesPeops
                        //判断用户是否对齐进行了更改
                        if(initDDLike === mountedLike){
                            //用户什么都没做
                            return
                        }else if(initDDLike == null && mountedLike != null){
                            //用户点赞了
                            // console.log(thisArticle)
                            //获取当前登录用户的id
                            let userId = (House.id == null)?Brower.id:House.id
                            // console.log(userId)
                            this.$store.dispatch("AppSendMSGHttpServer",{
                                articleId:thisArticle.articleId,  //帖子的id
                                type:0,       //0点赞  1评论
                                authorId:userId,    //评论用户的id
                                readed:0,     //0未读  1已读
                                toAuthorId:thisArticle.authorId,    //当前用户点赞的帖子是谁的
                                comment:""              //评论的内容
                            })
                            DD[getDate('Aindex')].loves+=1
                        }else if(initDDLike != null && mountedLike == null){
                            //用户取消了点赞
                            DD[getDate('Aindex')].loves-=1
                        }
                        //重新保存到本地
                        setDate('CreateIndexMethod',JSON.stringify(DD))
                        //处理
                        if(this.islike){
                            this.$store.commit('AppPromptSuccess',{
                                show:true,
                                msg:"点赞成功",
                                success() {
                                    that.thisDATA.loves+=1
                                }
                            })
                        }else{
                            that.thisDATA.loves-=1
                        }
                        //如果本地存储的有id  就选取本地id
                        let userId = JSON.parse(getDate("loginMSG"))['id']
                        //如果本地没有 就去Vuex仓库中查找
                        let ID = this.$store.state.UserLoads.id
                        this.$store.dispatch("AppLovesHttpServer", {
                            authorId:userId===null?ID:userId,
                            articleId:articleId
                        })
                        return
                    }
                    //进入评论页面
                    this.$router.push("/replays")
                }else{
                    this.$store.commit("AppErrMSG",{
                        errArr:["未登录"],
                        isShow:true
                    })
                }
            },
        },
        computed:{
            //处理路由图片
            setImgUrl() {
                return (imgName)=>{
                    //i == 1  头像   i == 2 评论   i == 3  系统
                    return rootPath(imgName)
                };
            },
            //处理路由
            routeTest(){
                return this.$route.name !== "theArticleDetailed"
            },
            //处理点赞图片
            setLikeIMG(){
                //监听点赞判断
                return this.islike
            }
        },
        watch:{
            setLikeIMG(){
                //处理监听
                this.IMGURL = format(((this.islike?'loveselect':'loves')+".png"),3)
            }
        }
    }
</script>

<style scoped lang="scss">
    .resultItems{
        padding: 2vw;
        display: flex;
        justify-content: center;
        flex-direction: column;
        .items{
            margin: 5px;
            padding: 5vw;
            box-shadow: #8d8d8d 0px 0px 1px 0px;
            border-radius: 4px;
            .itemsTitle{
                color: darkgray;
                font:{
                    size: 4vw;
                    family: 'fangsong';
                    weight: 900;
                };
                padding: 5px 0;
                display: flex;
                align-items: center;
                img{
                    width: 7vw;
                    height: 7vw;
                    margin: 0 5px 0 0;
                    border-radius: 50%;
                }
            }
            .itemsBody{
                padding: 3px 0;
                display: flex;
                flex-direction: column;
                .BodyHtml{
                    font-size: 4vw;
                    padding: 5vw 0;
                    font-weight: 100;
                }
                .article{
                    padding: 30px 0 10px 0;
                    font-size: 4vw;
                }
                .aboutMessage{
                    font-size: 11px;
                    height: 10vw;
                    display: flex;
                    div{
                        flex: 1;
                        margin: 0 11px 0 0;
                        display: flex;
                        img{
                            flex: 1;
                            width: 10vw;
                            min-width: 10vw;
                            margin: auto;
                        }
                        span{
                            flex: 1;
                            display: flex;
                            align-items: center;
                            text-align: center;
                            font-size: 4vw;
                        }
                    }
                }
                .BodyTypes{
                    display: flex;
                    flex-wrap: wrap;
                    margin: 3.3vw 0;
                    .typeitem{
                        padding: 1vw 2vw;
                        margin: 1vw;
                        background: cornflowerblue;
                        color: white;
                        font:{
                            size: 3vw;
                        }
                    }
                }
            }
        }
    }

    /* 点在动画 */
    .animate {
        animation: scaleDraw 1s ease-in-out;
    }
    /* 点赞动画效果一*/
    @keyframes scaleDraw{
        0% {
            transform: scale(1);  /*开始为原始大小*/
        }
        25% {
            transform: scale(1.1); /*放大1.1倍*/
        }
        50% {
            transform: scale(1);
        }
        75% {
            transform: scale(1.1);
        }
    }
</style>