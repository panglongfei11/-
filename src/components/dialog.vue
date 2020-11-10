<template>
  <!-- dialog窗口 用于添加和编辑的弹窗-->
  <el-dialog :title="dialogInfo.title"
             :visible.sync="dialogVisible">
    <el-form :model="stuForm"
             :rules="stuRules"
             ref="addStuRuleForm">
      <el-form-item label="头像">
        <el-upload class="uploadAvatar"
                   ref="uploadAvatar"
                   action="http://chst.vip/students/uploadStuAvatar"
                   list-type="picture-card"
                   :on-success="uploadSuccess"
                   :on-remove="removeAvatar"
                   :limit="1"
                   name="headimgurl"
                   :multiple="false">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="姓名"
                    prop="name">
        <el-input v-model="stuForm.name"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="项目地址"
                    prop="productUrl">
        <el-input v-model="stuForm.productUrl"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="班级"
                    prop="class">
        <el-input v-model="stuForm.class"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="年龄"
                    prop="age">
        <el-input v-model="stuForm.age"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="城市"
                    prop="city">
        <el-input v-model="stuForm.city"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学历"
                    prop="degree">
        <el-input v-model="stuForm.degree"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述"
                    prop="description">
        <el-input v-model="stuForm.description"
                  autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
                 @click="confirmClick('addStuRuleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import api from "@/api"
const api = require("@/api")
  // import api from '@/api'
  export default {
    computed:{
      
    },
    data() {
      return {
        dialogInfo: {
          title: "",
          requestName: "",
          editSuccessMsg: "",
          editerrorMsg: ""
        },
        //dialog数据源
    stuForm: {
      name: '',
      productUrl: '',
      headimgurl: '',
      class: '',
      age: '',
      city: '',
      degree: '',
      description: ''
    },
        showAvatar: true,
        dialogVisible:false,
        stuRules: {
          name: [
            { required: true, message: '请输入名字', trigger: 'blur' }
          ],
          class: [
            { required: true, message: '请输入班级', trigger: 'blur' }
          ],
          degree: [
            { required: true, message: '请输入学历', trigger: 'blur' }
          ],
          city: [
            { required: true, message: '请输入城市', trigger: 'blur' }
          ],
          productUrl: [
            { required: true, message: '请输入项目地址', trigger: 'blur' }
          ],
          age: [
            { required: true, message: '请输入年龄', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入描述', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      // 增加学员信息通过bus发送过来的事件
        this.$bus.$on("showDialog",() =>{
          this.dialogInfo.title = "增加学员信息"
          this.dialogInfo.requestName = "addStuDetail"
          this.dialogInfo.editSuccessMsg = "增加成功"
          this.dialogInfo.editerrorMsg = "增加失败"
          this.dialogVisible =true;
            
        })
        // 编辑学员信息发送过来的事件
      this.$bus.$on('editStuEvent',(row)=>{
         // 1.弹出dialog
          this.dialogVisible = true;
        // 2.数据回显
        // 更改dialog的信息 
        this.dialogInfo.title = "编辑学员信息"
        this.dialogInfo.requestName = "updateStu"
        this.dialogInfo.editSuccessMsg = "修改成功"
        this.dialogInfo.editerrorMsg = "修改失败"
        this.stuForm = {...row}
        // 3.更改提交
        
      })
    },
    methods: {
      uploadSuccess(r) {
        // 上传成功 给stuForm添加一条 headimgurl的属性
        this.stuForm.headimgurl = r.headimgurl
        console.log(r)
      },
      removeAvatar(r) {
          this.stuForm.headimgurl = ""
      },
      confirmClick(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 本地表单校验通 将表单信息提交到后台
            // 关闭 dialog
            this.dialogVisible = false;
            //增加或者编辑
           
            // addStuDetail(this.stuForm)
            api[this.dialogInfo.requestName](this.stuForm)
              .then(res => {

                if (res.data && res.data.state) {
                  // 提示添加成功 更新表格
                  this.$message.success(this.dialogInfo.editSuccessMsg)
                  this.$bus.$emit('updateStuTable')
                  // 清空stuForm数据对象
                  if (this.stuForm['_id']) delete this.stuForm['_id'];//清理_id字段 防止bug
                  Object.keys(this.stuForm).forEach(key => this.stuForm[key] = '')
                  this.$refs['uploadAvatar'].clearFiles() //清空上传文件
                } else {
                  this.$message.warning(this.dialogInfo.editerrorMsg)
                }
              }).catch(err => {
                console.log(err)
                this.$message.error('登入过期网络错误')
              })

            //编辑

          } else {
            this.$message.error('请将内容填写完整')
          }
        })
      }
    }
  }
</script>
<style>
  .uploadAvatar {
    text-align: left;
  }
  .el-upload-list__item.is-success,
  .el-upload--picture-card {
    width: 100px !important;
    height: 100px !important;
    line-height: 100px !important;
  }
  .el-dialog__header {
    padding: 0 !important;
    line-height: 60px;
  }
</style>