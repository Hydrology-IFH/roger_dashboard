import { defineStore } from 'pinia'
import { ref } from 'vue'

class ControlFile {
  constructor({file, last_used=new Date()}){
    this.file = file
    this.last_used = last_used
  }

  get isValid(){
    window.file = this.file
    return this.file && this.file.length > 0
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
      },
      checkStore(){
        // convert to ControlFile instances if needed
        this.control_files_archive.forEach((cf, i) => {
          if (!(cf instanceof ControlFile)){
            this.control_files_archive[i] = new ControlFile(cf)
          }
        })
        if (this.active_control_file && !(this.active_control_file instanceof ControlFile)){
          this.active_control_file = new ControlFile(this.active_control_file)
        }

        // check for unvalid control files
        let unvalid_cfs = []
        this.control_files_archive.forEach((cf) => {
          if (! cf.isValid ){
            unvalid_cfs.push(cf)
          }
        })
        unvalid_cfs.forEach((cf) => {
          console.log("Removing unvalid control file", cf)
          this.control_files_archive.splice(this.control_files_archive.indexOf(cf), 1)
        })
      }
    },
    persist: {
      key: "ControlFilesArchive",
      afterRestore: (context) => context.store.checkStore()
    },
  }
)