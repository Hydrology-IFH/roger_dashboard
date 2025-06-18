import { Layer, BaseLayer, RangeLayer, splitPath } from './Layer.mjs';

const np = window.nodePath;

// LayerGroup is a Grouping class for different layers
export class LayerGroup {
  constructor(name) {
    this.name = name;
    this.groups = [];
    this.layers = [];
  }

  addChild(child) {
    if (child instanceof BaseLayer) {
      this.layers.push(child);
    } else if (child instanceof LayerGroup) {
      this.groups.push(child);
    } else {
      throw new Error('Child is not a Layer or LayerGroup');
    }
  }

  get id() {
    return this.name.replace("\\", "-");
  }

  hasChild(child){
    return this.layers.includes(child) || this.groups.some((group) => group.hasChild((child)));
  }

  get selected() {
    return this.layers.some(layer => layer.selected) || this.groups.some(group => group.selected);
  }

  get selectedLayer() {
    if (this.selected) {
      let layer = this.layers.find(layer => layer.selected);
      if (layer !== undefined){
        return layer;
      } else {
        let group = this.groups.find(group => group.selected);
        if (group !== undefined){
          return group.selectedLayer;
        }
      }
    }
    return null
  }

  selectLayer(pathOrLayer){
    this.unselectAllLayers();
    let layer = undefined;
    if (typeof pathOrLayer == "string"){
      layer = this.layers.find(layer => layer.path === pathOrLayer);
    } else if (pathOrLayer instanceof BaseLayer){
      layer = pathOrLayer;
    } else {
      throw new Error('pathOrLayer is not a string or BaseLayer');
    }
    if (layer !== undefined){
      layer.selected = true;
      return true;
    } else {
      return this.groups.some(group => group.selectLayer(pathOrLayer));
    }
  }

  unselectLayer(path){
    let layer = this.layers.find(layer => layer.path === path);
    if (layer !== undefined){
      layer.selected = false;
      return true;
    } else {
      return this.groups.some(group => group.unselectLayer(path));
    }
  }

  unselectAllLayers(){
    this.layers.forEach(layer => layer.selected = false);
    this.groups.forEach(group => group.unselectAllLayers());
  }

  selectFirstLayer(){
    if (this.layers.length > 0){
      return this.selectLayer(this.layers[0]);
    } else {
      return this.groups.forEach(group => group.selectFirstLayer());
    }
  }

  get hasLayers() {
    return this.layers.length > 0 || this.groups.some(group => group.hasLayers);
  }
}

// LayerLibrary is the main Library class for all layers
export class LayerLibrary extends LayerGroup {
  constructor(files) {
    super('root');

    this.lastSelectedLayer = null;
    this.addFiles(files);
  }

  update(files) {
    if (this.selectedLayer !== null){
      this.lastSelectedLayer = this.selectedLayer;
    }
    this.clear();
    this.addFiles(files);
    if (this.lastSelectedLayer !== null){
      this.selectLayer(this.lastSelectedLayer.path);
    } else {
      this.selectFirstLayer();
    }
  }

  clear() {
    this.groups = [];
    this.layers = [];
  }

  addFiles(files) {
    files
      .filter(file => np.extname(file) == '.tif')
      .forEach(file => {
        this.addLayer(file);
      });
  }

  getAndAddFileGroup(file) {
    let groupNames =  file.split('\\').slice(0, -1);
    let parent = this;
    groupNames.forEach(groupName => {
      if (groupName !== "Ergebnisse"){
        let groups = parent.groups.filter(group => group.name === groupName);
        if (groups.length === 0) {
          let group = new LayerGroup(groupName);
          parent.addChild(group);
          parent = group;
        } else if (groups.length === 1){
          parent = groups[0];
        } else {
          throw new Error('Multiple groups with the same name');
        }
      }
    });
    return parent;
  }

  addLayer(file, group = this.getAndAddFileGroup(file)) {
    // check if layer already exists
    let [dir, name, ] = splitPath(file);
    let existing_layers = group.layers.filter((child) => child.name === name && child.dir === dir);
    let new_layer = undefined;
    if (existing_layers.length === 0) {
      new_layer = new Layer(file);
    } else if (existing_layers.length === 1) {
      new_layer = existing_layers[0];
    } else {
      throw new Error('Layer exists more than once');
    }

    // add layer to group
    if (new_layer != undefined){
      // check if layer is a RangeLayer and if it already exists
      if (new_layer instanceof RangeLayer){
        let existing_rlayers = group.layers.filter((child) => child instanceof RangeLayer && child.name === new_layer.name && child.dir === new_layer.dir);
        if (existing_rlayers.length === 1){
          existing_rlayers[0].addFile(file);
          return existing_rlayers[0];
        }
      }
      group.addChild(new_layer);
      return new_layer
    } else {
      throw new Error('Layer could not be added');
    }
  }
}