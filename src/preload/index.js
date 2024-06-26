import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import  refillDataDB from '../database/RefillingDataManager'
import  ownerDataDB from '../database/OwnerDataManager'
import 'dotenv/config'
import { fetchOwners, insertOwner, updateOwner } from '../database/online/Owner'
import { encryptPassword as uEncryptPassword } from '../utils/auth'
import { insertExtinguisher, updateExtinguisher } from '../database/online/Extinguisher'


// Custom APIs for renderer
const api = {
  insertOwner,
  fetchOwners,
  updateOwner,
  insertExtinguisher,
  updateExtinguisher,
  onClearPrintQRSelection: (cb) => ipcRenderer.on('clear-print-qr-selection',(_event, value) => cb(value)),
  cleanOnClearPrintQRSelection: () => ipcRenderer.removeAllListeners('clear-print-qr-selection'),
  encryptPassword: (password) => uEncryptPassword(password, process.env.SALT_KEY)
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
      ownerDataDB
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
