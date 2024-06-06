// import { gridFormPara } from './forms.mjs';
import colormap from 'colormap';

// helper functions for colorbars
const get_colorscale = function (min, max, colorbar, continous=true, reverse=false) {
  let values = Array.from({ length: max - min + 1 }, (value, index) => min + index);
  let fact = values.length > 9 ? 1 : 9 / values.length;
  let colors = colormap({
    colormap: colorbar,
    nshades: fact == 1? values.length:9, // duplicat as some colormaps need at least 9 nshades
    format: 'rba',
    alpha: 1
  });
  if (reverse) {
    colors = colors.reverse();
  }
  if (continous) {
    return values.map((value, index) => [value, colors[Math.round(index*fact)]]).flat();
  } else {
    return values.map((value, index) => [["==", ["band", 1], value], colors[Math.round(index*fact)]]).flat();
  }
}

export function get_colorscale_tileLayer_style(min, max, colorbar, continous = true, reverse = false) {
  if (continous) {
    return {
      color: [
        "case",
        ["!=", ["band", 2], 0],
        ['case',
          ["==", ["band", 1], 9998], [200, 200, 200],
          [ 'interpolate',
            ['linear'],
            ["band", 1],
            ...get_colorscale(min, max, colorbar, true, reverse),
          ],
        ],
        ["color", 0,0,0,0]
      ]
    }
  } else {
    return {
      color: [
        "case",
        ["!=", ['band', 2], 0],
        ['case',
          ...get_colorscale(min, max, colorbar, false, reverse),
          ["color", 0, 0, 0, 0]
        ],
        ["color", 0, 0, 0, 0]
      ]
    }
  }
}
