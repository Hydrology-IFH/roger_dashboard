<script setup>
  import { ref } from 'vue'
  import { useControlFile } from '../stores/controlFile'

  const controlFile = useControlFile();
  const cf_vars = ref([
    "do_roger",
    "do_uhg_oa",
    "do_uhg_oa_za",
    "do_uhg_oa_verlust",
    "do_roger_dyn_oa",
    "do_roger_dyn_oa_za",
    "do_roger_dyn_oa_verlust",
    "measurement",
    "return_period",
    "duration",
    "pre_sm_perc",
    "n_perc",
    "extrem",
    "n_method",
    "date",
    "timestep_minutes",
    "model_interz",
    "mulde",
    "verschlaemt",
    "urban_drainage",
    "urban_drainage_loss",
    "urban_drainage_sealing",
    "roger_dyn_sinks",
    "river_from_lanu",
    "river_accumulation_value",
    "river_depth",
    "river_width",
    "river_baseflow",
    "rillen",
    "out_catchment",
    "out_roger_tau",
    "out_roger_t",
    "out_dyn",
    "out_uhg_oa_flow_times",
    "out_uhg_za_flow_times",
    "out_roger_dyn_tau",
    "out_roger_dyn_t",
    "out_roger_dyn_tau_con",
    "out_roger_dyn_t_con",
    "out_ro_dyn_tau",
    "out_ro_dyn_t",
    "out_ro_dyn_verlust_tau",
    "out_ro_dyn_verlust_t",
    "fact_n",
    "fact_sealing",
    "fact_soil_depth",
    "fact_eff_pores",
    "fact_mpl_v",
    "fact_nfk",
    "fact_trrt",
    "fact_nfk_free",
    "fact_drvl",
    "fact_kf",
    "fact_tp",
    "fact_slope"])
  const show_raw = ref(false)
</script>

<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-auto pe-3">
          <p>Those are the settings configured from the control file:</p>
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Parameter</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cf_var in cf_vars" :key="cf_var">
                <th scope="row">{{ cf_var }}</th>
                <td>{{ controlFile[cf_var] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-6 ps-3">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="showRasCFCheck" v-model="show_raw">
            <label class="form-check-label" for="showRasCFCheck">Show raw control file</label>
          </div>
          <div v-if="show_raw">
            <p>Those are the raw values from the control file that got read in:</p>
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">Parameter</th>
                  <th scope="col">Value</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in controlFile.cf_data" :key="row.name">
                  <th scope="row">{{ row.name }}</th>
                  <td>{{ row.value }}</td>
                  <td>{{ row.col3 }}</td>
                  <td>{{ row.col4}}</td>
                  <td>{{ row.col5 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  </div>
  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">this is the raw control file</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
table{
  width: 100%
}
</style>