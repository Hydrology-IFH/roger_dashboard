import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSettings = defineStore(
  'settings',
  () => {
    // filepaths
    ///////////////////////////////////
    const roger_root_out_folder = ref("/test-results")

    const roger_out_folder_part = ref("RoGeR_/Ergebnisse")
    const roger_out_folder = computed(() => {
      return roger_root_out_folder.value + "/" + roger_out_folder_part.value
    })

    // OA timeseries file
    const roger_oa_ts_file_part = ref("OA_zeitlich.csv")
    const roger_oa_ts_file = computed(
      () => roger_out_folder.value + "/" + roger_oa_ts_file_part.value)

    // OA tiff file
    const roger_oa_tiff_file_part = ref("Gesamtevent/OA_Ges_Total.tif")
    const roger_oa_tiff_file = computed(
      () => roger_out_folder.value + "/" + roger_oa_tiff_file_part.value)

    // other stuff
    const decimals = ref(3)
    const basemap = ref("basemap_color")
    const crs_epsg = ref(25832)
    const colorscale = ref("inferno")

    return {
      roger_root_out_folder,
      roger_out_folder_part,
      roger_out_folder,
      roger_oa_ts_file_part,
      roger_oa_ts_file,
      roger_oa_tiff_file_part,
      roger_oa_tiff_file,
      decimals,
      basemap,
      crs_epsg,
      colorscale,
    }
  },
  { persist: true }
)
