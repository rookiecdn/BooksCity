//验证图片信息
//两个参数   第一个file的dom,第二个限制大小
export function ValidIMG(DOM,MAXSIZE){
        //获取数据节点DOM
        var fileInput = document.getElementById(DOM).files
        let fileSize = 0   //初始化为0  最大不能超过2M
        //设置最大值
        let MaxSize = MAXSIZE   //最多不能超过2M
        //fileInput[0].size/(1024*1024)
        for (const fitem of fileInput) {
            fileSize += fitem.size/(1024*1024)
        }
    if(MaxSize>=fileSize){
            return true
        }
        return false
}
//验证规则
//验证字段 最小不能为0
//接收两个参数  都是数组或者都是对象
//数组     下标=>下标
//对象     key=>key
//单独值   字段 => 规则  :  number 验证长度   string验证是否一致  bool(true)验证不能为空,false可以为空  如果规则是数组 那么就最大值和最小值
//数组一   存放要验证的字段
//验证二   存放验证的规则a:123  
export function ValidTEXT(filedKey,filedRule,filedErr){
    //存放错误信息的对象   存放错误数据的 下标或者key
    let errMSG = []
    //获取对象的key
    //验证两个数据的规则
    if( (typeof filedKey) === (typeof filedRule)){
        //如果相等,要么是对象,要么是数组
        let typeofBom = filedKey
        //如果是数组
        if(typeof typeofBom.length == 'number'){
            //查看规则类型
            filedRule.forEach(function(v,i){
                Rule(v,i,errMSG,filedKey,filedErr)
            })
        }else if(typeof typeofBom == 'object'){
            for(let key in filedRule){
                Rule(filedRule[key],key,errMSG,filedKey,filedErr)
            }
        }
        return errMSG
    }
}
//传递   v,i,收集错误信息的变量,变量的字段
function Rule(v,i,errMSG,filedKey,filedErr) {
    //如果自定义错误规则存在,输出自定义错误规则
    switch(typeof v){
        case "number":
            //判断字段i的长度是不是大于等于0  小于等于v
            //如果不是就存放错误信息 继续执行
            //如果数据字段的值为number,那么就比大小
            if(typeof filedKey[i] == 'number'){
                if(!(v >= filedKey[i]))
                errMSG.push(filedErr[i])
            }else if(!(v >= filedKey[i].length > 0))
            errMSG.push(filedErr[i])
            break;
        case "string":
            //判断用户提交的值是否与字符中相等
            //如果不是就存放错误信息 继续执行
            if(!(filedKey[i] === v)){
                errMSG.push(filedErr[i])
            }
            break;
        case "boolean":
            //如果等于boole 验证是否为空值
            if(filedKey[i] == ''){
                if(v){
                    errMSG.push(filedErr[i])
                }
            }
            break;
        default:
            if((typeof v.length) == 'number'){
                if(!(v[1] >= filedKey[i].length && filedKey[i].length >= v[0])){
                    errMSG.push(filedErr[i])
                }
            }
        break;
    }
}



//第一代版本
// function Rule(v,i,errMSG,filedKey) {
// //如果等于number  判断长度
//     if ((typeof v) == 'number') {
//         //判断字段i的长度是不是大于等于0  小于等于v
//         //如果不是就存放错误信息 继续执行
//         //如果数据字段的值为number,那么就比大小
//         if (typeof filedKey[i] == 'number') {
//             if (!(v >= filedKey[i]))
//                 errMSG.push(filedKey[i] + "数据的值不能大于" + v)
//         } else if (!(v >= filedKey[i].length > 0))
//             errMSG.push(filedKey[i] + "数据的长度应该为" + v + "个字符")
//     } else if ((typeof v) == 'string') {
//         //判断用户提交的值是否与字符中相等
//         //如果不是就存放错误信息 继续执行
//         if (!(filedKey[i] === v)) {
//             errMSG.push(filedKey[i] + "与规定的数据不相同")
//         }
//     } else if ((typeof v) == 'boolean') {
//
//     } else if ((typeof v.length) == 'number') {
//         if (!(v[1] >= filedKey[i].length > v[0])) {
//             errMSG.push(filedKey[i] + "长度应当在" + v[0] + "以上" + v[1] + "一下")
//         }
//     }
// }


//调用验证
// // let result = ValidTEXT(['abcd','aaaa','cccc',''],[2,'aaa',3,true])
//                 let obj1 = {
//                     name:"张三",
//                     age:18,
//                     clas:"计算机应用三班",
//                     loves:"哈哈哈哈哈哈哈哈哈哈哈哈哈哈"
//                 }
//                 let obj2 = {
//                     name:"李四",    //名字必须叫李四
//                     // name:4,        //名字长度小于等于4
//                     age:25,        //年龄小于等于25岁
//                     clas:10,       //班级名称小于等于10
//                     loves:10       //爱好长度小于等于10
//                 }
//                 //调用验证
//                 let result = ValidTEXT(obj1,obj2)
//                 console.log(result)