<template>
  <div class="home-page">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200">
        <!-- 左上方logo -->
        <h1 class="logo"></h1>
          <el-menu  
              :default-active="$route.path"
              text-color="#00FF00"
              class="el-menu-vertical-demo" 
              :router="true"
              :collapse="isCollapse">
              <!-- 老师的插件 -->
           <qf-sub-menu :sideMenu="menuList"></qf-sub-menu>
          </el-menu>
      </el-aside>
      <el-container>
        <!-- 顶部栏 -->
        <el-header>
            <el-row type="flex" class="row-bg" justify="space-between">
              <!-- 左 -->
              <el-col :span="6"><div class="grid-content bg-purple"></div>
                  <!-- <i class="iconfont icon-shouqi" @click="icon"></i> -->
                  <div @click="showIcon">
                          <i class="iconfont icon-zhankai" v-if="!showSearch"></i>
                          <i class="iconfont icon-shouqi" v-if="showSearch"></i>
                  </div>

              </el-col>
              <!-- 中 -->
              <el-col :span="6"><div class="grid-content bg-purple-light"></div> <h2>心若相依管理系统</h2></el-col>
              <!-- 右 -->
              <el-col :span="6"><div class="grid-content bg-purple"></div>
              <!-- 头像 -->
              <el-avatar  class="pic"
                    :size="35"
                    fit="fit"
                    src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1603223410960&di=6d17312a743bbd3c507ebc60dc5d0a3d&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F-vo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F6609c93d70cf3bc792044979d300baa1cd112a1a.jpg">
              </el-avatar>
              <span class="welcome" @click="$router.push('/Mine')">欢迎您：{{userInfo.nickname}} </span>
              <span class="quit" @click="quit">退出</span>
              </el-col>
          </el-row>
        </el-header>
        <!-- 主题区域 -->
        <el-main>
          <!-- 面包屑区域 -->
           <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item
               :to= "{path:crumb.path}" 
               v-for="crumb in crumbs" :key="crumb.index">
                {{crumb.meta.name}}
              </el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.logo{
  height: 60px;
  background:linear-gradient(135deg,#4c67ff,#5635df);
  background-image: url("../../assets/images/logo.jpg");
  background-size: 110%;
  background-repeat: no-repeat;
  background-position: center;
}
/* 收起图标 */
.icon-shouqi,.icon-zhankai{
 font-size: 37px;
 color: white;
 margin-right: 300px;
 cursor: pointer;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background: linear-gradient(135deg,#5635df,#4c67ff);
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  color: #333;
  /* text-align: center;
  line-height: 160px; */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

/* 侧边栏样式 */
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;

  }
  .home-page{
    position: relative;
  }
  /* 头像 */
  .pic{
    margin-right: 10px;
    vertical-align: middle;
  }
  /* 头像框旁边 */
  .welcome{
    color: white;
    font-size: 18px;

  }
  /* 退出 */
  .quit{
    color:goldenrod;
    font-size: 18px;
    cursor: pointer;
    margin-left: 10px;

  }
</style>

<script>
import  { getLoginLog } from "@/api"
import {mapState} from "vuex"
import router from "../../router"
  export default {
    computed:{
      ...mapState(['userInfo','menuList','crumbs'])
    },
    data() {
      return {
        isCollapse: false,  //控制侧边栏收缩
        showSearch:false,  //控制图标切换
      };
    },
    mounted(){
      //日志
      getLoginLog().then(res=>{
        // console.log(res);
      })
      
    },
    methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      quit(){
       //退出登录
        // 1、清除token和userInfo
        // 2、跳转至登入页面
        localStorage.removeItem("xrxy-token")
        localStorage.removeItem("xrxy-userInfo")
        this.$router.push("/login")
        //刷新页面
        window.location.reload()
      },
      showIcon () {
         this.showSearch = ! this.showSearch;
         this.isCollapse = ! this.isCollapse;
},
    }
  }
</script>
