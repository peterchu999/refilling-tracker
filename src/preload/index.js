import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import  refillDataDB from '../database/RefillingDataManager'

// Custom APIs for renderer
const api = {
  onClearPrintQRSelection: (cb) => ipcRenderer.on('clear-print-qr-selection',(_event, value) => cb(value)),
  cleanOnClearPrintQRSelection: () => ipcRenderer.removeAllListeners('clear-print-qr-selection')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld("sqlite", {
      refillDataDB,
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
