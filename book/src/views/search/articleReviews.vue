<!--
   *
      此组件是评论组件,用于展示评论的简述信息
      此组件主要处理一评论和二级评论的简述
      不处理文章和其他
      查看详细信息需要调用评论详细组件
      此组件是模块 需要调用
   *
-->
<template>
    <div class="articleReviews">
        <div :class="{'reviewsLists':true,'pdg':isTRUE}">
            <!-- 头信息 详情页调用显示评论和热度 详细页调用显示返回和更多 -->
            <slot name="heads"></slot>
            <!-- 指定文章部分 -->
            <!--评论数据 items 在这里循环输出数组-->
            <div class="items" v-for="(v,i) in allData">
                <div class="reviewsListsMessages">
                    <!-- 头像 -->
                    <div class="userImg">
                        <img :src="setImgUrl(v.userImg)" alt="">
                    </div>
                    <!-- 昵称 日期 数量 -->
                    <div class="userPosts">
                        <div class="userName">
                            <span>{{v.userName}}</span>
                            <span>{{v.createTime}}</span>
                        </div>
                        <div class="loveThis">
                            <img src="~img/loves.png" alt="">
                            <span class="lovesNum">{{v.userLoves}}</span>
                        </div>
                    </div>
                </div>
                <!-- 此文章的一级评论 -->
                <div @click="replys(v.id)" class="userPostsContent">
                    <!-- 占位符 -->
                    <div class="userl"></div>
                    <!-- 右边 -->
                    <div class="userr">
                        <!-- 用户评论的文字 -->
                        <div class="text">
                            {{v.userContentText}}
                        </div>
                        <!-- 用户评论的图片 -->
                        <div class="img">
                            <!-- 渲染出用户评论的图片 -->
                            <span v-for="imgItem in v.userContentImg" @click="getValue(imgItem)">
                            <img @click="check(setImgUrl(imgItem.img))" :src="setImgUrl(imgItem.img)" alt="">
                        </span>
                        </div>
                        <slot name="about"></slot>
                        <!-- 此文章的一级评论对应的二级评论 -->
                        <!-- 回复此评论的 文章详细页显示缩略myReply(只有昵称和文字) 需要传递一个数组 -->
                        <div :class="{'myReply':true}"  v-show="isShow(v.thisReplys)" >
                            <slot name="myReplyConcise">
                                <!-- 循环输出简述信息 -->
                                <div v-for="(replysData,i) in v.thisReplys.slice(0,3)" class="item">
                                    <span class="myReplyName">{{replysData.userName}}:</span>
                                    <span>{{replysData.userDate}}</span>
                                    {{replysData.userContentText}}
                                </div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<!--indexDetail-->
<!--thisRepys-->
<script>
    //使用localStorage存放我们提交的值
    //并存放我们新点击的评论
    import {getDate, setDate} from "../../storage";
    import $ from "jquery";
    //解析路径别名
    import {format} from "../../pathAlias";
    import {rootPath} from "../../pathAlias/replace";

    export default {
        name: "articleReviews",
        props: {
            isTrue: {
                type: Boolean,
            },
            //详细评论模板 传递过来的data(一个一级评论对应多个二级评论)
            inDetail:{
                type:Array,
                default:0
            }
        },
        data() {
            return {
                isTRUE: false,
                allData: [],              //存放所有的一级评论 一个一级评论对应多个二级评论
                secondaryComments:"",    //存放用户点击的二级评论的地址   比如第一个一级评论下面的第二个二级评论就是[0,1]
                //存放所有的评论图片有默认值
                allReplysImg:[{img:'ces1.jpg'}]
            }
        },
        mounted() {
            //开启加载动画
            this.$store.commit("AppLoadOnOFF",{
                isShow:true
            })
            this.isTRUE = this.isTrue
            //获取评论简述页传递的localstong值  存放了当前说说所有的评论信息
            this.allData = JSON.parse(getDate('GetArticleAllMSG'))[0].replys
            setTimeout(()=>{
                //如果inDetail数据有值
                if(this.inDetail !== 0){
                    this.allData = this.inDetail
                    //清空数组
                    for (const argument of this.allData) {
                        this.allReplysImg = argument.userContentImg
                    }
                }
                this.$store.commit("AppLoadOnOFF")
            },200)
        },
        computed:{
            //处理数据库里面的url地址
            setImgUrl() {
                return (imgName)=>{
                    //i == 1  头像   i == 2 评论   i == 3  系统
                    return rootPath(imgName)
                };
            },
            //判断是否拥有二级评论
            isShow(){
                return (value)=>{
                    return value.length > 0
                }
            }
        },
        methods: {
            replys(i) {
                //点击一级评论  并存放一级评论的地址,并获取他的二级评论
                //保存一级评论的地址
                // console.log(i)
                // this.secondaryComments = i;
                //在replyDetailed文章数据中查找一级评论id等于i的评论
                setDate('replyDetailed', JSON.stringify(this.allData.filter(value=>value.id==i)))
                this.$router.push('/replyDetailed')
            },
            getValue(value){
                console.log(value.img)
            },
            check(root){
                this.$store.commit("AppImgShow",{
                    show:true,
                    root:root
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .reviewsLists {
        padding: 4vw;
        .items{
            border-bottom: 1px solid #ccc;
            padding-bottom: 4vw;
        }

        .reviewsListsMessages {
            display: flex;
            padding: 3vw 0;
            .userImg {
                flex: 1;
                img {
                    width: 10vw;
                    height: 10vw;
                    border-radius: 50%;
                }
            }
            .userPosts {
                flex: 7;
                display: flex;
                font: {
                    size: 3vw;
                    size:.7rem;
                    weight: 200;
                };
                justify-content: space-between;

                .userName {
                    display: flex;
                    flex-direction: column;
                }

                .loveThis {
                    display: flex;
                    align-items: center;
                    img {
                        width: 25px;
                        height: 25px;
                    }
                    .lovesNum {
                        color: cornflowerblue;
                    }
                }
            }
        }

        .userPostsContent {
            display: flex;
            .userl{
                flex: 1;
            }
            .userr{
                flex: 7;
                .text {
                    font: {
                        size: 4vw;
                        weight: 200;
                    }
                    padding: 0 0 3vw 0;
                }
                .img {
                    display: flex;
                    flex-wrap: wrap;
                    img {
                        width: 20vw;
                        height: 20vw;
                        margin: 5px 5px 5px 0;
                        border-radius: 5px;
                    }
                }
                .myReply {
                    padding: 5vw;
                    font: {
                        size: 3vw;
                        weight: 200;
                    };
                    background: whitesmoke;
                    border-radius: 1vw;
                    .item{
                        font-size: .7rem;
                        padding: 2vw 0 0 0;
                    }
                }
            }
        }
    }

    .pdg {
        padding: 0 !important;
    }

    .myReplyName {
        color: cornflowerblue;
        font-weight: 500;
    }

    .twoReplys{
        img{
            width: 6vw;
            margin: auto;
        }
    }
</style>