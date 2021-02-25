/*
*    此模块用于存放和输出本地存储的数据
*    存储没有返回值
*    读取有返回值
*    删除存储的数据
* */
export function setDate(name,data) {
    sessionStorage.setItem(name,data);
}
export function getDate(name){
    return sessionStorage.getItem(name)
}
//删除
export function removeDate(name){
    //是数组
    if(name instanceof Array){
        name.forEach((v,i)=>{
            sessionStorage.removeItem(v)
        })
    }else {
        sessionStorage.removeItem(name)
    }
}
//删除所有
export function removeAll(){
    sessionStorage.clear()
}