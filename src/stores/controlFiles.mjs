import { defineStore } from 'pinia'
import { ref } from 'vue'

class ControlFile {
  constructor(file){
    this.file = file
    this.last_used = new Date()
  }
}

export const useControlFiles = defineStore(
  'ControlFiles',
  {
    state: () => {
      const control_files_archive = ref([])
      const active_control_file = ref(null)
      return {
        control_files_archive,
        active_control_file
      }
    },
    getters: {
      last_control_files: (state) => state.control_files_archive.sort((a, b) => a.last_used - b.last_used)
    },
    actions: {
      selectControlFile(cf_path){
        let cfs = this.control_files_archive.filter(cf => cf.file === cf_path);
        let cf;
        if (cfs.length === 0){
          cf = new ControlFile(cf_path)
          this.control_files_archive.push(cf)
        } else {
          cf = cfs[0]
        }
        this.active_control_file = cf
      }
    }, persist: true }
)