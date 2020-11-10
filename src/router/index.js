import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../pages/Login";
//解决路由导航到统一路径重复报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

//引入菜单路由
import allRoutes from "./allRoutes"
Vue.use(VueRouter);
 
const routes = [
  {
    path: "/login",
    name: "login",
    component: Login 
  },
  
  
  
];

const router = new VueRouter({
  routes
});

export default router;





