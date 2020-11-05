const { app, BrowserWindow, dialog } = require('electron')
const promisify = require('util').promisify
const readFile = promisify(require('fs').readFile)
const { ipcMain } = require('electron')

ipcMain.handle('get-file-from-user', () => {
  let fileContent

  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md'] },
      { name: 'Text Files', extensions: ['txt', 'text'] }
    ]
  }).then(files => {
    if (files.canceled) return
    const filePath = files.filePaths[0]

    readFile(filePath)
      .then(content => {
        fileContent = content.toString()
        console.log(fileContent)
      })
  })
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
