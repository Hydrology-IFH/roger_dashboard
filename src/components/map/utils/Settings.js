import { useSettings } from '../../../stores/settings';
import { ref } from 'vue';

export class Settings {
  constructor() {
    let defaultSettings = useSettings();
    this.hover_decimals = ref(defaultSettings.map_default_hover_decimals);
    this.opacity = ref(defaultSettings.map_default_opacity);
    this.basemap = ref(defaultSettings.map_default_basemap);
    this.colorscale = ref(defaultSettings.map_default_colorscale);
  };
}