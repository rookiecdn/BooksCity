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
                        <label for="textContent">内容 <span class="len">{{userInput.textContent.length}}/200</span></label>
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
                <!-- 选择类型 -->
                <div class="types">
                    <button class="btn btn-sm btn-info" @click="setTypes()">
                        选择类型
                    </button>
                    <div class="TypeList">
                        <div class="TypeList">
                            <div class="items" v-for="ty in this.getTypes">
                                {{ty.typeValue}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </bscroll>
    </div>
</template>

<script>
    import bscroll from '../betterScroll/index'
    import {getDate} from "../../storage";
    import {PublishAnArticle} from "../../require/https"
    //验证器
    import {ValidIMG,ValidTEXT} from "../../validate";
    //引入jquery
    import $ from "jquery";
    export default {
        name: "index",
        data(){
            return {
                //判断用户的登录状态
                loginState:false,
                userInput:{
                    //作者的昵称,自动获取的
                    title:"测试昵称",
                    //作者的账号id 自动获取的
                    authorId:1,
                    //帖子的head
                    content:"帖子的描述",
                    //帖子的内容
                    textContent:"帖子的内容",
                    //作者的头像,自动获取的
                    img:"AllGraph/userHeads/abc.jpg",
                    comment:0,     //默认值
                    loves:0        //默认值
                },
                //用户选择的本地图片地址
                imgUrlson:[],
                //验证类的错误信息
                errMSG:{
                    data:[]
                },
                //输入的类型
                getTypes:[]
            }
        },
        created() {
            //开启加载动画
            this.$store.commit("AppLoadOnOFF",{
                isShow:true
            })
        },
        mounted() {
            //初始化作者的信息
            //判断this.$store.UserLoads 有没有
            //如果getDate有,优先从getDate获取
            //判断本地化是否有值
            let Brower = JSON.parse(getDate('loginMSG'))
            //获取state存储
            let House = this.$store.state.UserLoads
            //本地化没有值和state存储都没有值 就表示没有登陆
            if(Brower === null && House.id == null){
                this.loginState = false
                console.log("未登录")
            }else{
                //登录成功 改变状态吗
                this.loginState = true
                let userdata = (Brower===null?House:Brower)
                //设置用户的个人信息
                this.userInput.authorId = userdata.id
                this.userInput.title = userdata.username
                this.userInput.img = userdata.img
            }
            setTimeout(()=>{
                let appHeight = $(window).outerHeight(true)
                this.$refs.bscroll.setScrollHeight(appHeight)
                //获取类型
                this.getTypes = this.$store.state.GetTypes
               if(this.$store.state.Article.title!==""){
                   //当从类型页面跳转过来后,复制保存的文章
                   this.userInput.content = this.$store.state.Article.title
                   this.userInput.textContent = this.$store.state.Article.content
               }
                this.$store.commit("AppLoadOnOFF")
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
                    title:"",
                    //自动获取的id
                    authorId:null,
                    content:"",
                    textContent:"",
                    //作者头像自动获取的
                    img:"AllGraph/userHeads/abc.jpg",
                    comment:0,
                    loves:0
                }
                //清空选区的url地址
                this.imgUrlson = []
                //清空类型
                this.getTypes= []
                //清除store保存的类型
                this.$store.commit("MySelectType")
            },
            //验证提交的数据
            validate(){
                let that = this
               //如果等于true  表示在登录状态  可以发说说
               if(that.loginState){
                   //获取file文件验证
                   let inputFiles = document.getElementById('inputFiles').files
                   //编写验证字段的验证
                   let rule = {
                       content:[5,15],            //content 最小长度为5,最大长度为15
                       textContent:[50,200],      //textContent 最小长度为5,最大长度为15
                   }
                   //编写错误信息
                   let errMSG = {
                       content:"标题的长度应当在5-15字符之间",
                       textContent:"内容字符应该在50-200字符之间",
                   }
                   //如果文件没有值 就直接跳过直接验证文字
                   if(inputFiles.length==0){
                       //如果文件没有值 那么就只验证字段
                       //编写验证规则
                       let result = ValidTEXT(that.userInput,rule,errMSG)
                       if(that.getTypes.length === 0) result.push("类型数量为空")
                       //如果没有错误信息返回[]  标识可以提交
                       if(result.length == 0){
                           return true
                       }
                       this.errMSG.data = result
                       //如果有图片验证
                   }else{
                       //调用验证图片类
                       let resultIMG = ValidIMG("inputFiles",2)
                       //调用验证规则类
                       let result = ValidTEXT(that.userInput,rule,errMSG)
                       if(that.getTypes.length === 0) result.push("类型数量为空")
                       if(resultIMG && result.length == 0){
                           return true
                       }else{
                           if(resultIMG){
                               that.errMSG.data = result
                               return
                           }
                           that.errMSG.data.push("图片太大")
                           that.errMSG.data.concat(result)
                           return
                       }
                   }
               }else{
                   that.errMSG.data = ["未登录,请先登录"]
                   return false
               }
            },
            //上传处理
            send(){
                var that = this
                //如果验证通过添加
                if(this.validate()){
                    //显示幕布加载
                    //开启加载动画
                    that.$store.commit("AppLoadOnOFF",{
                        isShow:true
                    })
                    /*
                    *   在这里要获取一下作者的头像和id,昵称
                    * */
                    //执行操作
                    //获取files节点
                    var fileInput = document.getElementById('inputFiles').files
                    //创建formdata
                    var form = new FormData()
                    //遍历图片(图片最多上传三张)
                    for (let i = 0;i<fileInput.length;i++){
                        if(i<=1){
                            form.append("files"+i,fileInput[i])
                        }
                    }
                    form.append("data", JSON.stringify(that.userInput))
                    form.append("types", JSON.stringify(that.getTypes))
                    //上传
                    this.$store.dispatch("AppUploadHttpServer",form).then(function (response) {
                        //添加成功返回true
                        if(response.data || response.data== 200){
                            //开启加载动画
                            that.$store.commit("AppLoadOnOFF",{
                                isShow:true,
                                showMSG:"上传成功"
                            })
                            setTimeout(()=>{
                                //上传成功,关闭幕布
                                that.$store.commit("AppLoadOnOFF")
                                //初始化数据
                                that.initializedData()
                                //清除保存的
                                that.$store.commit("ArticleSave")
                                //重新请求数据
                                that.$store.dispatch("CreateIndexHttpServer",{
                                    authorId:JSON.parse(getDate("loginMSG")).id,
                                    success(){}
                                })
                            },1000)
                        }
                    }).catch(function (error) {
                        that.$store.commit("AppLoadOnOFF",{
                            isShow:true,
                            showMSG:"上传失败"
                        })
                        setTimeout(()=>{
                            that.$store.commit("AppLoadOnOFF")
                        },1000)
                    });
                }else{
                    //验证失败  显示错误信息
                    that.$store.commit("AppErrMSG",{
                        errArr:that.errMSG.data,
                        isShow:true
                    })
                }
            },
            //在页面上显示要上传的图片
            uploads(){
                //清除缓存
                this.imgUrlson = []
                //FX获取文件路径方法
                var that = this
                //获取file对象
                let dom = document.getElementById('inputFiles').files
                //创建读取文件的类
                //便利多个图片
                dom.forEach((v,i)=>{
                    //限数 两个
                    if(i<=1){
                        let f = new FileReader()
                        f.readAsDataURL(v)
                        f.onload=()=>{
                            this.imgUrlson.push(f.result)
                        }
                    }
                })
            },
            setTypes() {
                this.$store.commit("ArticleSave",{
                    title:this.userInput.content,
                    content:this.userInput.textContent
                })
                this.$router.push({
                    name:"multipleType"
                })
            }
        },
        components:{
            bscroll
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
    .len{
        font-size: 3vw;
    }
    .types{
        padding: 0 15px;
        .btn{
            font-weight: 200;
            color: white;
            font-size: 4vw;
        }
    }
    .TypeList{
        display: flex;
        flex-wrap: wrap;
        .items{
            margin: 1vw 1vw 0 0;
            padding: 2vw 4vw;
            font-size: 4vw;
            font-size: 0.7rem;
            background: cadetblue;
            color: white;
        }
    }

</style>