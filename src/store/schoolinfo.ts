import {defineStore} from "pinia";
import {reactive, ref} from "vue";

export const school = defineStore("school",()=>{
    const schoolName = ref<string>('')
    const uuid = ref<string>('')
    const status = ref<string>('')
    const createMan = ref<string>('')
    const createTime = ref<string>('')
    const credit = ref<string>('')
    const setSchoolName = (data:string)=>{
        schoolName.value = data;
    }
    const setUuid = (data:string)=>{
        uuid.value = data;
    }
    const setCreateMan = (data:any)=>{
        createMan.value = data;
    }
    const setCreateTime = (data:string)=>{
        createTime.value = data;
    }
    const setCredit = (data:string)=>{
        credit.value = data;
    }
    const setStatus = (data:string)=>{
        credit.value = data;
    }
    return{
        schoolName,
        uuid,
        createTime,
        credit,
        createMan,
        status,
        setSchoolName,
        setUuid,
        setCreateTime,
        setCredit,
        setCreateMan,
        setStatus
    }
},{
    // @ts-ignore
    persist: {
        storage: sessionStorage
    }
    })
