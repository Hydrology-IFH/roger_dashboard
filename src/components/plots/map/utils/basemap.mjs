import { get as getProjection } from 'ol/proj.js';
import OSM from 'ol/source/OSM.js';
import TileWMS from 'ol/source/TileWMS.js';
import "./projections"

let basemap_proj = getProjection("EPSG:25832");

export const basemap_sources = {
  basemap_grey: new TileWMS({
    url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
    projection: basemap_proj,
    crossOrigin: '',
    attributions: '© GeoBasis-DE / <a href="ttps://www.bkg.bund.de" target="_blank">BKG</a> / <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>',
    params: {
      'LAYERS': 'de_basemapde_web_raster_grau',
      'TILED': false,
      'FORMAT': 'image/png',
      'VERSION': '1.3.0',
      "CRS": basemap_proj.code_,
      'SERVICE': 'WMS',
    }
  }),
  basemap_color: new TileWMS({
    url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
    projection: basemap_proj,
    crossOrigin: '',
    attributions: '© GeoBasis-DE / <a href="ttps://www.bkg.bund.de" target="_blank">BKG</a> / <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>',
    params: {
      'LAYERS': 'de_basemapde_web_raster_farbe',
      'TILED': false,
      'FORMAT': 'image/png',
      'VERSION': '1.3.0',
      "CRS": basemap_proj.code_,
      'SERVICE': 'WMS',
    }
  }),
  osm: new OSM(),
  blank: null
}