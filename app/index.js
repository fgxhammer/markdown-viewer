const { app, BrowserWindow, dialog } = require('electron')
const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)
const writeFile = promisify(require('fs').writeFile)
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
    app.addRecentDocument(filePath)
    e.sender.send('file-open', { filePath, fileContent })
  } catch (err) {
    console.error(err)
  }
})

ipcMain.handle('save-file', async (e, file) => {
  await console.log(e, file)
  await console.log('save-file', e, fileOpened, fileContent)
  try {
    const newFile = await writeFile(fileOpened, fileContent).catch(e => console.log(e))
    await console.log(newFile)
    return newFile
  } catch(e) {
    console.error(e)
  }
})

app.on('ready', () => {
  console.log('The app is ready ⚡️')
  
  const mainWindow = new BrowserWindow({ 
    width: 1240,
    height: 800,
    show: false,
    title: 'Mdown ⬇',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    } 
  })

  mainWindow.loadFile(`${__dirname}/index.html`)
  mainWindow.once('ready-to-show', () => mainWindow.show())
  // mainWindow.webContents.openDevTools()
})

console.log('App starting up ... 🚀')
