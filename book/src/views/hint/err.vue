<template>
    <div class="err">
        <transition name="fade">
            <div class="errIndex" v-if="showIn">
                   <div class="showMsg">
                       <h5>信息</h5>
                       <div v-for="(items,i) in errData">{{i+1}}:{{items}}</div>
                       <button @click="know()" class="btn btn-primary btn-sm">知道了</button>
                   </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "err",
        data(){
            return {
                errData:[],
                showIn:false
            }
        },
        mounted() {
            //初始化默认值
            this.errData = this.$store.state.AppError.errArr
            this.showIn  = this.$store.state.AppError.isShow
        },
        methods:{
            know(){
                this.$store.commit("AppErrMSG")
            }
        },
        computed:{
            ErrOrr(){
                return this.$store.state.AppError.errArr
            },
            IsShow(){
                return this.$store.state.AppError.isShow
            }
        },
        watch:{
            ErrOrr(){
                this.errData = this.ErrOrr
            },
            IsShow(){
                this.showIn = this.IsShow
            }
        }
    }
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
    .errIndex{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        background:rgba(0,0,0,0.5)
    }
    .showMsg{
        width: 80vw;
        padding: 5vw 5vw 0 5vw;
        font-size: 4vw;
        font-weight: 200;
        background:white;
    }
    .btn{
        margin: 5vw 0;
    }
</style>