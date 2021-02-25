import {setDate} from "../storage/index"
export default {
    //操作state的方法
    //获取初始化完成的http请求  将数据添加到state
    CreateIndexMethod:(state,payload)=>{
        state.AppInitialization = payload
        setDate('AppInitialization')
    },
    //主页每次刷新增加访问数据
    SetlenArticle:(state,payload)=>{
        state.lenArticle+=1
    },
    //我的帖子刷新
    SetlenMyArticle:(state,payload)=>{
        state.lenMyArticle+=1
    },
    //我的帖子的数据保存,用于监听
    AppGetMyArticle:(state,payload)=>{
        state.AppGetMyArticle = payload
    },
    //当刷新我喜欢的帖子时:
    SetlenLove:(state,payload)=>{
        state.lenLove+=1;
    },
    //保存我搜索的条件
    SetSearcAll:(state,payload)=>{
        state.SearcAll = payload
        console.log(state.SearcAll)
    },
    //我搜索的帖子刷新
    SetlenSearch:(state,payload)=>{
        state.lenSearch+=1
    },
    //我搜索的帖子
    AppGetSearch:(state,payload)=>{
        state.AppGetSearch = payload
    },
    //获取到单个文章的内容,将数据添加到state中去  并存放到本地浏览器
    GetArticleAllMSG:(state,payload)=>{
        state.GetArticleAllMSG = payload
        setDate('GetArticleAllMSG',JSON.stringify(payload))
    },
    //获取单个一级评论的内容,将数据添加到state中去
    GetReplysMSG:(state,payload)=>{
        state.Replys = payload
        //改变网页内容
        setDate("rps",JSON.stringify(payload))
        //重新让文章也刷新
    },
    //当点击非主页的时候 让bottom导航隐藏或者显示
    NoneAppBottom:(state,boo)=>{
        state.AppBottom = boo
    },
    //关闭开启全局加载
    AppLoadOnOFF:(state,payload={})=>{
        let DEFAULT
        DEFAULT = {
            //如果没有传值默认是加载中
            state:typeof(payload.state) == "undefined"?"加载中":payload.state,
            showMSG:typeof(payload.showMSG) == "undefined"?"快马加鞭加载中":payload.showMSG,
            show:typeof(payload.isShow) == "undefined"?false:payload.isShow
        }
        state.AppLoding.state = DEFAULT.state
        state.AppLoding.showMSG = DEFAULT.showMSG
        state.AppLoding.isShow = DEFAULT.show
    },
    //取消按钮加载与初始化
    AppCancleBtn:(state,payload)=>{
        if(payload==1){ //payload等于1  标识开始自增
            state.AppLoding.cancleBtn+=1
        }else{    // paylaod 等于其他标识初始化
            state.AppLoding.cancleBtn = 0
        }
    },
    //初始化类型列表
    AppArticleTypeList:(state,payload)=>{
        state.AppTypesList = payload
    },
    //查看详细的图片开启
    AppImgShow:(state,payload={})=>{
        if(JSON.stringify(payload) == "{}"){
            state.AppImgShow.SHOW = false
            state.AppImgShow.ROOT = ""
            return
        }
        state.AppImgShow.SHOW = payload.show
        state.AppImgShow.ROOT = payload.root
    },
    //全局错误提示开启关闭
    AppErrMSG:(state,payload={})=>{
        if(typeof payload.isShow === 'undefined'){
            payload.isShow = false
        }
        state.AppError.errArr = payload.errArr
        state.AppError.isShow = payload.isShow
    },
    //获取选择的类型
    MySelectType:(state,payload=[])=>{
        state.GetTypes = payload
    },
    //保存临时的文章存储
    ArticleSave:(state,paylaod={})=>{
        if(JSON.stringify(paylaod)==="{}"){
            state.Article.title =""
            state.Article.content = ""
            return
        }
        state.Article.title = paylaod.title
        state.Article.content = paylaod.content
    },
    //保存临时消息的地方
    NewsDataSave:(state,paylaod)=>{
        //AppGetMyMessage
        state.NewsData = paylaod
    },
    //登录成功显示
    AppUserLoginSuccess:(state,payload={})=>{
        if(payload.id !== null){
            //直接替换值
            state.UserLoads = payload
        }else{
            //全部设置为null
            state.UserLoads.id = null
            state.UserLoads.username = null
            state.UserLoads.account = null
            state.UserLoads.img = null
        }
    },
    //全局小提示
    AppPromptSuccess:(state,payload={})=>{
        if(JSON.stringify(payload)==="{}"){
            state.AppPrompt.show = false
        }
        state.AppPrompt.show =  payload.show
        state.AppPrompt.msg  =  payload.msg
        payload.success()
        setTimeout(()=>{
            state.AppPrompt.show = false
        },500)
    }
}
