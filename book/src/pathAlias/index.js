//处理路径别名的
export function format(imgName, key) {
    // return require(imgName)
    // require.context()   参数一目录,参数二一个标记表示是否还搜索其子目录 参数三一个匹配文件的正则表达式。
    //（创建出）一个 context，其中文件来自 test 目录，request 以 `.test.js` 结尾。、
    // require.context('./test', false, /\.test\.js$/);
    //先从当前文件开始绑定到指定目录中去
    let contxt = require.context("../static", true, /\.(png|jpg|jpeg|gif)$/)
    let imgUrl;
    //默认值
    let arr = [contxt("./userHeads/abc.jpg"),contxt("./replys/ces1.jpg")]
    //查看是否有异常
    try {
        if (key == 1) {
            //key == 1  标识渲染头像
            imgUrl = contxt("./userHeads/" + imgName)
        } else if (key == 2) {
            //key == 2  标识渲染评论图片
            imgUrl = contxt("./replys/" + imgName)
        }else if(key == 3){
            //key == 3  标识渲染App文件夹下的图片
            imgUrl = contxt("./app/" + imgName)
        }
    }catch (e) {
        return arr[key-1]
    }
    return imgUrl
}