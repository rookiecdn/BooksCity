<template>
    <div class="myarticle">
        <bscroll ref="bs">
            <back :title="vrayHint.title"></back>
            <!-- 显示搜索的内容 -->
            <!-- setHeight 自动获取网页的长度 -->
            <resultItems v-for="(v,i) in mydata" :this-data="v" @click.native.stop="TheArticleDescribes(v.articleId)"></resultItems>
            <!-- 没有帖子的时候显示 -->
            <div class="hint" v-if="mydata.length==0">
                {{vrayHint.content}}
            </div>
        </bscroll>
    </div>
</template>

<script>
    import bscroll from "../betterScroll/index"
    import {getDate} from "../../storage";
    import resultItems from "../search/resultItems";
    import back from "../hint/back";
    import $ from "jquery";

    export default {
        name: "myarticle",
        data(){
            return {
                mydata:[],
                hintMSG:[
                    {
                    title:"我的帖子",
                    content:"您还没有发布任何帖子哦"
                    },
                    {
                    title:"我的喜欢",
                    content:"您还没有对喜欢的帖子点赞哦"
                    },
                    {
                    title:"搜索结果",
                    content:"没有结果"
                    }
                ],
                //显示
                vrayHint: {
                    title:"",
                    content:""
                }
            }
        },
        mounted() {
            //如果等于400 表示是我的帖子
            //如果等于500 表示我搜索的
            let paramsD = this.$route.params
            if(paramsD.id=="400"){
                this.mydata = JSON.parse(getDate('MYDATA'))
            }else if(paramsD.id=="500"){
                this.mydata = JSON.parse(getDate('SEARCHDATA'))
            }else if(paramsD.id=="600"){
                this.mydata = JSON.parse(getDate('LOVESDATA'))
            }
            this.vrayHint = this.hintMSG[paramsD.i]
            console.log(this.mydata)

            //刷新高度
            let H = $(window).outerHeight(true)
            setTimeout(()=>{
                this.$refs.bs.setScrollHeight(H)
            },300)
        },
        methods:{
            TheArticleDescribes(current){
                let that = this
                that.$store.commit("AppLoadOnOFF",{
                    isShow:true
                })
                let authorId =  JSON.parse(getDate("loginMSG")).id
                this.$store.dispatch('GetArticleHttpServer',{
                    //帖子的id
                    current,
                    //用户的id
                    authorId,
                    success(){
                        //加载成功后 关闭全局加载并跳转   关闭不需要传递默认值
                        that.$store.commit("AppLoadOnOFF")
                        that.$router.push({path:'/theArticleDetailed'})
                    }
                })
            }
        },
        components:{
            bscroll,
            resultItems,
            back
        },
        computed:{
            D(){
                //如果id = 400 监听我点赞的数据 否则监听我搜索的
                return this.$route.params.id=="400"?this.$store.state.AppGetMyArticle:this.$store.state.AppGetSearch
            }
        },
        watch:{
            D(){
                this.mydata = this.D
                setTimeout(()=>{
                    //刷新高度
                    this.$refs.bscroll.RefreshTheHeight()
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .writeHead{
        padding: 3vw;
        display: flex;
        justify-content: space-between;
        align-items:center;
        .writeHeadImg{
            img{
                width: 10vw;
            }
        }
        button{
            border-radius: 15px;
            font-size: 3vw;
            font-weight: 200;
        }
    }
    .hint{
        padding: 8vw;
        font-size: 4vw;
        font-size: .8rem;
        font-weight: 100;
        text-align: center;
        color: brown;
    }
</style>