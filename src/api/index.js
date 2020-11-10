import axios from "./config";

//登录
export const login =(username,password) => axios({
    url:"/users/login",
    method:"post",
    data:{
        username,
        password
    }
})

//获取登录日志
export const getLoginLog = () => axios.get('/getloginlog')

//获取用户菜单
export const getMenuList = () =>axios.get('/permission/getMenuList')

//获取验证码
export const getCaptcha = () =>axios.get('/users/getCaptcha')

//校验验证码
export const verifyCaptcha = (captcha) => axios.get(`/users/verifyCaptcha?captcha=${captcha}`)

//获取学员信息
export const getstulist = (params={}) => axios({
    url:"/students/getstulist",
    params
})

//新增学员信息
export const addStuDetail = (stuDetail) => axios(
    {
        url:'/students/addstu',
        method:'post',
        data:stuDetail
    }
)

//删除学员信息
export const delstu = (sId) => axios.get(`/students/delstu?sId=${sId}`)

// 编辑学员信息
export const updateStu = (updated = {}) => axios({
    url: '/students/updatestu',
    method: 'post',
    data: updated
  })

// 搜索学员
export const searchstu = (key) =>axios.get(`/students/searchstu?key=${key}`)

// 获取班级
export const getClasses = () => axios.get("/students/getclasses")



