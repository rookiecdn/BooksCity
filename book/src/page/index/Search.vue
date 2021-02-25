<template>
    <div class="index">
         <div class="search" @click="searc()">
             <span class="text"> {{text}} </span>
             <img src="~img/search.png" alt="">
         </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data(){
            return {
                text:'今日特使'
            }
        },
        methods:{
            searc(){
                console.log('search');
            }
        }
    }
</script>

<style scoped>
    .search{
        display: flex;
        border: 1px solid #cdcdcd;
        margin: 5px;
        height: 30px;
        justify-content: flex-end;
        align-items: center;
    }
    .search img{
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }
    .text{
        color: #cdcdcd;
        font-size: 11px;
        margin: auto;
    }
</style>