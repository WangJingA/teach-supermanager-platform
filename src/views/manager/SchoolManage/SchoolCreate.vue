<template>
  <div class="container">
    <div class="form-box">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
        <el-form-item label="学校" prop="schoolName">
          <el-input v-model="form.schoolName"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="schoolAddress">
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
        <el-form-item label="学校描述" prop="schoolDesc">
          <el-input type="textarea" rows="5" v-model="form.schoolDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formRef)">表单提交</el-button>
          <el-button @click="onReset(formRef)">重置表单</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" >
import {onMounted, reactive, ref} from 'vue';
import {
  ElMessage,
  ElNotification,
  FormInstance,
  FormRules,
  genFileId,
  UploadInstance,
  UploadRawFile
} from 'element-plus';
import type { UploadProps } from 'element-plus'
import {addSchool} from "../../../api/schoolinfo";

const upload = ref<UploadInstance>()
const imageUrl = ref('')
const schoolIcon = reactive({
  url:'/api/passUse/uploadIcon'
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
//表单校验
const rules: FormRules = {
  schoolName: [{ required: true, message: '请输入学校名', trigger: 'blur' }],
  schoolAddress: [{ required: true, message: '请输入学校地址', trigger: 'blur' }],
  icon: [{ required: true, message: '请选取学校图标', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const form = reactive({
  schoolName:'',
  schoolAddress:'',
  schoolDesc:'',
  icon:''
});

// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log(form);
      addSchool(form).then(response=>{
        if (response.data.code == "00000"){
          ElMessage.success('新增学校信息成功！');
        }
        if(response.data.code == "500"){
          ElMessage.success('您的操作太快了,请稍后重试！');
        }
          console.log(response.data.data)
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
    title:'请开始学校创建',
    message:'please start create school',
    type:'success'
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
</style>
