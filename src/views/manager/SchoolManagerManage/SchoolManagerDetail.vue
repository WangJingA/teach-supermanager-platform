<template>
  <div class="container">
    <div class="handle-box">
      <el-input  placeholder="管理员口令" class="handle-input mr10" v-model="query.uuid"></el-input>
      <el-input  placeholder="管理员名称" class="handle-input mr10" v-model="query.managerName" style="margin-left: 20px"></el-input>
      <el-button type="primary" :icon="Search" @click="handleSearch" class="search-button">搜索</el-button>
    </div>
    <el-card>
      <el-row gutter="20">
        <el-col :span="7">
          <p>姓名：{{$route.params.teachManager}}</p>
          <p>账号：{{$route.params.teachManagerAccount}}</p>
          <p>创建人：{{$route.params.createMan}}</p>
        </el-col>
        <el-col :span="7">
          <p>口令：{{$route.params.uuid}}</p>
          <p>密码：{{$route.params.teachManagerPassword}}</p>
          <p>创建人身份：{{$route.params.credit}}</p>
        </el-col>
        <el-col :span="7">
          <p>管理学校：{{$route.params.teachManagerSchool}}</p>
          <p>状态：{{$route.params.teachManagerStatus}}</p>
          <p>创建时间：</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import {Search} from "@element-plus/icons-vue";
import {listManagerBySchoolUid} from "../../../api/schoolmanager";

const query = reactive({
  uuid: '',
  managerName: '',
  schoolUid:'',
  pageIndex: 1,
  pageSize: 10
});
const getData = () => {
  listManagerBySchoolUid(query).then(respone=>{

    console.log(respone.data)
  })
};

// 查询操作
const handleSearch = () => {
  query.pageIndex = 1;
  getData();
};

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

.addClassPerson{
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
