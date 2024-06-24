import { parse as csvparse } from 'csv-parse/browser/esm/sync';

import { useSettings } from '~/stores/settings'
import { useControlFile } from '~/stores/controlFile'

export class HydrographVariant {
  constructor({ name, file, rounding_columns, extract_csv_data, plot_data, layout }) {
    /**
     * @param {string} name - name of the variant
     * @param {string} file - file path relative to the output folder
     * @param {string[]} rounding_columns - columns that should be rounded
     * @param {function} extract_csv_data - function to parse the csv data or select relevant columns
     * @param {function} plot_data - function to create the plotly data object
     */
    this.name = name
    this.file = file
    this.rounding_columns = rounding_columns ?? []
    this.layout = layout

    // callbacks for data processing
    this._extract_csv_data = extract_csv_data
    this._plot_data = plot_data
  }

  init() {
    this.settingsStore = useSettings()
    this.controlFileStore = useControlFile()
    return this
  }

  get exists() {
    return this.controlFileStore.output_files.includes(this.file)
  }

  get filepath(){
    return window.nodePath.join(this.controlFileStore.output_folder, this.file)
  }

  async get_csv_data() {
    if (this.exists) {
      return await window.electron.ipcRenderer.invoke("get-file-text", this.filepath)
        .then(text => {
          // parse the csv data
          let csv_data_raw = csvparse(text, { delimiter: ";", columns: true, trim: true})

          // convert the csv data to an object with arrays
          var csv_data = {}
          Object.getOwnPropertyNames((csv_data_raw[0])).forEach((colName) => {
            csv_data[colName] = csv_data_raw.map((row) => row[colName])
          })

          // extract the relevant columns
          let data = this._extract_csv_data(csv_data)

          // round the columns
          let dec = this.settingsStore.timeseries_decimals
          this.rounding_columns.forEach((col) => {
            if ( col in data){
              data[col] = data[col].map((el) => Math.round(parseFloat(el)*10**dec)/10**dec)
            }
          })
          return data
        })
        .catch(err => console.error(err))
    } else {
      return null
    }
  }

  async get_plot_data() {
    let csv_data = await this.get_csv_data()
    if (csv_data) {
      return await this._plot_data(csv_data)
    } else {
      return null
    }
  }
}