<template>
    <div class="login">
        <div class="loginIndex">
            <div class="showMsg">
                <div class="wells">
                    The BooksCity
                </div>
                <div class="tabs">
                    <a @click="selectOPtions(1)" href="javascript:;">Log In</a>
                    <span>or</span>
                    <a @click="selectOPtions(0)" href="javascript:;">Singn Up</a>
                </div>
                <!-- 视口 -->
                <div class="logins">
                    <div class="form-group borer">
                        <input type="text" :placeholder="key?'请输入账号':'请填写一个喜欢的账号'" v-model="this.loginMSG.account" class="form-control">
                        <input v-if="!key" type="text" placeholder="请填写一个喜欢的昵称吧" v-model="this.loginMSG.username" class="form-control">
                        <input type="password" :placeholder="key?'请输入密码':'请设置密码'" v-model="this.loginMSG.password" class="form-control">
                    </div>
                    <div class="btnsBox">
                        <button @click="login(key)" class="btn btn-success form-control">{{!key?"注册":"登录"}}</button>
                    </div>
                </div>
                <!-- 视口结束 -->
                <div class="backNav">
                   <a href="javascript:;" @click="backNav()">返回页面</a>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from '../../components/mixin'
    //保留信息存储到本地
    import {getDate, setDate} from "../../storage";
    //验证
    import {ValidTEXT} from "../../validate";
    export default {
        name: "login",
        mixins:[mixin],
        data(){
            return {
                loginMSG:{
                    account:"",
                    password:"",
                    username:""
                },
                validErr:[],
                //登录还是注册   1登录 0注册
                key:1
            }
        },
        mounted() {
            console.log(this.names)
            this.$store.commit("AppLoadOnOFF")
        },
        methods:{
            validata(){
                let key = this.key
                let resultErr = ValidTEXT(this.loginMSG, {
                    account:[6,10],
                    password:[6,18],
                    username:key?false:true
                },{
                    account:"用户名规定字符在[6,10]之间",
                    password:"密码规定字符在[6,18]之间",
                    username:key?false:"用户名不能为空"
                })
                this.validErr = resultErr
                return resultErr
            },
            login(n){
                let that = this
                if(that.validata().length===0){
                    //如果没错就开启提示
                    that.$store.commit("AppLoadOnOFF",{
                        state:"登陆中",
                        showMSG:"服务器载入中",
                        isShow:true
                    })
                    //先判断是登录还是注册
                    //0是注册
                    if(!n){
                        console.log(this.loginMSG)
                        //在这里进行操作注册
                        that.$store.commit("AppLoadOnOFF")
                        //注册成功返回1
                        let key = that.$store.dispatch("AppRegisterHttpServer",that.loginMSG)
                        //显示登录数据
                        if(key){
                            this.key = key
                        }
                        return
                    }
                    //1是登陆
                    that.$store.dispatch("AppUserLoginHttpServer",{
                        account:that.loginMSG.account,
                        password:that.loginMSG.password
                    }).then(d=>{
                        if(d.data.length !== 0) {
                            //保存数据
                            that.$store.commit("AppUserLoginSuccess",d.data[0])
                            setDate("loginMSG",JSON.stringify(d.data[0]))
                            //登陆成功关闭提示
                            that.$store.commit("AppLoadOnOFF",{
                                state:"完成",
                                showMSG:"登录成功,正在跳转",
                                isShow:true
                            })
                            //登录成功刷新数据
                            that.$store.dispatch("CreateIndexHttpServer",{
                                authorId:d.data[0].id,
                                success(){
                                    console.log("成功")
                                }
                            })
                            //关闭幕布history.back()
                            setTimeout(()=>{
                                that.$store.commit("AppLoadOnOFF")
                                if(!d.data[0].auth){
                                    //跳转到my页面
                                    console.log("不是管理员");
                                    that.$router.push("/my")
                                }else{
                                    console.log("是管理员");
                                    window.open("http://www.bookadmin.com?user="+d.data[0]['username'])
                                }
                            },1000)
                        }else{
                            //不存在就提示错误信息
                            //关闭幕布
                            that.$store.commit("AppLoadOnOFF")
                            that.$store.commit("AppErrMSG",{
                                errArr:["用户不存在或密码错误"],
                                isShow:true
                            })
                        }
                    })
                    //登录到这里结束
                }else{
                    //不合法提示错误信息
                    that.$store.commit("AppErrMSG",{
                        errArr:this.validErr,
                        isShow:true
                    })
                }
            },
            backNav(){
                this.$store.commit("AppLoadOnOFF",{
                    state:"执行",
                    showMSG:"正在跳转",
                    isShow:true
                })
                history.back()
            },
            selectOPtions(n){
                this.key = n
            }
        }
    }
</script>

<style scoped lang="scss">
    .login{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: cadetblue;
    }
    .showMsg{
        width: 80vw;
        padding: 5vw;
        font-size: 4vw;
        font-weight: 500;
        background:white;
        position: relative;
        border-radius: 10px;
        .wells{
            text-align: center;
            padding: 0 3vw;
            font-size: 8vw;
            font-family: fantasy;
        }
        .form-group{
            transition: .225s;
            img{
                width: 25vw;
                margin: auto;
                display: block;
            }
        }
    }
    .btn{
        margin: 5vw 0;
        font-size:4vw;
    }
    .form-group {
        margin:0;
    }
    .btnsBox{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .backNav{
        text-align: center;
    }
    .borer{
        border: 3px solid #ccc;
        border-radius: 8px;
        input{
            border:0;outline:0;
            border-color:#fff;
            webkit-box-shadow:none;
            box-shadow:none;
            font-size: 4vw;
            font-size: .8rem;
        }
    }
    .tabs{
        text-align: center;
        padding:3vw;
        a:nth-child(1){
            color: green;
        }
        *{
            padding: 1vw;
        }
    }
</style>