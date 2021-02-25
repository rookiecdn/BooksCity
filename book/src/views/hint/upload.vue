<template>
    <div class="index">
        <transition name="fade">
            <div class="index" v-if="isShow">
                <div class="indexBC">
                    <div class="showImg">
                        <span @click="cancel()" class="cancel">
                            <img src="~img/canceled.png" alt="">
                        </span>
                        <div class="showText">{{state}}</div>
                        <div class="showContent">{{showMSG}}</div>
                        <div class="spinner">
                            <div class="double-bounce1"></div>
                            <div class="double-bounce2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    //引入加载动画
    export default {
        name: "index",
        data(){
            return {
                //默认数据
                state:null,
                showMSG:null,
                isShow:null,
                timeOut:false,
            }
        },
        mounted() {
            //初始化默认值
            this.state = this.$store.state.AppLoding.state
            this.showMSG = this.$store.state.AppLoding.showMSG
            this.isShow =this.$store.state.AppLoding.isShow
        },
        methods:{
            cancel(){
                // history.back()
                console.log("取消加载")
                this.$store.commit("AppLoadOnOFF")
            }
        },
        computed:{
            State(){
                return this.$store.state.AppLoding.state
            },
            ShowMSG(){
                return this.$store.state.AppLoding.showMSG
            },
            IsShow(){
                return this.$store.state.AppLoding.isShow
            }
        },
        watch:{
            State(){
                this.state = this.State
            },
            ShowMSG(){
                this.showMSG = this.ShowMSG
            },
            IsShow(){
                this.isShow = this.IsShow
            }
        }
    }
</script>

<style scoped lang="scss">
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
    .indexBC{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        background:rgba(0,0,0,0.5)
    }
    .showImg{
        position: relative;
        width: 60vw;
        background: white;
        z-index: 4;
        padding: 6vw 9vw;
        font-weight: 200;
    }
    .showText{
        font-size: 15px;
    }
    .showContent{
        font-size: 3vw;
        padding: 1vw 0;
    }
    .cancel{
        position: absolute;
        right: 3vw;
        top: 3vw;
        width: 7vw;
        height: 7vw;
    }
    .cancel img{
        width: 100%;
    }

    /*加载动画*/
    .spinner {
        width: 15vw;
        height: 15vw;
        position: relative;
        margin: 3vw auto;
    }
    .double-bounce1, .double-bounce2 {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #67CF22;
        opacity: 0.6;
        position: absolute;
        top: 0;
        left: 0;

        -webkit-animation: bounce 2.0s infinite ease-in-out;
        animation: bounce 2.0s infinite ease-in-out;
    }

    .double-bounce2 {
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
    }

    @-webkit-keyframes bounce {
        0%, 100% { -webkit-transform: scale(0.0) }
        50% { -webkit-transform: scale(1.0) }
    }

    @keyframes bounce {
        0%, 100% {
            transform: scale(0.0);
            -webkit-transform: scale(0.0);
        } 50% {
              transform: scale(1.0);
              -webkit-transform: scale(1.0);
          }
    }
</style>