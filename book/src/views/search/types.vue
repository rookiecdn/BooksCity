<template>
    <div class="types">
        <div class="searchType">
            <span v-for="(v,i) in types" class="TypeSpans" @click="setTypes(v.id,v.typeValue,i)">{{v.typeValue}}</span>
        </div>
    </div>
</template>

<script>
    import $ from "jquery";
    import { Type } from '../../require/https'
    export default {
        name: "types",
        props:{
            typeList:{
                type:Array,
                default:[]
            }
        },
        mounted() {
            Type('/Types/select/0').then(d=>{
                this.types = d.data
            })
        },
        data(){
            return {
                //所有的type列表
                types:[],
                //选择的
                selected:[]
            }
        },
        methods:{
            setTypes(data,id,index){
                let thisDom = $('.TypeSpans').eq(index)
                if(this.selected.indexOf(id)===-1){
                    this.selected.push(id)
                    thisDom.addClass('select')
                }else{
                    thisDom.removeClass('select')
                    this.selected.splice(this.selected.indexOf(id),1)
                }
                console.log(this.selected)
                this.$emit('sendSelectedTypes',this.selected)
            }
        }
    }
</script>

<style scoped lang="scss">
    .searchType{
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        .select{
            border: cadetblue 2px solid;
        }
        span{
            padding:3px 15px;
            margin: 5px;
            border: 1px solid #cdcdcd;
            border-radius: 15px;
            font-size: 4vw;
            font-size: .7rem;
            transition: .22s ease-in-out;
        }
    }
</style>