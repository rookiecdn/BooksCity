<template>
    <div class="showImg">
        <transition name="fade">
            <div class="mubu" v-if="show" @click="close()">
                <img :src="root" alt="">
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "showImg",
        data(){
            return {
                show:true,
                root:""
            }
        },
        mounted() {
            this.show = this.$store.state.AppImgShow.SHOW
            this.root = this.$store.state.AppImgShow.ROOT
        },
        methods:{
            close(){
                this.$store.commit("AppImgShow")
            }
        },
        //监听
        computed:{
            ConSHOW(){
                return this.$store.state.AppImgShow.SHOW
            },
            ConROOT(){
                return this.$store.state.AppImgShow.ROOT
            }
        },
        watch:{
            ConSHOW(){
                this.show = this.ConSHOW
            },
            ConROOT(){
                this.root = this.ConROOT
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
    .mubu{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
        width: 100%;
        height: 100%;
        background: rgba(0.5,0.5,0.2,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            width:80%;
        }
    }
</style>