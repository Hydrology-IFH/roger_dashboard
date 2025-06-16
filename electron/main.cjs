const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { fileURLToPath } = require('node:url');
const { dirname } = require('node:path');
const process = require('process');

const isDev = process.env.NODE_ENV === 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const RENDERER_DIST = '.vite/renderer/main_window'

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// prevent app startup on squirrel install
if (require('electron-squirrel-startup')) app.quit();

// prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// check for updates
const { updateElectronApp } = require('update-electron-app')
updateElectronApp()

const MAIN_WINDOW_VITE_DEV_SERVER_URL = process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL

let win

async function createWindow () {
  // initiate electron store
  await import('electron-store')
    .then((imp) => imp.default)
    .then((Store) => {
      console.log("Initiating store")
      let store = new Store({
        beforeEachMigration: (store, context) => {
          console.log(`[main-config] migrate from ${context.fromVersion} --> ${context.toVersion}`);
        },
        migrations: require('./store-migrations').default,
      })
      ipcMain.on('electron-store-get', async (event, val) => {
        event.returnValue = store.get(val)
      });
      ipcMain.on('electron-store-set', async (event, key, val) => {
        console.log("Setting", key, val)
        store.set(key, val);
      });
    })
    .catch((err) => console.error(err))

  // Create the browser window.
  win = new BrowserWindow({
    width: 1600,
    height: 1100,
    icon: path.join(__dirname, 'Logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })

  // remove the Menu
  if (!isDev) win.removeMenu()

  // start App
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // start devtools
  if (isDev){
    win.webContents.openDevTools()
  }

  // set shortcuts
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    BrowserWindow.getFocusedWindow().webContents.openDevTools()
  })
  globalShortcut.register('F5', () => {
    BrowserWindow.getFocusedWindow().webContents.reload()
  })
}

app.whenReady().then(() => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ipc to return files from the filesystem
ipcMain.handle('read-file', async (event, filePath) => {
  if (!filePath) return ''
  if (await fs.existsSync(filePath)){
    return fs.promises.readFile(filePath, 'utf8')
  } else {
    return "404"
  }
})
ipcMain.handle('list-files', async (event, dirPath) => {
  if (!dirPath) return ''
  if (!await fs.existsSync(dirPath)) return "404"
  return fs.promises.readdir(dirPath, {recursive: true})
})
ipcMain.handle("list-subdirs", async (event, dirPath) => {
  if (!dirPath) return ''
  if (!await fs.existsSync(dirPath)) return "404"
  return fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name)
})
ipcMain.handle("get-file-blob", async (event, filePath) => {
  if (!filePath) return ''
  try {
    const data = await fs.readFileSync(filePath);
    return new Uint8Array(data);
  } catch (err) {
    return "404";
  }
})
ipcMain.handle("get-file-text", async (event, filePath) => {
  if (!filePath) return ''
  try {
    return await fs.readFileSync(filePath, "utf8");
  } catch (err) {
    return "404";
  }
})