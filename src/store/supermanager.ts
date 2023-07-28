import { defineStore } from 'pinia'
import { ref } from 'vue'


export const supermanager = defineStore('superManagerInfo', () => {
  const token = ref<string>('')
  const role = ref<string>('')
  const setToken = (data:string) => {
    token.value = data
  }
  const setRole = (data:string) => {
    role.value = data
  }
  return {
    token,
    role,
    setToken,
    setRole
  }
} ,{
  // @ts-ignore
  persist: {
    storage: sessionStorage
  }
})
