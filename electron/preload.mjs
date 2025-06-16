import path from 'node:path';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld(
  'electron',
  {
    ipcRenderer: {
      invoke: (channel, data) => ipcRenderer.invoke(channel, data),
      on: (channel, func) => ipcRenderer.on(channel, func),
      once: (channel, func) => ipcRenderer.once(channel, func),
      removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    },
    store: {
      get(key) {
        return ipcRenderer.sendSync('electron-store-get', key);
      },
      set(property, val) {
        ipcRenderer.send('electron-store-set', property, val);
      },
    },
  }
)
contextBridge.exposeInMainWorld('nodePath', {
  basename: (p) => path.basename(p),
  dirname: (p) => path.dirname(p),
  extname: (p) => path.extname(p),
  relative: (from, to) => path.relative(from, to),
  resolve: (p) => path.resolve(p),
  parse: (p) => path.parse(p),
  join: (...p) => path.join(...p)
});