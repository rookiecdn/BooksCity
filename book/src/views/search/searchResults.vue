<!--
  *
      此组件用于显示搜索结果的简介
      点击想要查看的论坛,进入查看
  *
-->
<template>
    <div class="searchResults">
        <bscroll ref="bscroll" :BTT="true">
           <div class="result">
               <!-- 数据由此处循环 resultItems是一个模块 使用数据循环这个模块 -->
               <!-- 输出所有的数据简介列表,将查询的所有数据简介输出下来 -->
               <result-items v-for="(v,i) in dataItem" :this-data="v" @click.native.stop="TheArticleDescribes(v.articleId,i)"></result-items>
            </div>
        </bscroll>
    </div>
</template>

<script>
    import $ from 'jquery'
    import bscroll from '../betterScroll/index'
    import resultItems from "./resultItems"
    //加载页面
    import upload from "../hint/upload";
    import {getDate, setDate} from "../../storage";
    export default {
        name: "searchResults",
        props:{
            setHeight:{
                type:Number,
            },
            scroll:{
                type:Number,
                default:0
            }
        },
        data(){
            return {
                //返回的结果集
                dataResults : [],
                //获取searchIndex传递的dataArr
                dataItem:[],
                //请求返回的简介数据,包含（头像,标题,叙述,作者,日期,点赞,类型,和评论）
            }
        },
        components:{
            bscroll,
            resultItems,
            upload
        },
        created() {
            //开启加载动画
            this.$store.commit("AppLoadOnOFF",{
                isShow:true
            })
        },
        mounted() {
            setTimeout(()=>{
                let authorID
                if(getDate("loginMSG") == null){
                    authorID = null
                }else {
                    authorID = JSON.parse(getDate("loginMSG")).id
                }
                //判断本地是否有存储 CreateIndexMethod ,有的话直接从本地获取
                console.log(JSON.parse(getDate('CreateIndexMethod')))
                let that = this
                if(getDate('CreateIndexMethod')!=null){
                    that.dataItem = JSON.parse(getDate('CreateIndexMethod'))
                    //关闭加载动画   关闭不需要传参数
                    that.$store.commit("AppLoadOnOFF")
                }else{
                    that.$store.dispatch('CreateIndexHttpServer',{
                        authorId:authorID,
                        success(){
                            //传递值
                            that.dataItem = that.$store.state.AppInitialization
                            //关闭加载动画   关闭不需要传参数
                            that.$store.commit("AppLoadOnOFF")
                        }
                    })
                }
               setTimeout(()=>{
                   this.$refs.bscroll.setScrollHeight(this.setHeight)
                   //刷新上一次的访问地址
                   if(this.scroll){
                       this.$refs.bscroll.setScrollTop(this.scroll)
                   }
               },500)
            },100)
        },
        methods:{
            //文章描述
            TheArticleDescribes(current,index){
                //current现在传递的是数组下标,等数据完善后传递的是帖子的id
                // 存放下标
                setDate("Aindex",index)
                //文章详情  current 表示的是点击的第几个简述文章
                //将点击的文章简介数据存放到本地,在theArticleDetailed组件中显示
                //从指定的简介页跳转到详情页面,并保存当前帖子的详细信息
                let that = this
                that.$store.commit("AppLoadOnOFF",{
                    isShow:true
                })
                let authorId
                if(getDate("loginMSG") == null){
                    authorId = null
                }else {
                    authorId = JSON.parse(getDate("loginMSG")).id
                }
                this.$store.dispatch('GetArticleHttpServer',{
                    //帖子的id
                    current,
                    //用户的id
                    authorId,
                    success(article){
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
            }
        },
        computed:{
          D(){
              return this.$store.state.AppInitialization
          }
        },
        watch:{
            D(){
                console.log("值发生了变化")
                this.dataItem = this.D
                setTimeout(()=>{
                    //刷新高度
                    this.$refs.bscroll.RefreshTheHeight()
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .searchResults{
        padding: 10px;
    }
    .result{
        display: flex;
        justify-content: center;
        flex-direction: column;
        .items{
            background: whitesmoke;
            border:{
              color:grey;
              width: 0;
              style: solid;
              radius: 8px;
            };
            margin: 5px;
            padding: 20px;
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
            .itemsBody{
                padding: 3px 0;
                font-size: 12px;
                display: flex;
                flex-direction: column;
                .BodyHtml{
                    font-size: 13px;
                }
                .aboutMessage{
                    padding: 5px 0;
                    span{
                        margin: 0 11px 0 0;
                    }
                }
                .BodyTypes{
                    display: flex;
                    flex-wrap: wrap;
                    margin: 3px 0 0 0;
                    .typeitem{
                        padding: 3px 5px;
                        border: 1px solid grey;
                        margin: 5px 5px 0 0;
                        font:{
                            size: 11px;
                        }
                    }
                }
            }
        }
    }

</style>