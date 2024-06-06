const UNITS = {
  // layername: 'unit'
  "LU_": "",
  "Max W": "cm",
  "Max Geschw": "m/s",
  "max_spez_durchfluss_SFI": "m³/s",
  "w_fin": "cm",
  "_dgm": "m.ü.NN",
  "_dgm_raw": "m.ü.NN",
}

export function getUnit(layername){
  if (layername in UNITS){
    return UNITS[layername]
  }
  if (/^(HOF)|(OA)|(Inf)|(SOF)|(TP)|(ZA)|(N)_/.test(layername)){
    return "mm"
  }
  return ""
}