const { app, BrowserWindow, dialog } = require('electron')
const promisify = require('util').promisify
const readFile = promisify(require('fs').readFile)
const { ipcMain } = require('electron')

const getFilesAsync = async (filePath) => {
  const fileContent = (await readFile(filePath)).toString()
  return fileContent
}

ipcMain.handle('get-file-from-user', async e => {
  const dialogResponse = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md'] },
      { name: 'Text Files', extensions: ['txt', 'text'] }
    ]
  })
  try {
    if (dialogResponse.canceled) return
    const filePath = dialogResponse.filePaths[0]
    const fileContent = await getFilesAsync(filePath)
    e.sender.send('file-open', { filePath, fileContent })
  } catch (err) {
    console.error(err)
  }
})

app.on('ready', () => {
  console.log('The app is ready ⚡️')
  
  const mainWindow = new BrowserWindow({ 
    width: 1240,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    } 
  })

  mainWindow.loadFile(`${__dirname}/index.html`)
  mainWindow.once('ready-to-show', () => mainWindow.show())
  mainWindow.webContents.openDevTools()
})

console.log('App starting up ... 🚀')
