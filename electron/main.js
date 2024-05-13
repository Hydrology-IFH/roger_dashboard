#!/usr/bin/env node
import { app, BrowserWindow, ipcMain } from 'electron'
import process from 'process'
import { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

const isDev = ["el-dev", "dev"].includes(process.env.npm_lifecycle_event);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
process.env.APP_ROOT = path.join(__dirname, '..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

const indexHtml = path.join(RENDERER_DIST, 'index.html')
let win

function createWindow () {
  win = new BrowserWindow({
    width: 1600,
    height: 1100,
    icon: path.join(process.env.APP_ROOT, 'public/favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true
    }
  })

  // remove the Menu
  if (!isDev) win.removeMenu()

  // start App
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(indexHtml)
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
  return fs.promises.readFile(filePath, 'utf8')
})