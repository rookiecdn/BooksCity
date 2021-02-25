import { createRouter, createWebHistory } from 'vue-router'
//懒加载模板
//搜索部分
//搜索主页
const SearchIndex = () => import('@/views/search/searchIndex')
//搜索功能区
const searchBody = () => import('@/views/search/searchBody')
//搜索结果显示模板
const searchResults = () => import('@/views/search/searchResults')
//文章详细模板
const theArticleDetailed  = () => import('../views/search/theArticleDetailed')
//评论详细页面
const replyDetailed = () => import('@/views/search/replyDetailed')
//创作部分
const writeIndex = () => import('@/views/write/index')
//创作部分类型选择部分
const multipleType = () => import('@/views/write/multipleType')
//消息部分
const message = () => import('@/views/message/index')
//我的部分
const my = () => import('@/views/my/index')
//个人资料部分
const personalData = ()=>import('@/views/my/personalData')
//管理部分
const manage = () => import('@/views/my/manage')
//我的文章
const myarticle = () => import('@/views/my/myarticle')
//登陆部分
const login = () => import('@/views/login/index')
//评论组件
const replays = () => import('@/views/replys/index')

const routes = [
  //搜索,推荐主页部分
  {
    path: '/',
    name: 'SearchIndex',
    component: SearchIndex
  },
  {
    path: '/searchBody',
    name: 'searchBody',
    component: searchBody
  },
  {
    path:'/searchResults',
    component: searchResults,
    name: "searchResults"
  },
  {
    path: '/theArticleDetailed',
    component:theArticleDetailed,
    name: 'theArticleDetailed'
  },
  {
    path: '/replyDetailed',
    component:replyDetailed,
    name: "replyDetailed"
  },
  //创作页面
  {
    path: '/writeIndex',
    component:writeIndex,
    name: "writeIndex"
  },
  {
    path:"/multipleType",
    component:multipleType,
    name:'multipleType'
  },
  //消息部分
  {
    path: '/message',
    component:message,
    name: "message"
  },
  //我的部分
  {
    path: '/my',
    component:my,
    name: "my"
  },
  {
    path: '/personalData',
    component:personalData,
    name: 'personalData'
  },
  {   //指定的数据  我都喜欢  我的文章   搜索结果
    path: '/myarticle/:id/:i',
    component:myarticle,
    name: "myarticle"

  },
  {   //管理
    path: '/manage',
    component:manage,
    name: 'manage'
  },
  {
    path: '/login',
    component:login,
    name: "login"
  },
  //用户点击了评论部分
  {
    path: '/replays',
    component:replays,
    name: 'replays'
  }
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
