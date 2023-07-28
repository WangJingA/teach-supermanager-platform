<template>
  <div class="container">
    <div class="handle-box">
      <el-input  placeholder="学校口令" class="handle-input mr10" v-model="query.uuid"></el-input>
      <el-input  placeholder="学校名" class="handle-input mr10" style="margin-left: 20px" v-model="query.schoolName"></el-input>
      <el-button type="primary" :icon="Search" @click="handleSearch" class="search-button">搜索</el-button>
    </div>
    <el-card>
      <el-row gutter="20">
        <el-col :span="7">
          <div>
            <p v-if="schoolDetail.schoolInfo.schoolName">学校：{{schoolDetail.schoolInfo.schoolName}}</p>
            <p v-else>学校：{{$route.param.schoolName}}</p>
          </div>
          <div>
            <p v-if="schoolDetail.schoolInfo.createMan">创建人:{{schoolDetail.schoolInfo.createMan}}</p>
            <p v-else>创建人：{{$route.param.createMan}}</p>
          </div>
          <div>
            <p v-if="schoolDetail.schoolInfo.schoolDesc">学校描述:{{schoolDetail.schoolInfo.schoolDesc}}</p>
            <p v-else>学校描述：{{$route.param.schoolDesc}}</p>
          </div>
        </el-col>
        <el-col :span="7">
          <div>
            <p v-if="schoolDetail.schoolInfo.uuid">口令：{{schoolDetail.schoolInfo.uuid}}</p>
            <p v-else>口令：{{$route.param.uuid}}</p>
          </div>
          <div>
            <p v-if="schoolDetail.schoolInfo.credit">创建人身份：{{schoolDetail.schoolInfo.credit}}</p>
            <p v-else>创建人身份：{{$route.param.credit}}</p>
          </div>
        </el-col>
        <el-col :span="7">
          <div>
            <p v-if="schoolDetail.schoolInfo.status && schoolDetail.schoolInfo.status == 0">状态：已入驻</p>
            <p v-if="schoolDetail.schoolInfo.status && schoolDetail.schoolInfo.status == 1">状态：已出驻</p>
            <div v-else>
              <p v-if="$route.params.status == 0">状态：已入驻</p>
              <p v-if="$route.params.status == 1">状态：已入驻</p>
            </div>
          </div>
          <div>
            <p v-if="schoolDetail.schoolInfo.createTime">创建时间：{{schoolDetail.schoolInfo.createTime}}</p>
            <p v-else>创建时间：{{$route.param.createTime}}</p>
          </div>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" class="addSchoolManager" @click="addSchoolManager">添加管理员</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
 import {onMounted, reactive} from "vue";
 import {school} from "../../../store/schoolinfo";
 import {showSchoolDetail} from "../../../api/schoolinfo";
 import router from "../../../router";
 import {useRouter} from "vue-router";
 import {Search} from "@element-plus/icons-vue";
 import {ElMessage} from "element-plus";

 const query = reactive({
   uuid:'',
   schoolName:''
 })
  const schoolInfo = school()
     const schoolDetail = reactive({
       schoolInfo:{
         schoolName:'',
         uuid:'',
         status:'',
         createTime:'',
         createMan:'',
         credit:'',
         schoolDesc:''
       }
     })
     const addSchoolManager = ()=>{
        router.push({
          name:'SchoolManagerCreate',
          params:{
            uuid:''
          }
        })
     }
     const handleSearch = ()=>{
   if (query.schoolName != '' || query.uuid != '') {
     showSchoolDetail(query.uuid, query.schoolName).then(response => {
       if (response.data.code == "00000") {
         schoolDetail.schoolInfo.schoolName = response.data.data.schoolName
         schoolDetail.schoolInfo.status = response.data.data.status
         schoolDetail.schoolInfo.createTime = response.data.data.createTime
         schoolDetail.schoolInfo.createMan = '超级管理员'
         schoolDetail.schoolInfo.credit = '超级管理员'
         schoolDetail.schoolInfo.schoolDesc = response.data.data.schoolIntroduction
         ElMessage({
           type: 'success',
           message: '查询成功'
         })
       }
     })
     }
     }
     onMounted(()=>{

     })


</script>

<style scoped>
.container{
  //height: 90%;
}
.handle-box {
  margin-bottom: 20px;
}
.handle-input {
  width: 300px;
  height: 40px;
}
p{
  margin: 60px 0 30px 60px;
  font-size: 20px;
}

.addSchoolManager{
  width: 150px;
  height: 50px;
}
.search-button{
  width: 120px;
  height: 40px;
  margin-left: 30px;
}
.schart-box {
  display: inline-block;
  margin: 20px 100px 0 100px;
}
.schart {
  width: 800px;
  height: 400px;
}
.content-title {
  clear: both;
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
</style>
