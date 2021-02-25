<!--
    *
      此组件只负责提交搜索
    *
-->
<template>
    <div class="searchBody">
        <bscroll ref="bsc">
            <div class="searchHead">
                <div class="back" @click="back()">
                    <img src="~img/backs.png" alt="">
                </div>
                <div class="searInput paddings">
                    <input type="text" v-model="searchDate" class="form-control" name="searchValue">
                </div>
                <div class="searBotton paddings">
                    <input type="button" class="btn btn-sm btn-success" @click="searchHTTP()" value="搜索">
                </div>
            </div>
            <!-- 类型 -->
            <types v-if="err==null" :typeList="types" @sendSelectedTypes="getTypes"></types>
            <div class="err">{{err}}</div>
        </bscroll>
    </div>
</template>

<script>
    import $ from 'jquery'
    import types from "./types"
    import bscroll from "../../views/betterScroll/index"
    import resultItems from "./resultItems";
    import {getDate, setDate} from "../../storage"
    export default {
        name: "searchBody",
        data(){
            return {
                //用户选择的类型
                selected:[],
                //搜索的数据
                searchDate:[],
                //搜索的数据
                searchArticle:null,
                //错误信息
                err:null
            }
        },
        mounted() {
            let h = $(document).outerHeight(true)
            this.$refs.bsc.setScrollHeight(h)
            this.$refs.bsc.setScrollTop(h)
        },
        methods:{
            back(){
                history.back()
            },
            getTypes(d){
              this.selected = d
            },
            searchHTTP(){
                console.log(this.searchDate.length)
                if(this.searchDate.length===0){
                    this.searchArticle = null
                    this.err = null
                    this.$store.commit('AppErrMSG',{
                        errArr:["关键字不得为空"],
                        isShow:true
                    })
                    return
                }
                //进行http请求
                let that = this
                //将搜索的条件保存起来
                that.$store.commit("SetSearcAll",{
                    include:this.searchDate,
                    types:this.selected
                })
                console.log("搜索")
                //进行请求
                this.$store.dispatch('AppGetSearchHttpServer',{
                    include:this.searchDate,
                    types:this.selected,
                    authorId:JSON.parse(getDate("loginMSG")).id,
                    success(){
                        that.searchArticle = JSON.stringify(that.$store.state.AppGetSearch)
                        if(JSON.parse(that.searchArticle).length == 0){
                            //没有数据
                            that.err = "没有查询到相关文章"
                            return
                        }
                        //保存数据 跳转
                        //直接调用我的帖子 模板
                        that.$router.push({
                            path:'/myarticle/500/2',
                        })
                    }
                })
            }
        },
        components:{
            types,
            bscroll,
            resultItems
        }
    }
</script>

<style scoped lang="scss">
    .searchHead {
        display: flex;
        .back {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                margin-left: 10px;
                width: 80%;
            }
        }
        .searInput {
            flex: 7;
            display: flex;
            align-items: center;
            justify-content: center;
            input{
            }
        }
        .searBotton {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            input{
            }
        }
    }
    .paddings{
        padding: 8px;
    }
    .form-control{
        font-size: 4vw;
        font-size: 0.9rem;
    }
    .err{
        padding: 10px;
        font-size: 4vw;
        font-size: .7rem;
    }

</style>