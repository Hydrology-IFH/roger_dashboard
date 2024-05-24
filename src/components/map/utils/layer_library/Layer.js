const np = window.nodePath;

export function splitPath(path) {
  let parts = path.split('\\');
  return [parts.slice(0,-1).join('\\'), ...parts.pop().split('.')];
}

export class BaseLayer {
  constructor(path) {
    [this.dir, this.name, this.suffix] = splitPath(path);
    if (this.suffix !== 'tif') {
      throw new Error(`${path} is not a tif file`);
    }
    this.selected = false;
  }

  get path() {
    return `${this.dir}\\${this.name}.${this.suffix}`;
  }

  get id() {
    return `${this.dir.replace("\\", "-")}-${this.name}`;
  }

  addFile(path) {
    throw new Error('For BaseLayer, addFile is not implemented');
  }
}

export class RangeLayer extends BaseLayer {
  static _regex_step = /(^\d+)|(\d+$)/;

  constructor(path) {
    if (!RangeLayer.isRangePath(path)) {
      return new BaseLayer(path);
    }
    super(path);
    let full_name = this.name;
    this.name = RangeLayer.getRangeName(this.name);
    let step = RangeLayer.getStep(full_name);
    this.steps = [step];
    this._active_step = step;

    // get name format for steps
    let match = full_name.match(this._regex_step);
    this._digits = match[0].length;
    this._format_name = full_name.replace(this._regex_step, `_${step}`);

  }

  addFile(path) {
    let [dir, full_name, suf] = splitPath(path);
    let name = RangeLayer.getRangeName(full_name);
    if (dir === this.dir && name === this.name) {
      this.steps.push(RangeLayer.getStep(full_name));
    } else {
      throw new Error('File does not belong to this layer');
    }
  }

  static getStep(name) {
    return parseInt(name.match(this._regex_step)[0]);
  }

  static isRangePath(path) {
    return this._regex_step.test(splitPath(path)[1])
  }

  static getRangeName(filename){
    return filename.replace(this._regex_step, '');
  }

  get path() {
    let name = this._format_name.replace("_${step}", this._active_step.toString().padStart(this._digits, '0'));
    return np.join(this.dir, `${name}.${this.suffix}`);
  }

  selectStep(step) {
    if (this.steps.includes(step)) {
      this._active_step = step;
    } else {
      throw new Error(`Step ${step} does not exist`);
    }
  }

}

export class Layer extends BaseLayer {
  constructor(path) {
    super(path);
    if (this.name.match(/(^\d+)|(_\d+$)/)) {
      return new RangeLayer(path);
    }
  }
}