import Vue from "vue";
import Vuex from "vuex";
// 引入api中的方法
import {getMenuList} from "@/api"
// 引入allRoutes
import allRoutes from "../router/allRoutes"
// 引入递归函数
import recursionRoutes from "../utils/recursionRoutes"
// 引入动态dynamicRoutes
import dynamicRoutes from "../router/dynamicRoutes"
// 引入router
import router from "../router"


Vue.use(Vuex);

// 刷新页面会丢失用户信息，所以要从localStorage中取
let userInfo = localStorage.getItem("xrxy-userInfo") ||'{}'
userInfo = JSON.parse(userInfo)
// 按钮
let permissionButtons = localStorage.getItem("xrxy-permission-buttons") ||'{}'
permissionButtons = JSON.parse(permissionButtons)

export default new Vuex.Store({
  state: {
    userInfo,  //保存用户登录信息在这里
    permissionButtons,//按钮权限
    menuList:[],  //定义用户侧边栏菜单
    crumbs:[], //设置面包屑
    // dialogVisible:true,   //控制dialog的显示隐藏
    
  },
  mutations: {
    //更改userInfo
    SET_USERINFO(state,payload){
      state.userInfo = payload;
    },
    // 设置按钮权限
    SET_PERMISSION_BUTTONS(state,payload){
      state.permissionButtons = payload
    },
     SET_MENULIST(state,payload){
       state.menuList =payload;
       //动态的路由添加到routes中，核心方法  router.addRoutes(括号里面是：符合路由配置规则的数据)
      //  1、将menuList赋值给dynamicRoutes的children 
      let target = dynamicRoutes.find(item=>item.path === "/")
      console.log("==============");
      // console.log(target);
      target.children =[...state.menuList]
      // console.log(dynamicRoutes);
      // 2、动态添加路由配置到router/routes中
      router.addRoutes(dynamicRoutes)
    },
    //设置面包屑
    SET_CRUMBS(state,payload){
        state.crumbs = payload
     }
    
  },
  actions: {
    //发送请求，获取用户菜单数据
    async FETCH_MENULIST({commit}){
      //通过allRoutes和请求回来的用户菜单数据进行对比，将结果提交给mutations
      let userMenu =  await getMenuList()
      // console.log(userMenu);
       let sideMenu = recursionRoutes(allRoutes,userMenu.data.menuList)
      //  console.log(sideMenu);
      //将结果提交给mutations
      commit("SET_MENULIST",sideMenu)
    }
  }, 
  modules: {}
});
