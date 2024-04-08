import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';

proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
proj4.defs("EPSG:31467", "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +nadgrids=BETA2007.gsb +units=m +no_defs +type=crs");

register(proj4);