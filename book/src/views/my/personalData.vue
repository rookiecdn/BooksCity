<!--
  *
  此组件时用户查看和修改个人信息的时候使用模板组件
  *
-->
<template>
    <div class="personalData">
        <bscroll ref="bscroll">
            <back :title="'个人资料'"></back>
            <div class="mydata">
            <!-- 头像 昵称 性别 修改密码 -->
                <div class="itemsIMG">
                    <label for="files">
                        <img id="head" :src="setImgUrl(data.img)" alt="">
                    </label>
                    <input type="file" id="files" @change="setIMG" hidden>
                </div>
                <div class="IMGalert">点击更换头像</div>
                <div class="items">
                    <span>昵称</span>
                    <input class="usernameInput" type="text" v-model="data.username" maxlength="8">
                </div>
                <div class="items">
                    <span>账号</span>
                    <span>
                        <button disabled class="btn btn-sm">{{data.account}}</button>
                    </span>
                </div>
                <div class="items">
                    <span>性别</span>
                    <span>
                        <select class="btn btn-sm btn-success" v-model="data.sex">
                            <option :selected="data.sex==0" value="0">男</option>
                            <option :selected="data.sex==1" value="1">女</option>
                        </select>
                    </span>
                </div>
                <div class="items">
                    <span>修改密码</span>
                    <span>
                        <input maxlength="11" id="pwd" type="button" @click="setPWD" class="btn btn-sm btn-success" value="嘘">
                    </span>
                </div>
                <div class="input-group">
                    <button @click="send" class="btn btn-success form-control">保存</button>
                </div>
            </div>
        </bscroll>
    </div>
</template>

<script>
    import back from "../hint/back";
    import bscroll from "../betterScroll/index"
    import $ from "jquery";
    import {getDate} from "../../storage";
    import {rootPath} from "../../pathAlias/replace";
    export default {
        name: "personalData",
        mounted() {
            //关闭幕布
            this.$store.commit("AppLoadOnOFF")
            let alldata
            if(getDate("loginMSG") === null){
                //初始化数据
                alldata  = this.$store.state.UserLoads
            }else{
                alldata = JSON.parse(getDate("loginMSG"))
            }
            this.data = alldata
            //刷新高度
            let h = $(document).outerHeight(true)
            this.$refs.bscroll.setScrollHeight(h)
        },
        data(){
            return {
                data:{
                    username:123456,
                    account:132456,
                    sex:1,
                    img:require('hmg/dl.jpeg')
                },
                files:null
            }
        },
        methods:{
          //获取用户上传的图片
            setIMG(){
                //获取文件名:
                this.files = document.getElementById("files").files
                //将文件名转换成blob
                let f = new FileReader()
                f.readAsDataURL(this.files[0])
                f.onload=()=>{
                    $("#head").attr("src",f.result)
                }
            },
          //尝试上传
          send(){
              //先获取
              let thatD = Object.assign({},this.data)
              delete thatD.img
              //判断是否对密码进行了操作
              if($("#pwd").val()=="嘘" || $("#pwd").val()==""){
                  delete thatD.password
              }else {
                  thatD.password = $("#pwd").val()
              }
              //创建传递对象
              let formData = new FormData()
              //判断是否修改了图片
              if(this.files!=null){
                  formData.append("head",this.files[0])
              }
              thatD.sex = parseInt(thatD.sex)
              formData.append("data", JSON.stringify(thatD))
              this.$store.dispatch("AppEditMyData",formData)
          },
          //修改密码
          setPWD(){
              $("#pwd").attr({
                  "type":"password"
              }).addClass("usernameInput").val('')
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
            //监听个人信息
            UserLoads(){
                return this.$store.state.UserLoads
            }
        },
        watch:{
            //改变个人信息
            UserLoads(){
                this.data = this.UserLoads
            }
        },
        components:{
            back,
            bscroll
        }
    }
</script>

<style scoped lang="scss">
    .mydata{
        display: flex;
        flex-direction: column;
        .itemsIMG{
            display: flex;
            margin: 3vw 0;
            justify-content: center;
            align-items: center;
            img{
                width: 35vw;
                height: 35vw;
                border-radius: 50%;
            }
        }
        .IMGalert{
            text-align: center;
            font-size: 3vw;
        }
        .items{
            padding: 4vw;
            margin: 0 3vw;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #cccccc;
            .usernameInput{
                border: 0;
                text-align: right;
                outline: none;
                font-size: 4vw;
                font-size: .8rem;
                transition: .225s ease-in-out;
            }
            span{
                font:{
                    size: 4vw;
                    size:.9rem;
                    weight: 400;
                }
            }
            span:nth-child(1){
                display: flex;
                align-items: center;
                font-weight: 900;
            }
        }
        .input-group{
            padding: 6vw;
            display: flex;
            justify-content: center;
        }
    }
</style>