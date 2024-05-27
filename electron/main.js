const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { fileURLToPath } = require('node:url');
const { dirname } = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const process = require('process');

const isDev = process.env.NODE_ENV === 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
process.env.APP_ROOT = path.join(__dirname, '..')

const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
// export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

// process.env.VITE_PUBLIC = MAIN_WINDOW_VITE_DEV_SERVER_URL
//   ? path.join(process.env.APP_ROOT, 'public')
//   : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

const MAIN_WINDOW_VITE_DEV_SERVER_URL = process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL

let win

function createWindow () {
  win = new BrowserWindow({
    width: 1600,
    height: 1100,
    icon: path.join(process.env.APP_ROOT, 'public/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
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
ipcMain.handle("get-file", async (event, filePath) => {
  if (!filePath) return ''
  try {
    const data = await fs.readFileSync(filePath);
    return new Uint8Array(data);
  } catch (err) {
    return "404";
  }
})