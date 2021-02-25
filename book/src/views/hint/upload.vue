<template>
        <transition name="fade">
            <div class="index" v-show="isShow">
               <div class="indexBC">
                   <div class="showImg">
                       <div class="showText">{{state}}</div>
                       <div class="showContent">{{showImg}}</div>
                       <div class="spinner"></div>
                   </div>
               </div>
            </div>
        </transition>
</template>

<script>
    export default {
        name: "index",
        props:{   //父组件传递
            thisState:{    //状态码
                type:Number,
                default:0
            },
            thisShowImg:{ //提示信息
                type:String,
                default:"操作执行中"
            },
            thisShow:{  //是否显示
                type:Boolean,
                default:false
            }
        },
        data(){
            return {
                //默认数据
                state:null,
                showImg:null,
                isShow:null
            }
        },
        mounted() {
            //初始化默认值
            this.state = this.thisState==0?"上传中":(this.thisState==1?"上传成功":"上传失败")
            this.showImg = this.thisShowImg
            this.isShow = this.thisShow
        },
        watch:{
            thisState(){
                this.state = this.thisState==0?"上传中":(this.thisState==1?"上传成功":"上传失败")
            },
            thisShowImg(){
                this.showImg = this.thisShowImg
            },
            thisShow(){
                this.isShow = this.thisShow
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
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3;
        position: absolute;
        top: 0;
        left: 0;
        background:rgba(0,0,0,0.5)
    }
    .showImg{
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
    }
    .spinner {
        width: 10vw;
        height: 10vw;
        background-color: #67CF22;
        margin: 3vw auto;
        -webkit-animation: rotateplane-1191044b 1.2s infinite ease-in-out;
        animation: rotateplane-1191044b 1.2s infinite ease-in-out;
    }
    @-webkit-keyframes rotateplane {
        0% { -webkit-transform: perspective(120px) }
        50% { -webkit-transform: perspective(120px) rotateY(180deg) }
        100% { -webkit-transform: perspective(120px) rotateY(180deg)  rotateX(180deg) }
    }
    @keyframes rotateplane {
        0% {
            transform: perspective(120px) rotateX(0deg) rotateY(0deg);
            -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)
        } 50% {
              transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
              -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)
        } 100% {
                transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
                -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
        }
    }
</style>