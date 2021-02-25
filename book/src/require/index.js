import axios from 'axios'
//请求
export function Request(config) {
    var instace = axios.create({
        //请求的域名 固定的前缀
        baseURL:'http://www.bookscity.tp/index.php',
        //延迟时间
        timeout:5000
    })
    //创建一个axios请求
    return instace(config)
}

