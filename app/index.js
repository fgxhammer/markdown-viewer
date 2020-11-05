const { app, BrowserWindow } = require('electron')

app.on('ready', () => {
  console.log('The app is ready ⚡️')
  const mainWindow = new BrowserWindow({ show: false })
  mainWindow.loadFile(`${__dirname}/index.html`)
  mainWindow.once('ready-to-show', () => mainWindow.show())
})

console.log('App starting up ... 🚀')
