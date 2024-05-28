import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSettings = defineStore(
  'settings',
  () => {
    // filepaths
    ///////////////////////////////////
    const roger_root_out_folder = ref("/test-results")

    const roger_out_folder_part = ref("RoGeR_/Ergebnisse")
    const roger_out_folder = computed(
      () => roger_root_out_folder.value + "/" + roger_out_folder_part.value)

    // OA timeseries file
    const roger_oa_ts_file_part = ref("OA_zeitlich.csv")
    const roger_oa_ts_file = computed(
      () => roger_out_folder.value + "/" + roger_oa_ts_file_part.value)

    // OA tiff file
    const roger_oa_tiff_file_part = ref("Gesamtevent/OA_Ges_Total.tif")
    const roger_oa_tiff_file = computed(
      () => roger_out_folder.value + "/" + roger_oa_tiff_file_part.value)

    // control file
    const roger_control_file_part = ref("control_file.csv")
    const roger_control_file = computed(
      () => roger_root_out_folder.value + "/" + roger_control_file_part.value)

    // other stuff
    /////////////////////////////////////
    const timeseries_decimals = ref(3)
    const crs_epsg = ref(25832)

    const map_default_basemap = ref("basemap_color")
    const map_default_colorscale = ref("inferno")
    const map_default_opacity = ref(100)
    const map_default_hover_decimals = ref(3)

    return {
      roger_root_out_folder,
      roger_out_folder_part,
      roger_out_folder,
      roger_oa_ts_file_part,
      roger_oa_ts_file,
      roger_oa_tiff_file_part,
      roger_oa_tiff_file,
      roger_control_file_part,
      roger_control_file,
      timeseries_decimals,
      map_default_basemap,
      crs_epsg,
      map_default_colorscale,
      map_default_opacity,
      map_default_hover_decimals
    }
  },
  { persist: true }
)