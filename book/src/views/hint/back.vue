<template>
    <div class="back">
        <div class="writeHead">
            <div @click="back()" class="writeHeadImg">
                <img src="~img/back.png" alt="">
            </div>
            <div class="writeHeadText">
                {{title}}
            </div>
            <div class="writeHeadMore"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "back",
        methods:{
            back(){
                history.back()
            }
        },
        props:{
            title:""
        }
    }
</script>

<style scoped lang="scss">
    .writeHead{
        padding: 3vw;
        display: flex;
        align-items:center;
        .writeHeadImg{
            img{
                width: 10vw;
            }
        }
        .writeHeadMore,.writeHeadImg{
            flex: 1;
        }
        .writeHeadText{
            flex: 3;
            width: 80%;
            text-align: center;
        }
        button{
            border-radius: 15px;
            font-size: 3vw;
            font-weight: 200;
        }
    }
</style>