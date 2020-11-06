const { app, BrowserWindow, dialog } = require('electron')
const promisify = require('util').promisify
const readFile = promisify(require('fs').readFile)
const { ipcMain } = require('electron')

const getFilesAsync = async (filePath) => {
  const fileContent = (await readFile(filePath)).toString()
  return fileContent
}

ipcMain.handle('get-file-from-user', async event => {
  const dialogResponse = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md'] },
      { name: 'Text Files', extensions: ['txt', 'text'] }
    ]
  })
  try {
    if (dialogResponse.canceled) return
    const fileContent = await getFilesAsync(dialogResponse.filePaths[0])
    event.sender.send('selected-file', fileContent)
  } catch (err) {
    console.error(err)
  }
})

app.on('ready', () => {
  console.log('The app is ready ⚡️')
  
  const mainWindow = new BrowserWindow({ 
    show: false,
    webPreferences: {
      nodeIntegration: true
    } 
  })

  mainWindow.loadFile(`${__dirname}/index.html`)
  mainWindow.once('ready-to-show', () => mainWindow.show())
})

console.log('App starting up ... 🚀')
