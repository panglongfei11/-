<template>
  <div class="login-page">
    <video class="v1" autoplay muted loop >
      <source  src="@/assets/vedio/bg_video.mp4">
  </video>
    <img src="../../assets/images/timg.jpg" alt="" class="img1">
  <div class="loginContainer">
    <h1 class="h1">心若相依管理系统</h1>
      <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="demo-loginForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          type="text"
          v-model="loginForm.username"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item label="验证码"
          class="captcha"
          prop="captcha">
        <el-input 
          type="text" 
          v-model="loginForm.captcha"
          autocomplete="off"
          @keyup.enter.native="submitForm('loginForm')"
        ></el-input>
       <span
       @click="refreshCaptcha"
        class="captcha-svg" 
        v-html="captchaSvg"></span>       
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
import { login,getCaptcha,verifyCaptcha } from "@/api"
import {mapMutations} from "vuex"
//登入逻辑的实现
//1、收集用户输入的username&password传递给后端
// 2、登入通过后，将后端返回的token存到本地
// 3、每次请求的时候，携带token到请求头authorization
// 4、展示token校验正确的数据 
// 5、校验不通过吗，跳转到登入页
  export default {
    data() {
      /**
       * @param {object}    就是一个表单验证对象
       * @param {String}   输入值
       * @param {Function}  校验通过不传参  不通过传参
       */

      // 校验用户名
      var validateUsername = (rule, value, callback) => {
        // var uPattern  = /^[a-zA-Z0-9_-]{4,16}/;
        // if(!uPattern.test(value)){
        //   callback("4到16位(字母、数字、下划线、减号)")
        // } 
        if(!value){
          callback("4到16位(字母、数字、下划线、减号)")
        }else{
          callback()
        }
      };
      // 校验用户密码
      var validatePassword = (rule, value, callback) => {
       if(!value){
          callback("请输入密码")
        }else{
          callback()
        }
      };
      // 校验验证码
      var validateCaptcha = (rule, value, callback) => {
       if( value === "" || value.length !== 5 ){
          callback(new Error("验证码输入有误"))
        }else{
          callback()
        }
      }
      return {
        loginForm: {
          username: '',//用户名
          password: '',//密码
          captcha:'',  //存放验证码
        },
        captchaSvg:"" ,//从服务器获取下来的验证码svg结构
        rules: {
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ], 
          captcha: [
            { validator: validateCaptcha, trigger: 'blur' }
          ]
        }
      };
    }, 
    mounted () {
      this.set_captcha()
    },
    methods: {
      // 一个用于获取验证码的方法
      set_captcha(){ 
          getCaptcha()
          .then( res => {
              this.captchaSvg = res.data.img;
          })
        },
        //刷新验证码
        refreshCaptcha(){
          this.set_captcha()
        },
      ...mapMutations(['SET_USERINFO']),
      submitForm(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {  //代表本地校验通过
            //先验证验证码是否正确如果正确，再发送登入请求
            let verifyRes = await verifyCaptcha(this.loginForm.captcha)
            console.log(verifyRes);
            console.log(verifyRes.data.state);

            if(!verifyRes.data.state){
                this.$message.error("验证码输入错误，请重新输入")
                return
            }



            //点击登录就出现加载动画效果
            const loading = this.$loading({
            lock: true,
            text: '玩儿命加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });

          //发送登入请求
          let {username,password}  = this.loginForm;
          login(username,password)
          .then(res=>{
            //服务器响应，关闭loading动画
            loading.close();
            //判断状态
            if(res.data.state){
              //用户名、密码正确
               this.$message.success('登录成功，欢迎使用心若相依系统');
              localStorage.setItem('xrxy-token',res.data.token)
              //同时将用户信息保存到localStorage
              localStorage.setItem('xrxy-userInfo',JSON.stringify(res.data.userInfo))
              localStorage.setItem('xrxy-permission-buttons',JSON.stringify(res.data.permission.buttons))
              //更改vuex中的state['userInfo']中的值
                 this.SET_USERINFO(res.data.userInfo)
                //  将用户权限按钮保存到vuex
                 this.$store.commit("SET_PERMISSION_BUTTONS",res.data.permission.buttons)
              //跳转至主页
              this.$router.push("/Welcome")
            }else{
              //用户名或者密码错误
              this.$message.error('用户名或密码有误');
            }
          })
          .catch(err=>{
            console.log(err)
          })
             
          } else {
            console.log('error submit!!');
            return false;
          }
        }) 
      }
    },
  }
  
</script>
<style scped>
/* 表单样式 */
    .el-form{
      width: 400px;
    }
  /* 登录背景 */
 .v1{
  min-width: 100%;
  min-height: 100%;
  position: fixed;
  z-index: -999;
  left: 0;
  top:0;
}
login-page{
  position: relative;
}
/* 登录内容 */
.loginContainer{
  text-align: center;
  width: 400px;
  height: 487px;
  position: absolute;
  top:15%;
  left: 60%;
  z-index: 10;
  background: rgba(0,0,0,.2);
  border-radius: 7%;
}
.h1{
  margin: 80px auto;
  color: brown;
}
/* 美女背景图片 */
.img1{
  width:300px;
  height: 500px;
  opacity: 0.4;
  margin-top:100px;
  margin-left: 100px;
  border-radius: 10%;
  z-index: -9999;
}
.captcha-svg{
  background: chartreuse;
  display: inline-block;
  height: 42px;
  width: 150px;
  vertical-align: middle;
  margin-left: -35px;
  border-radius: 5%;
  color: pink;
}
</style>
