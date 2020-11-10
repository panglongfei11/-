import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//导入工具类
import bus from "./utils/bus"
Vue.prototype.$bus = bus
//导入阿里字体库
import "./assets/iconFonts/iconfont.css"

// 引入公共样式
import "./assets/styles/base.css"
import "./assets/styles/el-reset.css"

// 引入完整的 Element。
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//引入subMenu组件
import qfSubMenu from "qf-sub-menu"
Vue.use(qfSubMenu)

//进度条导入
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//按需加载
// import { Carousel,CarouselItem} from 'element-ui';
// Vue.use(Carousel);
// Vue.use(CarouselItem);



// 引入鉴权按钮的方法
import has from "./utils/has"

// 导航守卫（路由前置钩子）
router.beforeEach((to, from, next) => {
  // 网页加载的时候开启进度条（出现）
  NProgress.start()
  let token = localStorage.getItem('xrxy-token') 
    //用户登录之后，localStorage中有token
    if(token){
      // 如果是注册页面或者是登入页面,直接放行 
      if(store.state.menuList.length == 0 ){
        //说明没有用户路由，触发action获取用户路由
        store.dispatch('FETCH_MENULIST')
        .then(()=>{
          //这里要注意，next里面要传参数即要进入页面的路由信息，因为next传参数后，当前要进入的路
          // 就会被废止，转而进入参数对应的路由，虽然是同一个路由，这么做主要是为了确保addRoutes生效了
          next({path:to.path})
        })
      } else{
        next()
      }
    }else{
      //没有token的话
      if(to.path ==='/login'){
        next()
      }else{
        //访问的如果不是登录页，那么就让他跳转至登录页
        next({path:'/login'}) 
      }

    }

})
  
// 使用路由后置钩子
router.afterEach((to,from)=>{
  // console.log(to);
  let crumblist = to.matched.slice(1)
  console.log(crumblist);
  store.commit('SET_CRUMBS',crumblist)
})


Vue.config.productionTip = false;

// 将鉴权方法添加到全局中，方调用
Vue.prototype.$has = has;
// 定义全局自定义指令，判断是否具备相应按钮权限
Vue.directive("haspermission",{
  bind(el,binding,VNode){
let buttons = localStorage.getItem("xrxy-permission-buttons")
buttons = JSON.parse(buttons)
   if(!has(buttons,binding.value)){ 
    //  禁用按钮
    // 先储存class类名，在这基础上加上is-disabled禁用按钮
    let className = el.className;
    el.className = className+" " +"is-disabled"
   }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
