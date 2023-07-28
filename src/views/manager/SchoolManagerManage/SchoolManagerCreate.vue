<template>
  <div class="container">
    <div class="form-box">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
        <el-form-item label="管理员名称" prop="teachManager">
          <el-input v-model="form.teachManager"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="teachManagerPhone">
          <el-input v-model="form.teachManagerPhone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="teachManagerMail">
          <el-input v-model="form.teachManagerMail"></el-input>
        </el-form-item>
        <el-form-item label="所管理学校" prop="schoolUuid">
          <el-select v-model="form.schoolUuid" placeholder="请选择" class="select-input">
            <el-option :key="sc.uuid" :label= "sc.schoolName" :value="sc.uuid" v-for=" sc in school.schoolList" ></el-option>
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
    </div>
  </div>
</template>

<script setup lang="ts" name="baseform">
import {onMounted, reactive, ref} from 'vue';
import {ElMessage, ElNotification, FormInstance, FormRules} from 'element-plus';
import type { UploadProps } from 'element-plus'
import {createManager, randomAcc, randomPass, schoolList} from "../../../api/schoolmanager";

const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // if (rawFile.type !== 'image/jpeg') {
  //   ElMessage.error('Avatar picture must be image format!')
  //   return false
  // } else if (rawFile.size / 1024 / 1024 > 2) {
  //   ElMessage.error('Avatar picture size can not exceed 2MB!')
  //   return false
  // }
  return true
}
const rules: FormRules = {
  teachManager: [{ required: true, message: '请输入管理员名称', trigger: 'blur' }],
  teachManagerPhone: [{ required: true, message: '请输入管理员手机号', trigger: 'blur' }],
  teachManagerMail: [{ required: true, message: '请输入管理员邮箱', trigger: 'blur' }],
  schoolUuid: [{ required: true, message: '请选择学校', trigger: 'blur' }],
  teachManagerAccount: [{ required: true, message: '请选择随机账号', trigger: 'blur' }],
  teachManagerPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const form = reactive({
  teachManager:'',
  teachManagerPhone:'',
  teachManagerMail:'',
  schoolUuid:'',
  teachManagerAccount:'',
  teachManagerPassword:'',
});
//学校下拉列表
const school = reactive({
  schoolList:[]
})
//随机密码
const randomPassword = ()=>{
  randomPass().then(response=>{
    form.teachManagerPassword = response.data.data
  })
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
      createManager(form).then(response=>{
        if (response.data.code == '200'){
          ElMessage({
            type:"success",
            message:"创建学校管理员成功"
          })
        }else{
          ElMessage({
            type:"error",
            message:"系统异常"
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

onMounted(()=>{
  ElNotification({
    title:'开始为学校添加管理员',
    message:'start to add manager for school  ',
    type:'success'
  })
  schoolList().then(reponse=>{
    if (reponse.data.code == "00000"){
      school.schoolList = reponse.data.data
    }
  })
})
</script>
<style scoped>
.upload-demo{
  width: 600px;
}
.select-input{
  width: 600px;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
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
.tips{
  width: 60px;
  height: 30px;
  align-content: center;
  --color: red;
}
.el-icon svg {
  height: 2em;
  width: 2em;
}
</style>
