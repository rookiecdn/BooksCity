<!--
   *
      此组件滚动组件,公用的模板,可用于其他组件直接调用即可
   *
-->
<template>
    <div class="index">
        <!-- 使用bscroll插件  在外层必须是wrapper 切一定要有固定的高度 -->
        <div class="wrapper" ref="wrapper">
        <!-- wrapper下面是内容容器content -->
            <div class="content">
                 <slot></slot>
                <!-- 占位符 -->
                <div :class="['pad',{'bott':BTT}]"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import BScroll  from '@better-scroll/core'
    import PullUp   from '@better-scroll/pull-up'
    import PullDown from '@better-scroll/pull-down'
    import {getDate, setDate} from "../../storage";
    BScroll.use(PullUp)
    BScroll.use(PullDown)
    export default {
        name: "index",
        props:{
            BTT:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return {
                bscroll : '',
                id:""
            }
        },
        methods:{
            //刷新content内容的高度
            RefreshTheHeight(){
                this.bscroll.refresh()
                console.log("嘀嘀嘀刷新")
            },
            //设置滚动warpper的高度
            setScrollHeight(height){
                $('.wrapper').css('height',height)
                this.RefreshTheHeight()
            },
            //滚动到
            setScrollTop(p){
                console.log(p)
                this.bscroll.scrollTo(0,p,0)
                console.log("跳转到" + p)
            }
        },
        mounted() {
            //获取用户id
            if(getDate("loginMSG") == null){
                this.id = null
            }else {
                this.id = JSON.parse(getDate("loginMSG")).id
            }
            //渲染模板时加载bs插件
            let wrapper = this.$refs.wrapper
            //调用插件js
            this.bscroll = new BScroll(wrapper,{
                probeType:3,
                //开启上滑刷新
                pullUpLoad: {
                    threshold:-100
                },
                //开启下拉刷新
                pullDownRefresh: {
                    threshold: 100, // 下拉距离超过30px触发pullingDown事件
                    stop: 20 // 回弹停留在距离顶部20px的位置
                },
                // pullDownRefresh:true
                //click如果不启动,那么客户端将无法在scroll中实现点击
                click:true
            })
            //监听bscroll滚动信息
            this.bscroll.on('scroll',position=>{
                //保存滚动数据信息
                //当前路由的名称
                //console.log(routerName)s
                //在当前页面滚动了多久
                let routerName = this.$route.name
                if(routerName=='SearchIndex'){
                    setDate(routerName,position.y)
                }
            })
            //监听下拉刷新
            this.bscroll.on('pullingUp',()=>{
                console.log('上拉')
                //下拉完毕清空pullingUp  否则只能下拉刷新一次
                let that = this
                that.$store.commit('AppPromptSuccess',{
                    show:true,
                    msg:"正在获取",
                    success() {
                        //统一定义数据
                        //定义长度 请求方法名 执行体
                        let setLen,actionFunName,actionFun
                        //上拉在这里加载数据
                        //先设置值,在重新夹杂哎
                        if(that.$route.name == 'SearchIndex' ){
                            //设置长度
                            setLen = "SetlenArticle"
                            actionFunName = "CreateIndexHttpServer"
                            actionFun = {
                                authorId:that.id,
                                success() {
                                    that.$store.commit('AppPromptSuccess',{
                                        show:true,
                                        msg:"刷新成功",
                                        success() {
                                            //尝试输出加载后的数据-->测试用
                                        }
                                    })
                                }
                            }
                        }else if((that.$route.name == 'myarticle' && that.$route.params.id == "400") || that.$route.name == 'manage'){
                            setLen = "SetlenMyArticle"
                            actionFunName = "AppGetMyArticleHttpServer"
                            actionFun = {
                                id:JSON.parse(getDate("loginMSG")).id,
                                success(){   /* 预留 出bug时测试使用 */ }
                            }
                        }
                         else if(that.$route.name == 'myarticle' && that.$route.params.id == "500"){
                            console.log("我搜索的部分")
                            setLen = "SetlenSearch"
                            actionFunName = "AppGetSearchHttpServer"
                            actionFun = that.$store.state.SearcAll
                        }else if(that.$route.name == 'myarticle' && that.$route.params.id == "600"){
                            setLen = "SetlenLove"
                            actionFunName = "AppMyLovesArticleHttpServer"
                            actionFun = {
                                authorId:that.id,
                                success(){}
                            }
                        }else{
                            console.log("重新计算")
                            that.bscroll.finishPullUp()
                            setTimeout(()=>{
                                that.RefreshTheHeight()
                            },500)
                             return
                        }
                       //重新请求加载数据
                        that.$store.commit(setLen)
                        //重新发起请求加载页面内容
                        setTimeout(()=>{
                            that.$store.dispatch(actionFunName,actionFun)
                            //最后执行
                            that.bscroll.finishPullUp()
                            setTimeout(()=>{
                                that.RefreshTheHeight()
                            },500)
                        },500)
                    }
                })
                that.$store.commit('AppPromptSuccess')
            })
            //监听上拉刷新
            this.bscroll.on('pullingDown',()=>{
                console.log("下拉")
                let that = this
                console.log(that.$route.name)
                let rname = that.$route.name
                if( rname == 'SearchIndex' ){
                    that.$store.dispatch('CreateIndexHttpServer',{
                        authorId:this.id,
                        success() {
                            that.$store.commit('AppPromptSuccess',{
                                show:true,
                                msg:"刷新成功",
                                success() {}
                            })
                        }
                    })
                }else if( rname =="message"){
                    //重新获取数据
                    that.$store.dispatch("AppGetMyMessage",JSON.parse(getDate("loginMSG")).id)
                }
                setTimeout(()=>{
                    that.RefreshTheHeight()
                    that.bscroll.finishPullDown()
                })
            },500)
        }
    }
</script>

<style scoped lang="scss">
    .wrapper{
        /*调用时设置高度*/
        overflow: hidden;
        .content{
            .backTop{
                width: 20vw;
                height: 20vw;
                position: absolute;
                right: 8vw;
                bottom: 5vw;
                background: blueviolet;
            }
        }
    }
    .pad{
        height: 5vw;
    }
    .bott{
        height:25vw;
        text-align: center;
        font-size: 11px;
        font-width: 200;
    }
</style>