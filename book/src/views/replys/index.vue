<!--
  *
    此组件用于评论论坛时使用
  * 需要父组件传递一些值
  * 如果是一级评论,需要传递( 文章的id,评论人的(用户id,头像,日期,昵称,评论的内容,评论的图片) )
  * 如果是二级评论,需要传递( 一级评论的id,评论人的(用户id,头像,日期,昵称,评论的内容,评论的图片) )
  *
-->
<template>
    <div class="index">
        <div class="replys">
            <!-- 返回按钮和标题 -->
            <div class="detailedTitle">
                <div class="back">
                    <img @click="backs()" src="~img/back.png" alt="">
                </div>
                <div class="title">
                    留下你的足迹
                </div>
                <div class="more">
                    <img src="~img/more.png" alt="">
                </div>
            </div>
            <!-- 评论的内容  文字 图片集合 -->
            <div class="replyContent">
                <textarea v-model="replysText" placeholder="请开始哔哔"></textarea>
                <div class="sizeLength">
                    {{replysText.length}}/200
                </div>
                <div class="IMGAll">
                    <div v-for="replysItems in IMGurl" class="img-btn">
                        <img :src="replysItems" alt="">
                    </div>
                    <div class="img-btn">
                        <input  @change="uploads()"  multiple hidden type="file" id="files">
                        <label for="files">
                            <img src="~img/addImg.png" alt="">
                        </label>
                    </div>
                </div>
            </div>
            <!-- 结束输入 -->
            <div class="endInput">
                <input type="button" class="form-control btn btn-success" @click="sends()" value="提交">
            </div>
        </div>
    </div>
</template>

<script>
    import {setDate,getDate,removeDate} from "../../storage";
    export default {
        name: "index",
        data(){
            return {
                //用户评论的文字
                replysText:"",
                //用户评论的图片
                //存放用户选择的图片地址
                IMGurl:[]
            }
        },
        mounted() {
            //文章id
            console.log(getDate("articleId"))
            //一级评论
            console.log(getDate("id"))
        },
        methods:{
            //上传
            sends(){
                //点击上传 执行加载动画
                this.$store.commit("AppLoadOnOFF",{
                  isShow:true
                })
                //获取file对象
                let dom = document.getElementById('files').files
                let err = null;
                if(this.replysText.length === 0 && dom.length===0){
                    err = ["不能回复空数据"]
                }else if(this.replysText.length > 200){
                    err = ["字符超过200限定数"]
                }
                if(err!==null){
                    this.$store.commit("AppErrMSG",{
                        errArr:err,
                        isShow:true
                    })
                    return;
                }
                let form = new FormData()
                dom.forEach((v,i)=>{
                    //限数 两个
                    if(i<=1){
                        form.append("file"+i,dom[i])
                    }
                })
                //http请求 sofia
                // 处理数据
                // 帖子id,作者id,作者头像,作者昵称,评论的内容，评论的图片
                let replysKey = JSON.parse(getDate("loginMSG"))
                //获取文章id  getDate("articleId"),
                var data = {
                    //作者id
                    authorId:replysKey.id,
                    //用户昵称
                    userName:replysKey.username,
                    //用户的头像
                    userImg:replysKey.img,
                    //回复的内容
                    userContentText: this.replysText,
                    //默认喜欢
                    userLoves:0
                }
                //判断是谁发送的请求   如果是帖子发送的请求  配置 articleId:getDate("articleId")
                //                 如果是一级评论发送的请求  配置 replysId:getDate("id")
                //如果是给帖子评论 获取帖子id  运行 GetArticleHttpServer方法
                //如果是给一级评论评论 获取评论id 运行 GetReplysHttpServer方法
                console.log(data)
                let reloadData = null;
                let actionMethod = null;
                let key = 0;
                if(getDate("articleId") != null){
                    //帖子id
                    data['articleId'] = parseInt(getDate("articleId"))
                    reloadData = data['articleId']
                    actionMethod = 'GetArticleHttpServer'
                    key = 1
                }
                if(getDate("id")!= null){
                    //二级评论id
                    data['replysId'] = parseInt(getDate("id"))
                    reloadData = data['replysId']
                    actionMethod = 'GetReplysHttpServer'
                    key = 2
                }
                console.log(reloadData)
                form.append("data",JSON.stringify(data))
                let that = this
                that.$store.dispatch("AppReplysHttpServer",form).then(d=>{
                    if(d.data==200){
                        //如果是给帖子评论 运行 GetArticleHttpServer方法,传递帖子的id  getDate("articleId")
                        //如果是给一级评论评论 运行
                        that.$store.dispatch(actionMethod,{
                            //重新加载数据
                            current:reloadData,
                            //执行成功后跳转
                            success() {
                                //上传成功后,添加全局提示
                                if(actionMethod == "GetArticleHttpServer"){
                                    that.$store.dispatch("AppSendMSGHttpServer",{
                                        articleId:data['articleId'],  //帖子的id
                                        type:1,       //0点赞  1评论
                                        authorId:replysKey.id,    //评论用户的id,当前登录的用户
                                        readed:0,     //0未读  1已读
                                        toAuthorId:parseInt(getDate("Aid")),    //当前帖子是谁的
                                        comment:data['userContentText']             //评论的内容
                                    })
                                }
                                //关闭加载动画
                                that.$store.commit("AppLoadOnOFF")
                                //清除缓存
                                removeDate(["articleId","id"])
                                //表示要添加的是评论
                                if(key === 2){
                                    that.$store.dispatch("GetArticleHttpServer",{
                                        current: parseInt(getDate("selectArticledId")),
                                        success() {
                                            history.back()
                                        }
                                    })
                                    return
                                }
                                //直接跳转
                                history.back()
                                return
                            }
                        })
                    }else {
                        //关闭加载动画
                        that.$store.commit("AppLoadOnOFF")
                        //报错
                        that.$store.commit("AppErrMSG",{
                            errArr:["操作失败"],
                            isShow:true
                        })
                        //清除缓存
                        removeDate(["articleId","id"])
                        //返回
                        history.back()
                    }
                })
            },
            //返回
            backs(){
                //清除缓存
                removeDate(["articleId","id"])
                history.back()
            },
            //用户选择
            uploads(){
                //清除缓存
                this.IMGurl = []
                //FX获取文件路径方法
                var that = this
                //获取file对象
                let dom = document.getElementById('files').files
                //创建读取文件的类
                //便利多个图片
                dom.forEach((v,i)=>{
                    //限数 两个
                    if(i<=1){
                        let f = new FileReader()
                        f.readAsDataURL(v)
                        f.onload=()=>{
                            this.IMGurl.push(f.result)
                        }
                    }
                })
            }
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
    .replyContent{
        margin-top: 5vw;
        padding: 2vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        textarea{
            resize: none;
            border:1px solid #ccc;
            padding: 3vw;
            width: 90%;
            height: 35vw;
            font-size: 4vw;
        }
        .IMGAll{
            width: 100%;
            padding: 5vw;
            display: flex;
            .img-btn{
                img{
                    width: 25vw;
                    height: 25vw;
                }
            }
            
        }
    }
    .endInput {
        display: flex;
        justify-content: center;
        align-items: center;
        input{
            width: 80%;
        }
    }
    .sizeLength{
        width: 100%;
        padding: 0 5vw 0 0;
        text-align: right;
        font-size: 4vw;
    }
</style>