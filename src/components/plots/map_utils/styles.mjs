// import { gridFormPara } from './forms.mjs';
import colormap from 'colormap';

const MIN_STEPS = 9;
const MAX_STEPS = 40;
// helper functions for colorbars
const get_colorscale = function (min, max, colorbar, continous=true, reverse=false) {
  let length = max - min + 1;
  let step = 1;
  let fact = 1;
  if (length > MAX_STEPS){
    step = Math.floor(length / MAX_STEPS);
    length = Math.ceil(length / step);
  } else if (length < MIN_STEPS) {
    fact = MIN_STEPS / length;
  }
  let values = Array.from({ length:length }, (value, index) => min + index * step);
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
        [ 'interpolate',
          ['linear'],
          ["band", 1],
          ...get_colorscale(min, max, colorbar, true, reverse),
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
