<template>
  <div>
      <div class="input-group">
          <!-- 输入框 -->
          <template>
              <el-select v-model="searchValue"
                        filterable
                        clearable
                        remote
                        @blur="searchBlur"
                        @change="searchTextChange"
                        reserve-keyword
                        placeholder="请输入姓名,如果不更新,点击右侧搜索按钮"
                        :remote-method="remoteMethod"
                        :loading="loading">
                <el-option v-for="item in searchList"
                          :key="item.sId"
                          :label="item.name"
                          :value="item.name">
                </el-option>
              </el-select>
            </template>

        <!-- 更新按钮 -->
        <el-row>
            <el-button 
                icon="el-icon-search" 
                type="primary" 
                class="click-search" 
                plain 
                @click="searchButton">
            </el-button>
            <el-button 
                @click="sddStu" 
                v-haspermission="'add'"
                type="primary">添加项目
            </el-button>
        </el-row>
        </div>
        <!-- 班级搜索框 -->
        <div class="xuanze">
        选择班级：
            <el-select 
                v-model="classes" 
                filterable 
                @change="classChange"
                @visible-change="classVisible"
                placeholder="请选择">
                 <el-option
                    label="全部"
                    value="all">
                 </el-option>
                <el-option
                    v-for="(item,index) in classOptions"
                    :key="index"
                    :label="item"
                    :value="item">
                </el-option>
          </el-select>
        </div>
        <!-- 导出Excel数据表 -->
        <div class="exportExcel">
            <el-button 
                class="iconfont icon-excel daochu"
                size="small"
                @click="exportExcel">导出excel数据
                </el-button>
        </div>
        <!-- 表格 -->
         <el-table
            :data="stuData"
            v-loading="loading"
            border
            style="width: 100%">
            <el-table-column
              prop="headimgurl"
              align="center"
              label="头像"
              width="100">
              <template scope="scope">
                <img 
                  :src="scope.row.headimgurl"
                  width="50"
                  alt="">
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="姓名"
              width="160">
            </el-table-column>
            <el-table-column
              prop="class"
              align="center"
              label="班级"
              width="160">
            </el-table-column>
            <el-table-column
              prop="productUrl"
              align="center"
              label="项目">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template scope='{row}'>
                    <el-button type="primary"
                                class="btn"
                                icon="el-icon-view"
                                v-haspermission="'read'"
                                @click="$router.push({name:'studentProfile'})"
                                >查看</el-button>
                    <el-button type="primary"
                                class="btn"
                                v-haspermission="'edit'"
                                @click="editStu(row)"
                                icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger"
                                class="btn"
                                v-haspermission="'delete'"
                                @click="delstu(row)"
                                icon="el-icon-delete">删除</el-button>
                </template>
            </el-table-column>
  </el-table>
  <!-- 弹出dialog -->
  <qf-dialog></qf-dialog>
     <!-- 分页器 -->
    <div class="pagination">
        <el-pagination
          background
          hide-on-single-page
          layout="prev, pager, next"
          :page-size="dataCount"
          @current-change="changePage"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import dialog from '../../../components/dialog'
import {getstulist,delstu,searchstu,getClasses} from "@/api"
// 引入Excel
import qee from "qf-export-excel"
  export default {
    components: { 
    'qf-dialog': dialog
  },
    data() {
      return {
          loading:true,  //表格加载动画

          blurSearchValue:'',
          searchList: [],
          searchValue:[] ,
          list: [],
          states:[],
        
          classOptions: [],
          classes: '',
          params:{
            class:"",
            count:5
          },
          dataCount:5,  //每页展示的数据
          dataPage:1,  //页码
          stuData: [],  //学员列表信息
          total:0   //页码总数
      };
    }, 
    methods: {
      // 分页器
      changePage(page){
        this.dataPage = page;
        this.UpdateStuTable(this.params)
      }, 
      // 编辑、
      editStu(row){
        this.$bus.$emit("editStuEvent",row)
        
      }, 
      // 导出Excel数据表
      exportExcel(){
        let titleList =[
          {
            title:"头像",
            key:"headimgurl"
          },
          {
            title:"姓名",
            key:"name"
          },
          {
            title:"班级",
            key:"class"
          },
          {
            title:"项目",
            key:"productUrl"
          }
        ]
        let dataSource = this.stuData;
        qee(titleList,dataSource,"数据")
      },
      // 删除
      delstu(row){
        if(row && row.sId){
           this.$confirm('此操作将永久删除该文件, 是否继续?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 调用删除请求
          delstu(row.sId)
          .then( res => {
            if(res.data && res.data.state){
              console.log(res)
              this.$message.success("删除成功")
              this.UpdateStuTable()
            }else{
              this.$message.warning("删除失败")
            }
          })
          .catch(err=>{
            this.$message.warning("删除出错")
          })
          this.$message.success("删除成功");
        }).catch(() => {
          this.$message.warning("取消删除");          
        });
        }else{
          //没有row
          this.$message.error("没有传入row对象")
        }
      },
      //增加学员信息
      sddStu(){
        //弹出dialog
        this.$bus.$emit('showDialog')
      },
      //更新表格数据
      UpdateStuTable(params){
        this.loading = true;
        params = this.params;
        params.count = this.dataCount || ""
        params.page = this.dataPage || ""
        getstulist(params)
        .then(res=>{
          if(res.data && res.data.state){
            this.stuData = res.data.data
            this.total = res.data.total  //页数总数量
            this.loading = false;
          }else{
            this.$message.error("数据获取失败")
            this.loading = false;
          }
        })
        .catch(err=>{
          console.log(err.message)
           this.$message.warn("网络错误或者获取数据失败")
           this.loading = false;
        })
      },


      // 处理搜索框事件
       remoteMethod(query) {
         this.blurSearchValue = query
          let key = query
          searchstu(key)
          .then(res=>{
            
            if(res.data && res.data.state){
              this.searchList = res.data.data
            }else{
            this.$message.warning("搜索失败")
          }
          }).catch(err=>{
          this.$message.error("搜索出错")
        })
      },

      // 搜索选中值发生变化的事件
      searchTextChange(searchText){
        this.loading =true
        // 再次调用搜索功能
        let key = searchText
        searchstu(key)
        .then(res=>{
          if(res.data && res.data.data){
            // 更改表格数据
            this.stuData = res.data.data
            this.total = res.data.total   //对分页总数进行更改
            this.loading =false
          }else{
            this.$message.warning("更改失败")
          }
        }).catch(err=>{
          this.$message.error("更改出错")
        })
      },

      // 搜索框失去焦点 保持输入框的内容
      searchBlur () {
      // 将存储好的输入框值 设置给select组件
      this.searchValue = this.blurSearchValue
    },
    // 搜索按钮
    searchButton(){
      this.loading = true
      let key = this.blurSearchValue
        searchstu(key)
        .then(res=>{
        
          if(res.data && res.data.data){
            // 更改表格数据
            this.stuData = res.data.data
            this.loading =false
          }else{
            this.$message.warning("搜索失败")
          }
        }).catch(err=>{
          this.$message.error("搜索出错")
        }) 
    },
    // 选择班级
    classChange(query){
      let count = this.dataCount;
      this.params = query === "all" ? {count} : {class :query,count}
      this.UpdateStuTable(this.params)
    },
    // 班级选择框展开/收起触发的事件
     classVisible(isVisible){
      if(!isVisible) return
      this.dataPage = 1 
      // 发送获取班级的请求
      getClasses()
      .then(res=>{
        if(res.data  && res.data.state){
          this.classOptions = res.data.data
        }
      })
    }
    },
    mounted() {
      // this.restaurants = this.loadAll();
      //页面加载时获取表格数据
      this.UpdateStuTable(this.params)
      this.$bus.$on("updateStuTable",() =>{
        this.UpdateStuTable(this.params)
      })
    }
  };
</script>
<style scorpt>
.input-group{
    padding-top:30px;
    display: flex;
    vertical-align: middle;
}
/* 表格图片 */
.cell img{
  width:40px;
  height:40px;
}
/* 输入框 */
    .input-name{
        width: 40%;
    }
 .el-button {
    margin-left: 20px !important;
}
/* 搜索班级 */
.xuanze .el-input__inner {
  margin-top: 20px;
  border-radius: 27px;
}
.exportExcel{
  width: 200px;
  margin-left: 1100px;
  margin-bottom: 10px;

}
.exportExcel .daochu {
    color: green;
}  
.pagination{
  padding-top: 30px;
  display: flex;
  justify-content: center;
} 
</style>