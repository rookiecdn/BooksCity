<template>
    <div class="index">
        <bscroll ref="bscroll" :BTT="true">
            <div class="index_title">
                全部消息
            </div>
            <div class="alerts" v-if="NewsData==null">
                请先登录哦
            </div>
            <div class="alerts" v-else-if="NewsData.length==0">
                空空如也
            </div>
            <div v-else class="allMSG">
                <div class="items" v-for="(news,index) in NewsData"  @click="toArticle(news['articleId'],news['id'],index)">
                        <!-- 三部分操作用户的头像 -->
                    <span v-if="!news['readed']" class="isNewMsg">
                        <img src="~img/msgNew.png" alt="">
                    </span>
                    <div class="items_userimg">
                        <img :src="setImgUrl(news['GetUser']['img'])" alt="">
                    </div>
                        <!-- 用户昵称, 点赞还是评论,操作日期  -->
                    <div class="items_msg">
                        <div>{{news['GetUser']['username']}}@{{!news['type']?"点赞":"评论"}}</div>
                        <div class="loves" v-if="!news['type']">
                            <img src="~img/loves.png" alt="">+1
                        </div>
                        <div class="replays" v-else>{{news['comment']}}</div>
                        <div>{{news['ctime']}}</div>
                    </div>
                        <!-- 简述信息 -->
                    <div class="items_article">
                        <div class="items_article_content">
                            {{news['GetArticle']==null?"帖子已删除":news['GetArticle']['textContent']}}
                        </div>
                    </div>
                </div>
            </div>
        </bscroll>
    </div>
</template>

<script>
    import bscroll from "../betterScroll/index"
    import $ from "jquery";
    import {getDate, setDate} from "../../storage";
    import {rootPath} from "../../pathAlias/replace";
    export default {
        name: "index",
        data(){
            return {
                NewsData:null
            }
        },
        mounted(){
            //初始化显示数据
            console.log(getDate("loginMSG"))
            if(getDate("loginMSG")==null || getDate("loginMSG")==undefined){
                return
            }
            let that = this
            //获取消息
            let tnd
            //先获取看看有没有值
            tnd = getDate("NewsData")==null?
                  this.$store.state.NewsData:
                  JSON.parse(getDate("NewsData"))
            //如果没有就获取
            if(tnd==null || tnd == undefined){
                that.$store.dispatch("AppGetMyMessage",JSON.parse(getDate("loginMSG")).id)
                console.log(that.$store.state.NewsData)
                that.NewsData = that.$store.state.NewsData
            }else{
                //有就直接赋值
                console.log(tnd)
                that.NewsData = tnd
            }
            setTimeout(()=>{
               let h = $(document).outerHeight(true)
               that.$refs.bscroll.setScrollHeight(h)
           },400)
        },
        methods:{
            toArticle(id,newID,arrIndex){
                //从指定的简介页跳转到详情页面,并保存当前帖子的详细信息
                let that = this
                that.$store.commit("AppLoadOnOFF",{
                    isShow:true
                })
                this.$store.dispatch('GetArticleHttpServer',{
                    //帖子的id
                    current:id,
                    //用户的id
                    authorId:JSON.parse(getDate("loginMSG")).id,
                    success(article){
                        //先将消息设置成为已读
                        //先获取指定的数据
                        let clickMSG = JSON.parse(getDate("NewsData"));
                        //设置本地已读
                        clickMSG[arrIndex]['readed'] = 1;
                        //重新保存
                        setDate("NewsData",JSON.stringify(clickMSG))
                        that.$store.commit("NewsDataSave",clickMSG)

                        //数据库修改状态
                        that.$store.dispatch("SetReaded",newID)
                        //
                        //加载成功后 关闭全局加载并跳转   关闭不需要传递默认值
                        that.$store.commit("AppLoadOnOFF")
                        //如果没有文章
                        if((article.length==0)){
                            that.$store.commit("AppPromptSuccess",{
                                msg:"文章不存在,或已被删除",
                                show:true,
                                success(){}
                            })
                            return
                        }
                        //有文章:
                        that.$router.push({path:'theArticleDetailed'})
                    }
                })
                console.log(id)
            }
        },
        computed:{
            //处理路由图片
            setImgUrl() {
                return (imgName)=>{
                    //i == 1  头像   i == 2 评论   i == 3  系统
                    return rootPath(imgName)
                };
            },
            //监听数据变化
            GetNewsData(){
                return this.$store.state.NewsData
            }
        },
        components:{
            bscroll
        },
        watch:{
            GetNewsData(){
               this.NewsData = this.GetNewsData
            }
        }
    }
</script>

<style scoped lang="scss">
    .index_title{
        font: {
            size: 5vw;
            size: 1.1rem;
        };
        text-align: center;
        padding: 3vw 5vw;
    }
    .alerts{
        text-align: center;
        color: cadetblue;
    }
    /*最外层*/
    .allMSG{
        /*模块*/
        .items{
            padding: 2vw;
            display: flex;
            position: relative;
            .isNewMsg{
                position: absolute;
                top: 0;
                left: 0;
                img{
                    width:7vw;
                }
            }
            /*头像盒子*/
            .items_userimg{
                flex: 1.5;
                display: flex;
                justify-content: center;
                img{
                    width: 10vw;
                    height: 10vw;
                    border-radius: 50%;
                }
            }
            /*数据盒子*/
            .items_msg{
                flex: 5;
                font: {
                    size: 4vw;
                    size: .8rem;
                };
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .loves{
                    img{
                        width: 8vw;
                    }
                }
                div:nth-child(1){
                    font-weight: 900;
                }
                div:nth-child(3){
                    font:{
                        weight: 100;
                        size: .5rem;
                    }
                    color: lightslategray;
                }
                .replays{
                    font-size: 4vw;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    font-size: .7rem;
                }
            }
            /*简述信息*/
            .items_article{
                flex: 1.5;
                display: flex;
                align-items: center;
                padding: 1vw;
                background: aliceblue;
                border-radius: 8px;
                .items_article_content{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    word-break: break-all;
                    font: {
                        size: 4vw;
                        size: .6rem;
                        weight: 200;
                    };
                }
            }
        }
    }
    .items:hover{
        background: #8d8d8d;
        transition: 0.225s;
    }
</style>