<template>
    <div class="manage">
        <bscroll ref="bscroll">
            <back :title="'管理'"></back>
            <div class="manage">
                <!-- 没有数据时候提示 -->
                <div class="hint" v-if="mydata.length==0">您还没有发表过帖子哦</div>
                <!-- 展示数据 -->
                <div v-for="manageItems in mydata" class="manage-items">
                    <div>{{manageItems.content}}</div>
                    <div>{{manageItems.textContent}}</div>
                    <div>
                        <span class="tiems">{{manageItems.createTime}}</span>
                        <span class="dels"><button @click="Delete(manageItems.articleId)" class="btn btn-sm btn-danger">删除</button></span>
                    </div>
                </div>
            </div>
        </bscroll>
        <!-- 劝返环节 -->
        <transition name="fade">
            <div class="mubu" v-if="deleAlert">
                <div class="alerts">
                    <div class="alerts-TEXT">
                        <h5>警告</h5>
                        <div class="alerts-CONTENT">确定要删除吗?删除后将不能撤销!!</div>
                        <div class="alerts-BTN">
                            <button class="btn btn-sm btn-danger"  @click="valid(0)">删除</button>
                            <button class="btn btn-sm btn-success" @click="valid(1)">取消</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import bscroll from "../betterScroll/index"
    import back from "../hint/back";
    import $ from "jquery"
    import {getDate} from "../../storage";
    export default {
        name: "manage",
        data(){
            return {
                mydata:[],
                //幕布标记
                deleAlert:false,
                //是否删除
                isDel:false,
                //保存用户id  文章id
                userID:null,
                articleId:null
            }
        },
        mounted(){
            //初始默认提交为false
            //本地 MYDATA   Vuex AppGetMyArticle
            //获取本地
            let local = JSON.parse(getDate("MYDATA"))
            //获取用户id
            this.userID = JSON.parse(getDate("loginMSG")).id
            let VuexData = this.$store.state.AppGetMyArticle
            if(local){
                this.mydata = local
            }else if(VuexData){
                this.mydata = VuexData
            }else{
                console.log("没有值")
            }
            setTimeout(()=>{
                let h = $(document).outerHeight(true)
                this.$refs.bscroll.setScrollHeight(h)
            },200)
        },
        methods:{
            Delete(id){
                this.deleAlert = true
                this.articleId = id
            },
            valid(boo){
                let that = this
                that.deleAlert = false
                if(boo){
                    //取消删除
                    that.isDel = false
                }else {
                    //确认删除
                    that.isDel = true
                    that.$store.dispatch("AppRemoveHttpServer",{
                        authorId:that.userID,
                        articleId:that.articleId
                    }).then(d=>{
                        //d.data == 0  表示删除失败
                        //d.data == 1  删除成功 重新刷新我的帖子
                        if(d.data){
                            that.$store.dispatch("AppGetMyArticleHttpServer",{
                                id:that.userID,
                                success(){
                                    that.$store.commit("AppPromptSuccess",{
                                        msg:"删除成功",
                                        show:true,
                                        success() {
                                            let h = $(document).outerHeight(true)
                                            that.$refs.bscroll.setScrollHeight(h)
                                        }
                                    })
                                }
                            })
                            return
                        }
                        return;
                    })
                }
            }
        },
        components:{
            back,
            bscroll
        },
        computed:{
            VuexData(){
                return this.$store.state.AppGetMyArticle
            }
        },
        watch:{
            VuexData(){
                this.mydata = this.VuexData
            }
        }
    }
</script>

<style scoped lang="scss">
    .manage{
        display: flex;
        flex-direction: column;
        padding: 2vw;
        .manage-items{
            padding: 3vw;
            margin: 3vw 0;
            border: 1px solid #ccc;
            font-size: 4vw;
            font-size: .8rem;
            div{
                display: flex;
            }
            div:nth-child(1){
                font-size: 5vw;
            }
            div:nth-child(2){
                margin: 3vw 0;
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
                font-size: 4vw;
                font-weight: 100;
            }
            div:nth-child(3){
                justify-content: space-between;
            }
            .tiems{
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .dels{
                button{
                    font-size: 0.8rem !important;
                }
            }
        }
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
    .mubu{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        .alerts{
            padding: 4vw;
            width: 60vw;
            background: white;
            display: flex;
            font-size: 4vw;
            font-size: 0.8rem;
            .alerts-IMG{
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
               img{
                   width: 80%;
               }
            }
            .alerts-TEXT{
                flex: 2;
                .alerts-CONTENT{
                    padding: 2vw;
                }
                .alerts-BTN{
                    display: flex;
                    justify-content: space-around;
                }
            }
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