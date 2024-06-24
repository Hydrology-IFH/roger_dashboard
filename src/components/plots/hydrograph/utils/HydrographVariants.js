import { HydrographVariant } from './HydrographVariant.js'

const HydrographVariants = [
  {
    name: "RoGeR - OA Zeitlich",
    file: "RoGeR_\\Ergebnisse\\OA_zeitlich.csv",
    rounding_columns: ["N", "OA"],
    extract_csv_data(csv_data) {
      return {
          N: csv_data["N(mm)"],
          OA: csv_data["OA(mm)"],
          timestep: Array.from(csv_data["N(mm)"], (v,i)=>i+1)
        }
    },
    plot_data(data) {
      return [{
        x: data.timestep,
        y: data.N,
        yaxis: 'y2',
        type: 'bar',
        mode: 'lines+points',
        marker: { color: 'blue' },
        opacity: 0.5,
        name: 'N'
      },
      {
        x: data.timestep,
        y: data.OA,
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'red' },
        name: 'OA'
      }]
    },
    layout: {
      xaxis: {
        title: 'timestep [-]',
        domain: [0.3, 1],
      },
      yaxis: {
        title: 'OA in mm',
      },
      yaxis2: {
        title: "N in mm",
        side: 'left',
        position: 0.15,
        overlaying: 'y',
        minallowed: 0,
        titlefont: {color: 'blue'},
        tickfont: {color: 'blue'},
        autorange: "reversed",
        showgrid: false
      },
      margin: {
        l: 5,
        r: 5,
        t: 70,
        b: 70
      }
    }
  },
  {
    name: "UHG - OA MP Pegel",
    file: "UHG_\\_UHG_OA_MP_pegel.csv",
    rounding_columns: ["OA", "MP"],
    extract_csv_data(csv_data) {
      return {
          timestep: Array.from(csv_data["# UHG_OA_Zeitschritt_Min"], (v,i)=>i+1),
          OA: csv_data["# UHG_OA_Zeitschritt_Min"],
          MP: csv_data["UHG_MP_Zeitschritt_Min"],
        }
    },
    plot_data(data) {
      return [{
        x: data.timestep,
        y: data.OA,
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'red' },
        name: 'OA'
      },
      {
        x: data.timestep,
        y: data.MP,
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'green' },
        name: 'MP'
      }]
    },
    layout: {
      xaxis: {
        title: 'timestep [-]'
      },
      yaxis: {
        title: 'mm'
      }
    }
  },
  {
    name: "UHG - OA Pegel",
    file: "UHG_\\_UHG_OA_pegel.csv",
    rounding_colulmns: ["OA"],
    extract_csv_data(csv_data) {
      return {
          timestep: Array.from(csv_data["# UHG_OA_Zeitschritt_Min"], (v,i)=>i+1),
          OA: csv_data["# UHG_OA_Zeitschritt_Min"],
        }
    },
    plot_data(data) {
      return [{
        x: data.timestep,
        y: data.OA,
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'red' },
        name: 'OA'
      }]
    },
    layout: {
      xaxis: {
        title: 'timestep [-]'
      },
      yaxis: {
        title: 'mm'
      }
    }
  },
  {
    name: "RoGeR_dyn - OA",
    file: "RoGeR_dyn_OA_\\Ergebnisse\\hydrograph.csv",
    rounding_columns: ["N", "OA", "Q_Pegel", "V_Senken", "timestep"],
    extract_csv_data(csv_data) {
      return {
          N: csv_data["N (mm)"],
          OA: csv_data["OA [mm]"],
          Q_Pegel: csv_data["Q Pegel (l/s)"],
          V_Senken: csv_data["Volumina in Senken (cbm)"],
          timestep: csv_data["Zeit (min)"]
        }
      },
    plot_data(data) {
      return [{
        x: data.timestep,
        y: data.N,
        yaxis: 'y2',
        type: 'bar',
        mode: 'lines',
        marker: { color: 'blue' },
        name: 'N',
        opacity: 0.5,
      },
      {
        x: data.timestep,
        y: data.OA,
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'red' },
        name: 'OA'
      },
      {
        x: data.timestep,
        y: data.Q_Pegel,
        yaxis: 'y3',
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'green' },
        name: 'Q_Pegel'
      },
      {
        x: data.timestep,
        y: data.V_Senken,
        yaxis: 'y4',
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'orange' },
        name: 'V_Senken'
      }]
    },
    layout: {
      xaxis: {
        title: 'Minutes',
        domain: [0.3, 0.7],
      },
      yaxis: {
        title: 'Oa in mm',
        minallowed: 0,
        titlefont: {color: 'red'},
        tickfont: {color: 'red'},
      },
      yaxis2: {
        title: "N in mm",
        side: 'left',
        position: 0.15,
        overlaying: 'y',
        minallowed: 0,
        titlefont: {color: 'blue'},
        tickfont: {color: 'blue'},
        autorange: "reversed",
        showgrid: false
      },
      yaxis3: {
        title: 'Q in l/s',
        side: 'right',
        overlaying: 'y',
        titlefont: {color: 'green'},
        tickfont: {color: 'green'},
        minallowed: 0,
        showgrid: false
      },
      yaxis4: {
        title: 'V in m³',
        side: 'right',
        position: 0.85,
        overlaying: 'y',
        titlefont: {color: 'orange'},
        tickfont: {color: 'orange'},
        minallowed: 0,
        showgrid: false
      },
      margin: {
        l: 5,
        r: 5,
        t: 70,
        b: 70
      }
    }
  },
  {
    name: "RoGeR_dyn - OA & ZA",
    file: "RoGeR_dyn_OA_ZA_\\Ergebnisse\\hydrograph.csv",
    rounding_columns: ["N", "OA", "Q_Pegel", "V_Senken", "timestep"],
    extract_csv_data(csv_data) {
      return {
          N: csv_data["N (mm)"],
          OA: csv_data["OA [mm]"],
          Q_Pegel: csv_data["Q Pegel (l/s)"],
          V_Senken: csv_data["Volumina in Senken (cbm)"],
          timestep: csv_data["Zeit (min)"]
        }
      },
    plot_data(data) {
      return [{
        x: data.timestep,
        y: data.N,
        yaxis: 'y2',
        type: 'bar',
        mode: 'lines',
        marker: { color: 'blue' },
        name: 'N',
        zorder: 0,
        opacity: 0.5,
      },
      {
        x: data.timestep,
        y: data.OA,
        type: 'scatter',
        mode: 'lines',
        zorder: 10,
        marker: { color: 'red' },
        name: 'OA+ZA'
      },
      {
        x: data.timestep,
        y: data.Q_Pegel,
        yaxis: 'y3',
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'green' },
        name: 'Q_Pegel'
      },
      {
        x: data.timestep,
        y: data.V_Senken,
        yaxis: 'y4',
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'orange' },
        name: 'V_Senken'
      }]
    },
    layout: {
      xaxis: {
        title: 'Minutes',
        domain: [0.3, 0.7],
      },
      yaxis: {
        title: "OA+ZA in mm",
        side: 'left',
        titlefont: {color: 'red'},
        tickfont: {color: 'red'},
        minallowed: 0,
        showgrid: false,
      },
      yaxis2: {
        title: 'N in mm',
        minallowed: 0,
        position: 0.15,
        titlefont: {color: 'blue'},
        tickfont: {color: 'blue'},
        autorange:"reversed",
        overlaying: 'y',
        scaleanchor: 'y'
      },
      yaxis3: {
        title: 'Q in l/s',
        side: 'right',
        overlaying: 'y',
        titlefont: {color: 'green'},
        tickfont: {color: 'green'},
        minallowed: 0,
        showgrid: false
      },
      yaxis4: {
        title: 'V in m³',
        side: 'right',
        position: 0.85,
        overlaying: 'y',
        titlefont: {color: 'orange'},
        tickfont: {color: 'orange'},
        minallowed: 0,
        showgrid: false
      },
      margin: {
        l: 5,
        r: 5,
        t: 70,
        b: 70
      }
    }
  }
]

export function getHydrographVariants() {
  return HydrographVariants.map(conf => new HydrographVariant(conf).init())
}