<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.uuid" placeholder="学校口令" class="handle-input mr10"></el-input>
        <el-input v-model="query.schoolName" placeholder="学校" class="handle-input mr10"></el-input>
        <el-select v-model="query.status" placeholder="入驻？出驻" class="handle-select mr10">
          <el-option key="1" label="入驻" value="0"></el-option>
          <el-option key="2" label="出驻" value="1"></el-option>
        </el-select>
        <el-button type="primary" :icon="Search" @click="handleSearch" class="search-button">搜索</el-button>
        <el-button type="primary" :icon="Plus" class="search-button" @click="addSchool">新增</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="uuid" label="口令" width="220" align="center"></el-table-column>
        <el-table-column prop="schoolName" label="学校"></el-table-column>
        <el-table-column prop="schoolAddress" label="地址"></el-table-column>
        <el-table-column label="学校图标(点击查看大图)" align="center">
          <template #default="scope">
            <el-image
                class="table-td-thumb"
                :src="scope.row.schoolIcon"
                :z-index="10"
                :preview-src-list="[scope.row.schoolIcon]"
                preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="入/出驻" align="center">
          <template #default="scope">
            <el-tag
                :type="scope.row.status === '0' ? 'success' : scope.row.status === '1' ? 'danger' : ''"
            >
              <p v-if="scope.row.status === '0'">已入驻</p>
              <p v-if="scope.row.status === '1'">已出驻</p>
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
              编辑
            </el-button>
            <el-button text :icon="Edit"  @click="handleDetail(scope.$index,scope.row)" v-permiss="16">
              详情
            </el-button>
            <el-button class="red" text :icon="Edit" @click="del(scope.$index, scope.row)" v-permiss="15">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.page"
            :page-size="query.size"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="40%">
      <el-form label-width="100px">
        <el-form-item label="学校名">
          <el-input v-model="form.schoolName" ></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.schoolAddress"></el-input>
        </el-form-item>
        <el-form-item label="学校图标">
          <el-upload
              class="avatar-uploader"
              ref="upload"
              :action="schoolIcon.url"
              :auto-upload="true"
              :limit="1"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-exceed="handleExceed"
              :show-file-list="true"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="出入驻">
          <el-radio-group v-model="form.status" class="ml-4">
            <el-radio label="0" size="large">入驻</el-radio>
            <el-radio label="1" size="large">出驻</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  genFileId,
  UploadInstance,
  UploadProps,
  UploadRawFile
} from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
// import { useRouter } from 'vue-router'
import {delSchool, listSchool, updateSchool} from "../../../api/schoolinfo";
import router from "../../../router";
import {school} from "../../../store/schoolinfo";


// const router = useRouter()
const schoolInfo = school()
interface TableItem {
  uuid: string;
  schoolName: string;
  schoolAddress: string;
  schoolIcon: string;
  status: string;
  createTime:Date;
}

const query = reactive({
  uuid: '',
  schoolName: '',
  status:'',
  page: 1,
  size: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  listSchool(query).then(response=>{
    tableData.value = response.data.data.schoolList
    pageTotal.value = response.data.data.totalData
  })
};
getData();

// 查询操作
const handleSearch = () => {
  query.page = 1;
  getData();
};
// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  getData();
};

// 查看详情操作
const handleDetail = (index: number, row: any) => {
   schoolInfo.setSchoolName(row.schoolName)
   schoolInfo.setUuid(row.uuid)
   schoolInfo.setCredit("超级管理员")
   schoolInfo.setStatus(row.status)
  var user = localStorage.getItem("ms_username");
   schoolInfo.setCreateMan(user)
   schoolInfo.setCreateTime(row.createTime)
   router.push({
      name:"SchoolDetail",
      params:{
        schoolName:row.schoolName,
        schoolAddress:row.schoolAddress,
        uuid:row.uuid,
        createTime:row.createTime,
        createMan:'超级管理员',
        credit:'超级管理员',
        status:row.status,
        schoolDesc:row.schoolIntroduction
      }
    })
}

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
  schoolCode:'',
  schoolName: '',
  schoolAddress: '',
  icon:'',
  status:''
});
let idx: number = -1;
//编辑
const handleEdit = (index: number, row: any) => {
  idx = index;
  form.schoolName = row.schoolName;
  form.schoolAddress = row.schoolAddress;
  form.schoolCode = row.uuid
  form.status = row.status
  editVisible.value = true;
};
//保存编辑
const saveEdit = () => {
  editVisible.value = false;
  ElMessage.success(`修改第 ${idx + 1} 行成功`);
  tableData.value[idx].schoolName = form.schoolName;
  tableData.value[idx].schoolAddress = form.schoolAddress;
  tableData.value[idx].status = form.status
  tableData.value[idx].schoolIcon = form.icon
  //发起修改请求
  updateSchool(form).then(response=>{
    if(response.data.code == "00000"){
      ElMessage({
        type:'success',
        message:'更新成功'
      })
    }
  })
};
//删除
const del = (index: number, row: any)=>{
  delSchool(row.uuid).then(response=>{
    if (response.data.code == "00000"){
      ElMessage({
        type:'success',
        message:'删除成功'
      })
    }
  })
}

//增加学院
const addSchool = ()=>{
  router.push("/SchoolCreate")
}
ElNotification({
  type:'success',
  title:'加载学校列表成功',
  message:'had loaded school list success'
})
//学校图片上传
const upload = ref<UploadInstance>()
const imageUrl = ref('')
const schoolIcon = reactive({
  url:'/api/super/uploadSchoolIcon'
})

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const submitUpload = () => {
  upload.value!.submit()
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  form.icon = response.data
  alert(form.icon)
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log(upload.value)
  imageUrl.value = URL.createObjectURL(rawFile!)
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be image format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
</script>

<style scoped>
.container{
  height: 90%;
}
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 200px;
}

.handle-input {
  width: 300px;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #F56C6C;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
/deep/ .el-table{
  width: 100%;
  font-size: 18px;
}
/deep/ .el-input__wrapper{
  height: 40px;
}
.search-button{
  height: 40px;
  width: 160px;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.el-form-item{
  --el-form-label-font-size: 18px;
}
</style>
