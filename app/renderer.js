const marked = require('marked')
const { ipcRenderer, app } = require('electron')
const { remote } = require('electron')
const path = require('path')

// Constants
const appTitle = 'Mdown ⬇'
let fileOpened = null
let originalFileContent = ''

// Electron elements
const currentWindow = remote.getCurrentWindow()

// Html elements
const markdownView = document.querySelector('#markdown')
const htmlView = document.querySelector('#html')
const newFileButton = document.querySelector('#new-file')
const openFileButton = document.querySelector('#open-file')
const saveMarkdownButton = document.querySelector('#save-markdown')
const revertButton = document.querySelector('#revert')
const saveHtmlButton = document.querySelector('#save-html')
const showFileButton = document.querySelector('#show-file')
const openInDefaultButton = document.querySelector('#open-in-default')

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = marked(markdown, { sanitize: true })
}

const updateUserInterface = () => {
  const title = fileOpened ? `${appTitle} - ${path.basename(fileOpened)}` : appTitle
  currentWindow.setTitle(title)
}

markdownView.addEventListener('keyup', event => {
  const currentContent = event.target.value
  renderMarkdownToHtml(currentContent)
})

openFileButton.addEventListener('click', () => {
  ipcRenderer.invoke('get-file-from-user')
})

ipcRenderer.on('file-open', (e, { filePath, fileContent }) => {
  fileOpened = filePath
  originalFileContent = fileContent
  markdownView.value = fileContent
  renderMarkdownToHtml(fileContent)
  updateUserInterface()
})
