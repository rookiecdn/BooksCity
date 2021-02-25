//一般请求
import {Request} from './index'

//搜索时获取获取帖子的类型
export function Type(config) {
    return Request(config)
}
//获取主页显示的内容
export function IndexResults(config) {
    return Request(config)
}
//上传文章数据
//文字+图片
export function PublishAnArticle(config){
    return Request(config)
}