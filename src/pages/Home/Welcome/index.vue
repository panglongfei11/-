<template>
    <div class="welcome">
        <template>
            <el-table
                :data="welcomeData"
                border
                
                style="width: 100%">
                <el-table-column
                    prop="username"
                    label="登录账号"
                    align="center"
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="lastLogin.ip"
                    label="上次登入IP"
                    align="center"
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="lastLogin.loginTime"
                    label="上次登入时间"
                    align="center"
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="nowLogin.ip"
                    label="本次登入IP"
                    align="center"
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="nowLogin.loginTime"
                    label="本次登入时间"
                    align="center"
                    width="265">
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>
<script>
import {getLoginLog} from "@/api"
export default {
    data(){
        return{
             welcomeData:[]
        }
    },
    created(){
        getLoginLog()
        .then(res=>{
            if(res.data && res.data.state){
                console.log(res);
                this.welcomeData = res.data.data
            }
        })
    }
}
</script>
<style scoped>
    .welcome{
        margin-top: 40px;
        margin-left: 30px;
    }
</style>