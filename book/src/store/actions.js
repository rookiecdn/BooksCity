//http请求类
import {IndexResults, PublishAnArticle} from "../require/https"
import {setDate,getDate} from "../storage";
//异步请求方法,不能直接操作state,调用mutations操作state
export default {
    //初始化首页的内容加载   (文章简述页面)
    //callback 当数据请求完毕后执行的
    CreateIndexHttpServer:(context,callback)=>{
        let len = context.state.lenArticle * 8
        let url = ((callback.authorId==null || callback.authorId== undefined)?('/Article/select/'+len):('/Article/select/'+len+'/'+callback.authorId))
        IndexResults(url).then(d=>{
            //获取完值以后,发送到mutations,操作state
            context.commit('CreateIndexMethod',d.data)
            //保存到本地
            setDate('CreateIndexMethod',JSON.stringify(d.data))
            callback.success()
        })
    },
    //获取指定的详细文章的内容
    //文章  图片  类型 一级评论 二级评论
    GetArticleHttpServer:(content,payload)=>{
        let url
        if(payload.authorId == null){
            url = payload.current
        }else {
            url = payload.current+"/"+payload.authorId
        }
        let setting = {
            "url":  "/Article/selectDetail/"+url,
            "method": "put",
        }
        IndexResults(setting).then(d=>{
            content.commit('GetArticleAllMSG',d.data)
            payload.success(d.data)
        })
    },
    //获取指定一级评论的数据
    GetReplysHttpServer:(content,payload)=>{
        var settings = {
            "url": "/Replys/select",
            "method": "POST",
            "data":{
                id:payload.current
            }
        }
        IndexResults(settings).then(d=>{
            //将数据保存起来
            let MSG = {
                id:payload.current,
                data:d.data
            }
            content.commit('GetReplysMSG',MSG)
            payload.success()
        })
    },
    //添加类型,获取显示类型
    GetTypesHttpServer:(content,payload)=>{
        //初始化筛选前15条
        if(typeof payload.limit === 'undefined'){
            payload.limit = 0
        }
        //搜索条件默认没有
        let where =""
        if(typeof payload.where !== 'undefined'){
            where = "/"+payload.where
        }
        IndexResults("/Types/select/"+payload.limit+where).then(d=>{
            content.commit("AppArticleTypeList",d.data)
            payload.success()
        })
    },
    //添加类型
    AddTypesHttpServer:(content,payload)=>{
        return IndexResults("/Types/save/"+payload)
    },
    //上传文章
    AppUploadHttpServer:(content,payload)=>{
        var settings = {
            "url": "/Article/save",
            "method": "POST",
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data":payload
        }
        return PublishAnArticle(settings)
    },
    //登录请求
    AppUserLoginHttpServer:(content,payload)=>{
        var settings = {
            "url": "/Login/in",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": payload
        };
        return IndexResults(settings)
    },
    //新增一级评论,二级评论
    AppReplysHttpServer:(content,payload)=> {
        var settings = {
            "url": "/Replys/save",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": payload
        };
        return IndexResults(settings)
    },
    //对帖子或者评论点赞
    AppLovesHttpServer:(content,payload)=> {
        return IndexResults("/Likes/add/"+payload.authorId+"/"+payload.articleId)
    },
    //对帖子评论或者点赞的时候,发送给指定用户
    AppSendMSGHttpServer:(content,payload)=>{
        let setting = {
            "url"    : "/News/add",
            "method" : "post",
            "data"   : payload
        }
        IndexResults(setting)
    },
    //获取属于我的消息
    AppGetMyMessage:(content,payload)=>{
        let setting = {
            "url"    : "/News/Get",
            "method" : "post",
            "data"   : {
             toAuthorId:payload
            }
        }
        IndexResults(setting).then(d=>{
            //保存到本地和Vuex state
            setDate("NewsData",JSON.stringify(d.data))
            content.commit("NewsDataSave",d.data)
            console.log(d.data)
        })
    },
    //将消息设置为已读
    SetReaded:(content,payload)=>{
        let setting = {
            "url"    : "/News/SetReaded",
            "method" : "post",
            "data"   : {
                id:payload
            }
        }
        return IndexResults(setting)
    },
    //获取我的帖子
    AppGetMyArticleHttpServer:(context,payload)=> {
        let len = context.state.lenMyArticle
        IndexResults("/Article/My/"+payload.id+"/"+parseInt(len)*5).then(d=>{
            context.commit('AppGetMyArticle',d.data)
            setDate("MYDATA",JSON.stringify(d.data))
            payload.success()
        })
    },
    //获取我搜索的帖子
    AppGetSearchHttpServer:(context,payload)=>{
        let len = context.state.lenSearch
        let setting = {
            "url": "/Article/search/"+len*5,
            "method":"put",
            "data": payload
        }
        IndexResults(setting).then(d=>{
            setDate("SEARCHDATA",JSON.stringify(d.data))
            context.commit('AppGetSearch',d.data)
            payload.success()
        })
    },
    //删除我的指定帖子
    AppRemoveHttpServer:(context,payload)=>{
        //  /delete/:authorId/:articleId    先作者 后 文章id
        let setting = {
            "url": "/Article/delete",
            "method":"put",
            "data": payload
        }
        return IndexResults(setting)
    },
    //获取我喜欢的帖子
    AppMyLovesArticleHttpServer:(context,payload)=>{
        //传递两个参数 一个是userId,一个是len
        let len = context.state.lenLove*5
        payload.len = len
        let setting = {
            "url": "/Article/SearchMyloves",
            "method":"put",
            "data": payload
        }
        return IndexResults(setting)
    },
    //修改个人信息
    AppEditMyData:(context,payload)=>{
        console.log(payload)
        let setting = {
            "url": "/UserLogin/editMyData",
            "method":"post",
            "data": payload
        }
        IndexResults(setting).then(d=>{
            //保存新数据
            if(d.data==-1){
                console.log("出错")
                return
            }
            context.commit("AppUserLoginSuccess",d.data)
            setDate("loginMSG",JSON.stringify(d.data))
            //成功后返回
            context.commit("AppPromptSuccess",{
                show:true,
                msg:"修改成功",
                success(){
                   history.back()
                }
            })
        }).catch(err=>{
            context.commit("AppPromptSuccess",{
                show:true,
                msg:"保存失败",
                success(){
                    console.log("保存失败")
                }
            })
        })
    },
    //注册用户
    AppRegisterHttpServer:(context,payload)=>{
        //提供默认的头像地址  AllGraph/userHeads/lzq.jpeg
        //提供默认的性别     0
        payload.img = "AllGraph/userHeads/lzq.jpeg"
        payload.sex = 0
        let setting = {
            "url" : "/UserLogin/register",
            "method":"post",
            "data": {
                userMSG:payload
            }
        }
        return IndexResults(setting).then(d=>{
            //已存在
            if(d.data == 500){
                context.commit("AppErrMSG",{
                    errArr:["此用户已存在"],
                    isShow:true
                })
            }
            //成功
            if(d.data == 200){
                //跳转到登录页面
                return 1;
            }
            //失败
            if(d.data == -1){
                context.commit("AppErrMSG",{
                    errArr:["注册失败"],
                    isShow:true
                })
            }
        })
    }
}