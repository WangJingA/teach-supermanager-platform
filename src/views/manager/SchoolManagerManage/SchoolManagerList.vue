<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.uuid" placeholder="管理员口令" class="handle-input mr10" ></el-input>
        <el-input v-model="query.managerName" placeholder="管理员名称" class="handle-input mr10" ></el-input>
        <el-select v-model="query.schoolUid" placeholder="学校" class="select-input" @change="listManagerSelect()">
          <el-option :key="sc.uuid" :label= "sc.schoolName" :value="sc.uuid" v-for=" sc in listSchool.schoolList" ></el-option>
        </el-select>
        <el-button type="primary" :icon="Search" @click="handleSearch" class="search-button">搜索</el-button>
        <el-button type="primary" :icon="Plus" class="search-button" @click="addSchoolManager">新增</el-button>
      </div>
      <!-- 管理员信息列表-->
      <el-table :data="tableData"  border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="schoolName" label="学校"></el-table-column>
        <el-table-column type="expand">
          <template #default="props">
            <div>
              <h3>Managers</h3>
              <el-table :data="props.row.managerList" :border="false">
                <el-table-column label="管理员口令" >
                  <template #default="prop">
                    <span @click="copy(prop.row.uuid)">{{prop.row.uuid}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="管理员" prop="teachManager" />
                <el-table-column label="账户" prop="teachManagerAccount" />
                <el-table-column label="密码" prop="teachManagerPassword" />
                <el-table-column label="邮箱" prop="teachManagerMail" />
                <el-table-column label="手机号" prop="teachManagerPhone" />
                <el-table-column label="状态" align="center">
                  <template #default="scope">
                    <el-tag
                        :type="scope.row.teachManagerStatus === 0 ? 'success' : scope.row.teachManagerStatus === 1 ? 'error' : ''"
                    >
                      <span v-if="scope.row.teachManagerStatus == 0">账户正常</span>
                      <span v-if="scope.row.teachManagerStatus == 1">账户禁止</span>
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间"></el-table-column>
                <el-table-column label="操作" width="220" align="center">
                  <template #default="scope">
                    <el-button text :icon="Edit" @click="handleEdit(props.$index,scope.$index, scope.row)" v-permiss="15">
                      编辑
                    </el-button>
                    <el-button text :icon="Edit" @click="showDetail(props.$index,scope.$index, scope.row)" v-permiss="15">
                      详情
                    </el-button>
                    <el-button text :icon="Edit" style="color: green" @click="upManager(props.$index,scope.$index, scope.row)" v-permiss="15" v-if="scope.row.teachManagerStatus==1">
                      启用
                    </el-button>
                    <el-button text :icon="Edit" class="red" @click="downManager(props.$index,scope.$index, scope.row)" v-permiss="15" v-if="scope.row.teachManagerStatus==0">
                      禁用
                    </el-button>
                    <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.pageIndex"
            :page-size="query.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
        <el-form-item label="管理员" prop="teachManager">
          <el-input v-model="form.teachManager"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="teachManagerPhone">
          <el-input v-model="form.teachManagerPhone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="teachManagerMail">
          <el-input v-model="form.teachManagerMail"></el-input>
        </el-form-item>
        <el-form-item label="所管理学校" prop="schoolUuid">
          <el-select v-model="form.schoolName" placeholder="请选择" class="select-input" disabled>
            <el-option :key="form.schoolUuid" :label= "form.schoolName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="teachManagerAccount">
          <div style="display: flex">
            <el-input v-model="form.teachManagerAccount" type="text" disabled></el-input>
            <el-tooltip
                class="box-item"
                effect="light"
                content="随机账号由系统分配，由admin后拼接数字组成"
                placement="top-start"
            >
              <el-icon class="tips"><Warning /></el-icon>
            </el-tooltip>
            <el-button type="primary" style="margin-left: 30px" @click="randomAccount">随机账号</el-button>
          </div>
        </el-form-item>
        <el-form-item label="密码" prop="teachManagerPassword">
          <div style="display: flex">
            <el-input v-model="form.teachManagerPassword" type="password"></el-input>
            <el-tooltip
                class="box-item"
                effect="light"
                content="密码由数字、英文字母、特殊符号、大写字母组成，长度不超过16"
                placement="top-start"
            >
              <el-icon class="tips"><Warning /></el-icon>
            </el-tooltip>
            <el-button type="primary" style="margin-left: 30px" @click="randomPassword">随机密码</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formRef)">表单提交</el-button>
          <el-button @click="onReset(formRef)">重置表单</el-button>
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
import {ref, reactive, onMounted} from 'vue';
import {ElMessage, ElMessageBox, ElNotification, FormInstance, FormRules, UploadProps} from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchData } from '../../../api';
import * as XLSX from "xlsx";
import router from "../../../router";
import {editManager, listManagerBySchoolUid, randomAcc, randomPass, schoolList} from "../../../api/schoolmanager";
import {manager} from "../../../store/managerinfo";

const managerInfo = manager()

const formRef = ref<FormInstance>();
interface managerItem {
  uuid:string,
  teachManager:string,
  teachManagerAccount:string,
  teachManagerIcon:string,
  teachManagerMail:string,
  teachManagerPassword:string,
  teachManagerPhone:string,
  teachManagerStatus:number,
  createTime:Date,
  updateTime:Date
}

interface TableItem {
  managerList: Array<managerItem>,
  schoolAddress: string,
  schoolIcon: string,
  schoolName: string,
  schoolIntroduction: string,
  updateTime: string,
  status: number,
  schoolDecode:string,
  schoolDegree:string,
  uuid:string
}
const rules: FormRules = {
  teachManager: [{ required: true, message: '请输入管理员名称', trigger: 'blur' }],
  teachManagerPhone: [{ required: true, message: '请输入管理员手机号', trigger: 'blur' }],
  teachManagerMail: [{ required: true, message: '请输入管理员邮箱', trigger: 'blur' }],
  schoolUuid: [{ required: true, message: '请选择学校', trigger: 'blur' }],
  teachManagerAccount: [{ required: true, message: '请选择随机账号', trigger: 'blur' }],
  teachManagerPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const listSchool = reactive({
  schoolList:[]
})
const query = reactive({
  uuid: '',
  managerName: '',
  schoolUid:'',
  pageIndex: 1,
  pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  listManagerBySchoolUid(query).then(respone=>{
    tableData.value = respone.data.data
    console.log(respone.data)
  })
};
getData();
//随机密码
const randomPassword = ()=>{
  randomPass().then(response=>{
    form.teachManagerPassword = response.data.data
  })
}
//复制
const copy = (uuid:string)=>{
  navigator.clipboard.writeText(uuid)
  ElMessage.success("复制成功")
}
//随机密码
const randomAccount = ()=>{
  randomAcc().then(response=>{
    form.teachManagerAccount = response.data.data
  })
}
// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      editManager(form).then(response=>{
        if (response.data.code === '00000'){
            tableData.value[idx].managerList[managerIndex].teachManager = form.teachManager
            tableData.value[idx].managerList[managerIndex].teachManagerPassword = form.teachManagerPassword
            tableData.value[idx].managerList[managerIndex].teachManagerMail = form.teachManagerMail
            tableData.value[idx].managerList[managerIndex].teachManagerPhone = form.teachManagerPhone
            tableData.value[idx].managerList[managerIndex].teachManagerAccount = form.teachManagerAccount
            editVisible.value = false
            ElMessage.success({
              message:'修改成功',
              type:'success'
            })
        }
      })
    } else {
      return false;
    }
  });
};
// 重置
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
// 查询操作
const handleSearch = () => {
  query.pageIndex = 1;
  getData();
};
// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  getData();
};

// 删除操作
const handleDelete = (index: number) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        ElMessage.success('删除成功');
        tableData.value.splice(index, 1);
      })
      .catch(() => {});
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
const form = reactive({
  teachManager:'',
  teachManagerPhone:'',
  teachManagerMail:'',
  schoolName:'',
  schoolUuid:'',
  teachManagerAccount:'',
  teachManagerPassword:'',
  uuid:'',
  teachManagerStatus:''
});
let idx: number = -1;
let managerIndex = -1;
const handleEdit = (school:number,index: number, row: any) => {
  idx = school;
  managerIndex = index;
  form.uuid = row.uuid
  form.teachManager = row.teachManager
  form.teachManagerAccount = row.teachManagerAccount
  form.teachManagerPassword = row.teachManagerPassword
  form.teachManagerMail = row.teachManagerMail
  form.teachManagerPhone = row.teachManagerPhone
  form.schoolUuid = tableData.value[idx].uuid
  form.schoolName = tableData.value[idx].schoolName
  editVisible.value = true;
};
const upManager = (school:number,index: number, row: any) => {
  idx = school;
  managerIndex = index;
  form.uuid = row.uuid
  form.teachManager = row.teachManager
  form.teachManagerAccount = row.teachManagerAccount
  form.teachManagerPassword = row.teachManagerPassword
  form.teachManagerMail = row.teachManagerMail
  form.teachManagerPhone = row.teachManagerPhone
  form.schoolUuid = tableData.value[idx].uuid
  form.schoolName = tableData.value[idx].schoolName
  form.teachManagerStatus = '0';
  editManager(form).then(response=>{
    if (response.data.code === '00000'){
      tableData.value[idx].managerList[managerIndex].teachManagerStatus = parseInt(form.teachManagerStatus)
      ElMessage.success({
        message:'启用成功',
        type:'success'
      })
    }
  })
}
const downManager = (school:number,index: number, row: any) => {
  idx = school;
  managerIndex = index;
  form.uuid = row.uuid
  form.teachManager = row.teachManager
  form.teachManagerAccount = row.teachManagerAccount
  form.teachManagerPassword = row.teachManagerPassword
  form.teachManagerMail = row.teachManagerMail
  form.teachManagerPhone = row.teachManagerPhone
  form.schoolUuid = tableData.value[idx].uuid
  form.schoolName = tableData.value[idx].schoolName
  form.teachManagerStatus = '1';
  editManager(form).then(response=>{
    if (response.data.code === '00000'){
      tableData.value[idx].managerList[managerIndex].teachManagerStatus = parseInt(form.teachManagerStatus)
      ElMessage.success({
        message:'已禁止',
        type:'success'
      })
    }
  })
}
const saveEdit = () => {
  editVisible.value = false;
  ElMessage.success(`修改第 ${idx + 1} 行成功`);
  // tableData.value[idx].name = form.name;
  // tableData.value[idx].address = form.address;
};
//批量导入--start
const importList = ref<any>([]);
const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
  importList.value = await analysisExcel(rawFile);
  return true;
};
const analysisExcel = (file: any) => {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      const data = e.target.result;
      let datajson = XLSX.read(data, {
        type: 'binary',
      });

      const sheetName = datajson.SheetNames[0];
      const result = XLSX.utils.sheet_to_json(datajson.Sheets[sheetName]);
      resolve(result);
    };
    reader.readAsBinaryString(file);
  });
};

const handleMany = async () => {
  // 把数据传给服务器后获取最新列表，这里只是示例，不做请求
  const list = importList.value.map((item: any, index: number) => {
    return {
      id: index,
      name: item['姓名'],
      sno: item['学号'],
      class: item['班级'],
      age: item['年龄'],
      sex: item['性别'],
    };
  });
  tableData.value.push(...list);
};
//批量导入--end
//学生详情
const showDetail = (schoolIndex:number,index:number,row:any)=>{
  router.push({
    name:"SchoolManagerDetail",
    params:{
      teachManager:row.teachManager,
      teachManagerAccount:row.teachManagerAccount,
      teachManagerMail:row.teachManagerMail,
      teachManagerPassword:row.teachManagerPassword,
      createMan:'超级管理员',
      credit:'超级管理员',
      teachManagerStatus:row.teachManagerStatus,
      teachManagerPhone:row.teachManagerPhone,
      uuid:row.uuid,
      teachManagerSchool:tableData.value[schoolIndex].schoolName
    }
  })
}
//导出--start
const list = [['序号', '姓名', '学号', '班级', '年龄', '性别']];
const exportXlsx = () => {
  tableData.value.map((item: any, i: number) => {
    const arr: any[] = [i + 1];
    arr.push(...[item.name, item.sno, item.class, item.age, item.sex]);
    list.push(arr);
  });
  let WorkSheet = XLSX.utils.aoa_to_sheet(list);
  let new_workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '第一页');
  XLSX.writeFile(new_workbook, `表格.xlsx`);
};
//导出--end
const addSchoolManager = ()=>{
  router.push("/SchoolManagerCreate")
}
//下拉列表获取管理员列表
const listManagerSelect = ()=>{
  getData()
}
onMounted(()=>{
  getData()
  schoolList().then(reponse=>{
    if (reponse.data.code == "00000"){
      listSchool.schoolList = reponse.data.data
      //提示
      ElNotification({
        type:'success',
        title:'加载学校管理员列表成功',
        message:'had loaded school list successfully'
      })
    }
  })
})
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
  display: flex;
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
  width: 300px;
}
.search-button{
  height: 40px;
  width: 160px;
}

</style>
