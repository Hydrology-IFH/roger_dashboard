import { defineStore } from 'pinia'
import { ref } from 'vue'

class ControlFile {
  constructor(file, last_used = new Date()) {
    this.file = file;
    this.last_used = last_used;
  }

  get isValid(){
    return this.file && this.file.length > 0
  }
  // functions to serialize the object
  toJSON(){
    return {
      file: this.file,
      last_used: this.last_used
    }
  }

  static fromJSON(json){
    let data = json instanceof String ? JSON.parse(json) : json;
    return new ControlFile(data.file, new Date(data.last_used))
  }
}

export const useControlFiles = defineStore(
  'ControlFiles',
  {
    state: () => {
      const archive = ref([])
      const active = ref(null)
      return {
        archive,
        active
      }
    },
    getters: {
      archive_ordered: (state) => state.archive.sort((a, b) => a.last_used - b.last_used)
    },
    actions: {
      selectControlFile(cf_path){
        let cfs = this.archive.filter(cf => cf.file === cf_path);
        let cf;
        if (cfs.length === 0){
          cf = new ControlFile(cf_path)
          this.archive.push(cf)
        } else {
          cf = cfs[0]
          cf.last_used = new Date()
        }
        this.active = cf
      },
      checkStore(){
        // check for unvalid control files
        let unvalid_cfs = []
        this.archive.forEach((cf) => {
          if (! cf.isValid ){
            unvalid_cfs.push(cf)
          }
        })
        unvalid_cfs.forEach((cf) => {
          console.log("Removing unvalid control file", cf)
          this.archive.splice(this.archive.indexOf(cf), 1)
        })
        if (this.active && !this.active.isValid){
          console.log("Removing unvalid active control file", this.active)
          this.active = null
        }
      },
      removeControlFile(cf_path){
        if (this.active.file === cf_path){
          this.active = null
        }
        this.archive.splice(this.archive.findIndex(cf => cf.file === cf_path), 1)
      }
    },
    persist: {
      key: "ControlFilesArchive",
      afterRestore: (context) => context.store.checkStore(),
      serializer: {
        serialize: (value) => {
          return {
            archive: value.archive.map(cf => cf.toJSON()),
            active: value.active ? value.active.toJSON() : null
          }
        },
        deserialize: (value) => {
          // let data = JSON.parse(value)
          let data = value;
          data.archive = data.archive.map(cf => ControlFile.fromJSON(cf))
          data.active = data.active ? ControlFile.fromJSON(data.active) : null
          return data
        }
      }
    },
  }
)