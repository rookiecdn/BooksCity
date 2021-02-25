export default{
    //用户登录保存数据
    UserLoads:{
        id: null,
        username: null,
        account: null,
        img: null
    },
    //用户当前访问的数据是第几列  默认是第一列,每列8条
    lenArticle:1,
    //用户当前访问的自己的数据是第几列.默认是第一列,每列五条
    lenMyArticle:1,
    //用户当前搜索的帖子:默认显示一列
    lenSearch:1,
    //用户搜索喜欢的帖子:默认显示一列
    lenLove:1,
    //初始化的时候加载的文章简介,只显示文章的简介
    AppInitialization:[],
    //初始化的时候加载我的文章,只显示简介
    AppGetMyArticle:[],
    //搜索的值 保存一下
    SearcAll:[],
    //我搜索的帖子
    AppGetSearch:[],
    //要阅读的文章的全部内容
    GetArticleAllMSG:[],
    //全局导航是否显示
    AppBottom:true,
    //全局等待页面是否显示
    AppLoding:{
        state:"请稍等",
        showMSG:"快马加鞭加载中",
        isShow:false,
        cancleBtn:0
    },
    //全局报错页面是否显示
    AppError:{
        //错误提示信息,是个数组
        errArr:[],
        isShow:false
    },
    //全局提示
    AppPrompt:{
        msg:"",
        show:false
    },
    //点击图片显示详细图片
    AppImgShow:{
      SHOW:false,
      ROOT:""
    },
    //初始化类型列表
    AppTypesList:[],
    //选择的类型列表
    GetTypes:[],
    //文章临时存储站
    Article:{
        title:"",
        content:""
    },
    //消息临时存储站
    NewsData:[]
}