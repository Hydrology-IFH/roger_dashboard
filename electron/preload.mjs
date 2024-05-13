import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld(
  'electron',
  {
    ipcRenderer: {
      invoke: (channel, data) => ipcRenderer.invoke(channel, data),
      on: (channel, func) => ipcRenderer.on(channel, func),
      once: (channel, func) => ipcRenderer.once(channel, func),
      removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    }
  }
)