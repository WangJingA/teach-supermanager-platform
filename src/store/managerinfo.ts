import {defineStore} from "pinia";
import {ref} from "vue";

export const manager = defineStore('manager',()=>{
    const teachManager = ref<string>('')
    const teachManagerAccount = ref<string>("")
    const teachManagerIcon = ref<string>("")
    const teachManagerPassword = ref<string>("")
    const teachManagerPhone = ref<string>("")
    const teachManagerMail = ref<string>("")
    const teachManagerStatus = ref<number>()
    const setTeachManager = (data:string)=>{
        teachManager.value = data
    }
    const setTeachManagerAccount = (data:string)=>{
        teachManagerAccount.value = data
    }
    const setTeachManagerPassword = (data:string)=>{
        teachManagerPassword.value = data
    }
    const setTeachManagerIcon = (data:string)=>{
        teachManagerIcon.value = data
    }
    const setTeachManagerPhone = (data:string)=>{
        teachManagerPhone.value = data
    }
    const setTeachManagerMail = (data:string)=>{
        teachManagerMail.value = data
    }
    const setTeachManagerStatus = (data:number)=>{
        teachManagerStatus.value = data
    }
    return{
        teachManager,
        teachManagerAccount,
        teachManagerPassword,
        teachManagerMail,
        teachManagerIcon,
        teachManagerStatus,
        teachManagerPhone,
        setTeachManager,
        setTeachManagerAccount,
        setTeachManagerPassword,
        setTeachManagerMail,
        setTeachManagerPhone,
        setTeachManagerStatus,
    }
},
    {
        // @ts-ignore
        persist: {
            storage: sessionStorage
        }
    })