import { defineStore } from 'pinia'
import { parse as csvparse } from 'csv-parse/browser/esm/sync';

import { useSettings } from './settings'

export const useControlFile = () => {
  const innerStore = defineStore({
    id: 'controlFile',
    state: () => {
      return {
      cf_data: [],
      do_roger: false,
      do_uhg_oa: false,
      do_uhg_oa_za: false,
      do_uhg_oa_verlust: false,
      do_roger_dyn_oa: false,
      do_roger_dyn_oa_za: false,
      do_roger_dyn_oa_verlust: false,
      measurement: false,
      return_period: 0,
      duration: 0,
      pre_sm_perc: 0,
      n_perc: 0,
      extrem: false,
      n_method: false,
      date: 0,
      timestep_minutes: 0,
      model_interz: false,
      mulde: false,
      verschlaemt: false,
      urban_drainage: false,
      urban_drainage_loss: 0,
      urban_drainage_sealing: 0,
      roger_dyn_sinks: false,
      river_from_lanu: false,
      river_accumulation_value: 0,
      river_depth: 0,
      river_width: false,
      river_baseflow: 0,
      rillen: false,
      out_catchment: false,
      out_roger_tau: false,
      out_roger_t: false,
      out_dyn: false,
      out_uhg_oa_flow_times: false,
      out_uhg_za_flow_times: false,
      out_roger_dyn_tau: false,
      out_roger_dyn_t: false,
      out_roger_dyn_tau_con: false,
      out_roger_dyn_t_con: false,
      out_ro_dyn_tau: false,
      out_ro_dyn_t: false,
      out_ro_dyn_verlust_tau: false,
      out_ro_dyn_verlust_t: false,
      fact_n: 1,
      fact_sealing: 1,
      fact_soil_depth: 1,
      fact_eff_pores: 1,
      fact_mpl_v: 1,
      fact_nfk: 1,
      fact_trrt: 1,
      fact_nfk_free: 1,
      fact_drvl: 1,
      fact_kf: 1,
      fact_tp: 1,
      fact_slope: 1}
    },
    actions: {
      getControlFile() {
        const settings = useSettings()
        fetch(settings.roger_control_file)
        .then(response => response.text())
        .catch(err => console.error(err))
        .then(text => {
          this.cf_data = csvparse(
            text,
            {
              delimiter: ";",
              columns: ["name", "value", "col3", "col4", "col5"],
            }).slice(1)

          // extract settings from the control file
          ///////////////////////////////////////////
          // selected models
          this.do_roger = /true/.test(this.cf_data[3].value.toLowerCase())
          this.do_uhg_oa = /true/.test(this.cf_data[4].value.toLowerCase())
          this.do_uhg_oa_za = /true/.test(this.cf_data[5].value.toLowerCase())
          this.do_uhg_oa_verlust = /true/.test(this.cf_data[6].value.toLowerCase())
          this.do_roger_dyn_oa = /true/.test(this.cf_data[7].value.toLowerCase())
          this.do_roger_dyn_oa_za = /true/.test(this.cf_data[8].value.toLowerCase())
          this.do_roger_dyn_oa_verlust = /true/.test(this.cf_data[9].value.toLowerCase())

          // event settings
          this.measurement = /true/.test(this.cf_data[14].value.toLowerCase())
          this.return_period = parseInt(this.cf_data[15].value)
          this.duration = parseInt(this.cf_data[16].value)
          this.pre_sm_perc = parseInt(this.cf_data[17].value)
          this.n_perc = parseInt(this.cf_data[18].value)
          this.extrem = /true/.test(this.cf_data[19].value.toLowerCase())
          this.n_method = /true/.test(this.cf_data[20].value.toLowerCase())
          this.date = Date.parse(this.cf_data[22].value)
          this.timestep_minutes = parseInt(this.cf_data[23].value)

          // catchment settings
          this.model_interz = /true/.test(this.cf_data[28].value.toLowerCase())
          this.mulde = /true/.test(this.cf_data[29].value.toLowerCase())
          this.verschlaemt = /true/.test(this.cf_data[30].value.toLowerCase())
          this.urban_drainage = /true/.test(this.cf_data[31].value.toLowerCase())
          this.urban_drainage_loss = parseInt(this.cf_data[32].value)
          this.urban_drainage_sealing = parseInt(this.cf_data[33].value)

          // catchment and river modifications
          this.roger_dyn_sinks = /true/.test(this.cf_data[36].value.toLowerCase())
          this.river_from_lanu = /true/.test(this.cf_data[37].value.toLowerCase())
          this.river_accumulation_value = parseInt(this.cf_data[38].value)
          this.river_depth = parseInt(this.cf_data[39].value)
          this.river_width = /true/.test(this.cf_data[40].value)? true: this.cf_data[40].value
          this.river_baseflow = parseInt(this.cf_data[41].value) ? parseInt(this.cf_data[41].value) : this.cf_data[41].value
          this.rillen = /true/.test(this.cf_data[42].value.toLowerCase())

          // outputs
          this.out_catchment = /true/.test(this.cf_data[61].value.toLowerCase())
          this.out_roger_tau = /true/.test(this.cf_data[62].value.toLowerCase())
          this.out_roger_t = /true/.test(this.cf_data[63].value.toLowerCase())
          this.out_dyn = /true/.test(this.cf_data[64].value.toLowerCase())
          this.out_uhg_oa_flow_times = /true/.test(this.cf_data[65].value.toLowerCase())
          this.out_uhg_za_flow_times = /true/.test(this.cf_data[66].value.toLowerCase())
          this.out_roger_dyn_tau = /true/.test(this.cf_data[67].value.toLowerCase())
          this.out_roger_dyn_t = /true/.test(this.cf_data[68].value.toLowerCase())
          this.out_roger_dyn_tau_con = /true/.test(this.cf_data[69].value.toLowerCase())
          this.out_roger_dyn_t_con = /true/.test(this.cf_data[70].value.toLowerCase())
          this.out_ro_dyn_tau = /true/.test(this.cf_data[71].value.toLowerCase())
          this.out_ro_dyn_t = /true/.test(this.cf_data[72].value.toLowerCase())
          this.out_ro_dyn_verlust_tau = /true/.test(this.cf_data[73].value.toLowerCase())
          this.out_ro_dyn_verlust_t = /true/.test(this.cf_data[74].value.toLowerCase())

          // unit factors
          this.fact_n = parseInt(this.cf_data[77].value) // mm
          this.fact_sealing = parseInt(this.cf_data[78].value) // %
          this.fact_soil_depth = parseInt(this.cf_data[79].value) // cm
          this.fact_eff_pores = parseInt(this.cf_data[80].value) // mm
          this.fact_mpl_v = parseInt(this.cf_data[81].value) // cm
          this.fact_nfk = parseInt(this.cf_data[82].value) // mm
          this.fact_trrt = parseInt(this.cf_data[83].value) // cm
          this.fact_nfk_free = parseInt(this.cf_data[84].value) // mm
          this.fact_drvl = parseInt(this.cf_data[85].value) // mm
          this.fact_kf = parseInt(this.cf_data[86].value) // mm/h
          this.fact_tp = parseInt(this.cf_data[87].value) // mm/h
          this.fact_slope = parseInt(this.cf_data[88].value) // %
        })
        .catch(err => console.error(err))
      }
    }
  })

  const s = innerStore();
  console.log(s.cf_data)
  if (s.cf_data.length == 0) {
    console.log("get control file")
    s.getControlFile();
  }
  return s;
}


