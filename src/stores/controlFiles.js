  import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useControlFiles = defineStore(
  'ControlFiles',
  () => {
    const last_control_files = ref([])
    const active_control_file = ref(null)
    return {
      last_control_files,
      active_control_file
    }
  },
  { persist: true })