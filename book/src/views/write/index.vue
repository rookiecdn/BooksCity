<!--
*
    此组件是用户上传作品的组件
*
-->
<template>
    <meta http-equiv="Access-Control-Allow-Origin" content="*" />
    <div class="index">
        <bscroll  ref="bscroll">
            <div class="writeHead">
                <div @click="back()" class="writeHeadImg">
                    <img src="~img/back.png" alt="">
                </div>
                <input type="button" class="btn btn-sm btn-primary" @click="send" value="发布">
            </div>
            <div class="writeContent">
                <!-- 上传文字 -->
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="content">简述</label>
                        <!-- 帖子的标题 -->
                        <div class="col-sm-9">
                            <input id="content" v-model="userInput.content" name="content" class="form-control" placeholder="简述不得超过30字" type="text">
                        </div>
                    </div>
                    <div class="form-group paads">
                        <label for="textContent">内容</label>
                        <textarea id="textContent" v-model="userInput.textContent" name="textContent" placeholder="请输入文章内容" class="form-control" rows="5"></textarea>
                    </div>
                </div>
                <!-- 上传评论的图片 -->
                <div class="upload-file" id="ufe">
                    <div class="imgs" v-for="(imgV,i) in imgUrlson">
                        <img :src="imgV" alt="">
                    </div>
                    <div class="imgs uploads">
                        <input type="file" @change="uploads()" name="files" multiple hidden ref="inputFiles" id="inputFiles"/>
                        <label for="inputFiles"><img src="~img/addImg.png" alt=""></label>
                    </div>
                </div>
                <!-- 添加类型 -->
                <div class="types">
                    选择类型
                </div>
            </div>
        </bscroll>
        <back-index :this-show="bacData.isShow"  :this-state="bacData.state" :this-show-img="bacData.showImg"></back-index>
    </div>
</template>

<script>
    import bscroll from '../betterScroll/index'
    import {getDate} from "../../storage";
    import {PublishAnArticle} from "../../require/https"
    //上传提示进度
    import backIndex from "../background"
    //验证器
    import {ValidIMG,ValidTEXT} from "../../validate";
    import $ from "jquery";
    export default {
        name: "index",
        data(){
            return {
                userInput:{
                    //作者的昵称,自动获取的
                    title:"测试昵称",
                    //作者的账号id 自动获取的
                    authorId:1,
                    //帖子的head
                    content:"帖子的描述",
                    //帖子的内容
                    textContent:"帖子的内容",
                    img:"AllGraph/userHeads/abc.jpg",
                    comment:0,     //默认值
                    loves:0        //默认值
                },
                //用户选择的本地图片地址
                imgUrlson:[],
                bacData:{
                    isShow:false,
                    state:0,
                    showImg:"请耐心等待..."
                }
            }
        },
        mounted() {
            setTimeout(()=>{
                let appHeight = $(window).outerHeight(true)
                this.$refs.bscroll.setScrollHeight(appHeight)
            },100)
        },
        methods:{
            back(){
                history.back()
            },
            //初始化数据
            initializedData(){
                this.userInput = {
                    //自动获取昵称
                    title:"测试昵称",
                    //自动获取的id
                    authorId:1,
                    content:"",
                    textContent:"",
                    //作者头像自动获取的
                    img:"AllGraph/userHeads/abc.jpg",
                    comment:0,
                    loves:0
                }
            },
            //验证提交的数据
            validate(){
                let result = ValidTEXT(['abcd','aaaa','cccc',''],[2,'aaa',3,true])
                console.log(result)
                //规则
                //content描述<=15    textContent内容<=200
                // let inputFiles = document.getElementById('inputFiles').files
                // if(inputFiles.length==0){
                //     let C0 = 0 < this.userInput.content.length
                //     let C1 = 0 < this.userInput.textContent.length
                //     if(C0&&C1){
                //         console.log(C0)
                //         return true
                //     }
                //     return false
                // }else{
                //     //调用验证类
                //     let resultIMG = ValidIMG("inputFiles",2)
                // }
                //img如果有值,那么就要判定他的大小
            },

            send(){
                this.validate()

                // //显示幕布加载
                // this.bacData.state = 0
                // this.bacData.isShow = true
                // this.bacData.showImg = "上传中..."
                // /*
                // *   在这里要获取一下作者的头像和id,昵称
                // * */
                // //执行操作
                // var that = this
                // //获取files节点
                // var fileInput = document.getElementById('inputFiles').files
                // //创建formdata
                // var form = new FormData();
                // //遍历图片(图片最多上传三张)
                // for (let i = 0;i<fileInput.length;i++){
                //     form.append("files"+i,fileInput[i]);
                // }
                // form.append("data", JSON.stringify(that.userInput));
                // var settings = {
                //     "url": "/Article/save",
                //     "method": "POST",
                //     "processData": false,
                //     "mimeType": "multipart/form-data",
                //     "contentType": false,
                //     "data":form
                // };
                // var that = this
                // PublishAnArticle(settings).then(function (response) {
                //     //添加成功返回true
                //     if(response.data || response.data== 200){
                //         that.bacData.state = 1
                //         that.bacData.showImg = "上传成功"
                //         setTimeout(()=>{
                //             that.bacData.isShow = false
                //             that.initializedData()
                //         },1000)
                //     }
                // }).catch(function (error) {
                //     that.bacData.state = 2
                //     that.bacData.showImg = "上传失败"
                //     setTimeout(()=>{
                //         that.bacData.isShow = false
                //     },1000)
                // });
            },
            uploads(){
                //FX获取文件路径方法
                var that = this
                //获取file对象
                let dom = document.getElementById('inputFiles').files
                //创建读取文件的类
                //便利多个图片
                dom.forEach((v,i)=>{
                    let f = new FileReader()
                    f.readAsDataURL(v)
                    f.onload=()=>{
                        this.imgUrlson.push(f.result)
                    }
                })
                console.log("上传")
            }
        },
        components:{
            bscroll,
            backIndex
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
    .writeContent{
        padding: 4vw;
    }
    .paads{
        padding:0 15px
    }
    .label{
        font-size: 6vw;
        font-weight: 600;
    }
    .form-control{
        font-size: 4vw;
    }

    .upload-file{
        padding: 0 15px;
        display: flex;
        flex-wrap: wrap;
        .imgs{
            img{
                width: 25vw;
                height: 25vw;
                padding: 2vw;
            }
        }
    }
</style>