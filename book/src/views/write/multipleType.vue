<template>
    <div class="multipleType">
        <bscroll ref="becl">
            <div class="writeHead">
                <div @click="back()" class="writeHeadImg">
                    <img src="~img/back.png" alt="">
                </div>
            </div>
            <!-- 内容 -->
            <div class="TypesOfContent">
                <!-- 搜索 -->
                <div class="input-group">
                    <input type="text" placeholder="搜索分类标签" v-model="searchValues" class="form-control input-lg content">
                    <span @click="searchTypes()" class="search btn btn-primary">搜索</span>
                </div>
                <!-- 显示区域 -->
                <div class="pleaceCheck" v-if="!isSearchResult">请选择</div>
                <div class="showTypesArea">
                    <div v-for="(typeItem,id) in typesList" :class="['items',{'checked':isChecked(typeItem)}]" @click="setClass(typeItem)">{{typeItem.typeValue}}</div>
                </div>
                <!-- 当没有搜索值时显示 -->
                <div class="showTypesArea noValue" v-if="isSearchResult">
                    <div>很抱歉没有搜索到"{{searchValues}}",不过您可以点击添加,或搜索别的</div>
                    <input type="button" @click="addTypes()" class="btn btn-success btn-sm" :value="'添加'+searchValues+'到类型'">
                </div>
                <!-- 您选择了 -->
                <div v-if="checkCountZero" class="meSelected">
                    <lable>您选择了</lable>
                    <div class="select">
                        <div v-for="checkedV in checked" class="selectItems items" style="transition: .225s ease-in-out">
                            {{checkedV.typeValue}}
                            <img class="selectImg" @click="cancel(checkedV)" src="~img/cancel.png" alt="">
                        </div>
                    </div>
                </div>
                <!-- 提交 -->
                <input v-if="!isSearchResult" type="button" class="btn btn-sm btn-primary over" @click="send" value="选完了">
            </div>
        </bscroll>
    </div>
</template>

<script>
    import bscroll from "../betterScroll"
    import $ from "jquery"

    export default {
        name: "multipleType",
        data(){
            return {
                typesList:[],
                //保存数据 id+类型
                checked:[],
                //保存类型用于判断
                checkedId:[],
                searchValues:"",
                errMSG:[]
            }
        },
        created() {
            //开启加载动画
            this.$store.commit("AppLoadOnOFF",{
                isShow:true
            })
        },
        mounted() {
            setTimeout(()=>{
                let docu = $(document).outerHeight(true)
                this.$refs.becl.setScrollHeight(docu)
                let that = this
                that.$store.dispatch("GetTypesHttpServer",{
                    success() {
                        that.typesList = that.$store.state.AppTypesList
                        that.$store.commit("AppLoadOnOFF")
                    }
                })
            },100)
        },
        methods:{
            back(){
                history.back()
            },
            searchTypes(){
                var that = this
                //开启动画
                that.$store.commit("AppLoadOnOFF",{
                    isShow:true
                })
                that.$store.dispatch("GetTypesHttpServer",{
                    where:this.searchValues,
                    success() {
                        that.typesList = that.$store.state.AppTypesList
                        //关闭动画
                        that.$store.commit("AppLoadOnOFF")
                    }
                })
            },
            setClass(type){
                let that = this
                if(that.checked.indexOf(type) !== -1){
                    that.removeTypes(that.checked,that.checked.indexOf(type))
                    console.log(that.checked)
                }else{
                    if(that.checked.length<4){
                        that.checked.forEach((v,i)=>{
                            if(v.id === type.id){
                                that.removeTypes(that.checked,i)
                                return -1
                            }
                        })
                        that.addMyTypes(that.checked,type)
                        return
                    }
                    that.$store.commit("AppErrMSG",{
                        errArr:["类型数量不能超过四个"],
                        isShow:true
                    })
                }
            },
            send(){
                //发送给父节点处理
                this.$store.commit("MySelectType",this.checked)
                console.log(this.$store.state.GetTypes)
                history.back()
            },
            cancel(v){
                this.checked.splice(this.checked.indexOf(v),1)
            },
            addTypes(){
                let that = this
                that.$store.commit("AppLoadOnOFF",{
                    state:"上传中",
                    showMSG:"服务器正在跨马加鞭...",
                    isShow:true
                })
                that.$store.dispatch("AddTypesHttpServer",that.searchValues).then(d=>{
                    if(d.data == 1){
                        that.$store.dispatch("GetTypesHttpServer",{
                            where:that.searchValues,
                            success() {
                                that.typesList = that.$store.state.AppTypesList
                                that.$store.commit("AppLoadOnOFF")
                            }
                        })
                    }else{
                        that.$store.commit("AppLoadOnOFF")
                        that.$store.commit("AppErrMSG",{
                            errArr:["类型或已存在"],
                            isShow:true
                        })
                    }
                })
                //重新获取显示搜索列表

            },
            //添加一个类型到我选的类型
            addMyTypes(arr,brr){
                arr.push(brr)
            },
            //删除重复的我选的类型
            removeTypes(arr,i){
                arr.splice(i,1)
            }
        },
        computed:{
            //判断是否被选中
            isChecked(){
                return value=>{
                   return this.checked.indexOf(value)==-1?false:true
                }
            },
            //判断选择的条数是否为零
            checkCountZero(){
                if(this.checked.length === 0){
                    return false;
                }
                return true;
            },
            //判断搜索的是否有值
            isSearchResult(){
                return this.typesList.length === 0
            }
            //判断是否有选择项
        },
        components:{
            bscroll
        }
    }
</script>

<style scoped lang="scss">
    .writeHead{
        padding: 3vw;
        display: flex;
        justify-content: space-between;
        align-items:center;
        .writeHeadImg{
            img{
                width: 10vw;
            }
        }
    }
    .TypesOfContent{
        padding: 2vw 4vw;
    }

    .content{
        border-radius: 20px 0 0 20px !important;
        font-size: 0.9rem;
        padding: 1.2rem;
    }
    .search{
        font-size: 4vw;
        font-size: .8rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0 20px 20px 0 !important;
    }
    .showTypesArea{
        padding: 2vw 5vw;
        display: flex;
        flex-wrap: wrap;
    }
    .meSelected{
        padding: 5vw;
        label{
            font-weight: 200;
            font:{
                size: 4vw !important;
                size: .9rem !important;
            };
        }
        .select{
            display: flex;
            flex-wrap: wrap;
            .selectItems{
                position: relative;
                .selectImg{
                    width: 4vw;
                    height: 4vw;
                    position: absolute;
                    right: -2vw;
                    top: -2vw;
                }
            }
        }
    }
    .items{
        padding: 1vw 2vw;
        margin: 3vw 3vw 0 0;
        border: 1px solid #ccc;
        font-size: 4vw;
        color: slategrey;
        animation:Initems .225s;
        -webkit-animation:Initems .225s;
        transition: .22s ease-in-out;
    }
    @keyframes Initems {
       from {transform: scale(0,0)}
       to {transform: scale(1,1)}
    }
    .over{
        width: 100%;
        display: block;
        padding: 3vw;
        margin: 3vw 0vw;
        font-size: 4vw;
    }

    .checked{
        border: 2px solid black;
        color: black;
    }
    .pleaceCheck{
        padding: 4vw 0 0 5vw;
        font-size: 5vw;
        font-size: .9rem;
    }
    .noValue{
        font-size: 4vw;
        font-size: .8rem;
        display: flex;
        justify-content: center;
        padding: 6vw;
        div{
            padding: 2vw 0;
        }
        input{
            font-size: 4vw;
        }
    }
</style>