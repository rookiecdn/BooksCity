<!--
   *
     此组件仅用于显示指定帖子的详细内容
     携带组件:  帖子简介内容和评论
   *
-->
<template>
    <div class="theArticleDetailed">
        <!-- 返回按钮和标题 -->
        <div class="detailedTitle">
            <div class="back">
                <img @click="backs()" src="~img/back.png" alt="">
            </div>
            <div class="title">
                标题
            </div>
            <div class="more">
                <img src="~img/more.png" alt="">
            </div>
        </div>
        <!-- 文章的信息 -->
        <bscroll ref="bscroll">
            <div class="detailedData">
                <!-- 文章主题 引用了简介模块 并添加了内容 -->
                <!-- love 标识当前用户是否对当前帖子进行了点赞 -->
                <result-items class="detailedDataItem" :this-data="articleData">
                    <template v-slot:userImg>
                        <img :src="setImgUrl(articleData.img)"  @load="loadImg()" alt="">
                    </template>
                    <template v-slot:userTitle>
                        <span>{{articleData.title}}</span>
                    </template>
                    <template v-slot:miaoshu>
                          {{articleData.content}}
                    </template>
                    <template v-slot:article>
                        <div class="article">
                           {{articleData.textContent}}
                        </div>
                        <div class="articleImg">
                        <!-- articleData.articleImgs -->
                            <div class="imgItem" v-for="(imgen,i) in articleData.articleImgs">
                                <img @click="check(setImgUrl(imgen.img))" :src="setImgUrl(imgen.img)" alt="">
                            </div>
                        </div>
                    </template>
                </result-items>
                <!-- 文章评论 -->
                <article-reviews>
                    <!-- 插槽heads -->
                    <template v-slot:heads>
                        <div class="reviewsListsTitle">
                            <span>评论</span>
                            <span>沸</span>
                        </div>
                    </template>
                     <!-- 评论简述的插槽在articleReviews模板中 -->
                </article-reviews>
            </div>
        </bscroll>
    </div>
</template>

<script>
    import $ from 'jquery'
    import bscroll from '../betterScroll/index'
    //搜索简述组件列表listItem
    import resultItems from "./resultItems";
    //文章评论组件
    import articleReviews from "./articleReviews";
    //解析路径
    import {rootPath} from "../../pathAlias/replace";
    //获取本地存储
    import {getDate} from "../../storage";

    export default {
        name: "theArticleDetailed",
        data(){
            return {
                //详细页的数据
                articleData:{},
                //作者的头像默认值
                authorImgName:'abc.jpg'
            }
        },
        mounted() {
            //获取一条针对点击的评论的所有信息（数据,分类等） 包含此文章的信息,此文章的评论,以及评论中对应的关系
            // console.log(this.$store.state.GetArticleAllMSG.length)
            if(this.$store.state.GetArticleAllMSG.length === 0){ //如果没有值 标识此页面被刷新了,那么就调用本地存储的值
                this.articleData = JSON.parse(getDate("GetArticleAllMSG"))[0]
            }else{
                this.articleData = this.$store.state.GetArticleAllMSG[0]
            }
            //scroll的高度
            setTimeout(()=>{
                let HeightData = $(window).outerHeight(true) - $('.detailedTitle').outerHeight(true)
                this.$refs.bscroll.setScrollHeight(HeightData)
                this.$store.commit("AppLoadOnOFF")
            },200)
        },
        methods:{
            backs(){
                history.back()
            },
            loadImg(){
                //作者的头像默认值 图片加载完成 动态修改img
                this.authorImgName = this.articleData.img
            },
            check(root){
                this.$store.commit("AppImgShow",{
                    show:true,
                    root:root
                })
            }
        },
        computed:{
            setImgUrl() {
                return (imgName)=>{
                    //i == 1  头像   i == 2 评论   i == 3  系统
                    return rootPath(imgName)
                };
            },
            //检测是否发生变化
            AllData(){
                return JSON.parse(getDate("GetArticleAllMSG"))
            }
        },
        created() {
            //开启加载动画
            this.$store.commit("AppLoadOnOFF",{
                isShow:true
            })
        },
        components:{
            bscroll,
            resultItems,
            articleReviews
        },
        watch:{
            AllData(){
                 this.articleData =  this.AllData
                console.log("数据改变")
            }
        }
    }
</script>

<style scoped lang="scss">
    .detailedTitle{
        display: flex;
        height: 50px;
        word-wrap:break-word;
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
    .article{
        word-wrap:break-word;
        font:{
            weight: 200;
            size: 4vw;
        }
    }
    .articleImg{
        display: flex;
        flex-wrap: wrap;
        padding: 3vw 0px;
        .imgItem{
            width: 30vw;
            height: 30vw;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 28vw;
                height: 28vw;
            }
        }
    }
    .reviewsListsTitle{
        display: flex;
        justify-content: space-between;
        font:{
            weight: 200;
            size: 4vw;
        }
        padding: 2vw 0;
        border-bottom: 1px solid thistle;
        span:nth-child(2){
            color: blueviolet;
        }
    }
    .myReplyName{
        color: cornflowerblue;
        font-weight: 500;
    }
    .itemsTitle{
        color: darkgray;
        font:{
            size: 17px;
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
</style>