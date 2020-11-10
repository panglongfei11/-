import router from "../router"
import ElementUI from "element-ui";
// 下载并引入axios
import axios from "axios";
import NProgress from "nprogress";

// 配置服务器请求基础地址
axios.defaults.baseURL =process.env.NODE_ENV === 'development' ? '/api':"http://www.chst.vip"

// 开启跨域并携带cookie,如果接口并不接收cookie验证的话则不需要
axios.defaults.withCredentials = true;

//创建请求拦截器，可以给每个请求都携带上想要传递的内容
axios.interceptors.request.use(config=>{

     //登入和注册是不需要携带token
     if(config.url == '/user/login'){
          return config
     }else{
           //config就是指的每一个请求对象
          let token = localStorage.getItem("xrxy-token")
          config.headers['authorization'] = token
          //放行
          return config   
     }
})

//响应拦截（针对鸡贼用户）
axios.interceptors.response.use(config =>{
     NProgress.done()
     let {data} = config;  //解构
     if(data.code =='1004'||data.code=='10022'){   //1004是后台定义的状态码
          //在当前的后台api中1004代表token校验失败，10022表示session到期失效，提示信息，并且让页面跳转至登录页面
          ElementUI.Message.error("登入信息失效，请重新登录")
          localStorage.removeItem("xrxy-token")
          router.push("./login")
          //刷新页面
        window.location.reload()
     }
     return config

})



axios.create({
     timeout:4000
})

export default axios