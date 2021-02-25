<template>
    <div class="prompt">
        <transition name="fade">
            <div class="msg" v-if="isShow">
                <span>
                    {{promptText}}
                </span>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "prompt",
        props:{
            msg:{
                type:String,
                default:"OK"
            },
            show:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return {
                promptText:"",
                isShow:false
            }
        },
        mounted() {
            this.promptText = this.msg
            this.isShow = this.show
        },
        computed:{
            GetMSG(){
                return this.$store.state.AppPrompt.msg
            },
            GetSHOW(){
                return this.$store.state.AppPrompt.show
            },
        },
        watch:{
            GetMSG(){
                this.promptText = this.GetMSG
            },
            GetSHOW(){
                this.isShow = this.GetSHOW
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
    .msg{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        span{
           height: 10vw;
            padding: 2vw;
           background:rgba(0,0,0,0.5);
           color: white;
           display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>