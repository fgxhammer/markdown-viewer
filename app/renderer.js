const marked = require('marked')
const { ipcRenderer, app } = require('electron')
const { remote } = require('electron')
const path = require('path')

// Globals
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

// TODO Fix title flickering on change
const updateUserInterface = ({ hasChanges, fileOpened }) => {
  const appTitle = 'Mdown ⬇'

  if (fileOpened) {
    currentWindow.setTitle(`${path.basename(fileOpened)} - ${appTitle}`)
  }
  if (hasChanges && fileOpened) {
    currentWindow.setTitle(`${path.basename(fileOpened)} ● - ${appTitle}`)
  }
  if (hasChanges && !fileOpened) {
    currentWindow.setTitle(`New File ● - ${appTitle}`)
  }

  currentWindow.setRepresentedFilename(fileOpened)
  currentWindow.setDocumentEdited(hasChanges)

  revertButton.disabled = !hasChanges
  saveMarkdownButton.disabled = !hasChanges
}

markdownView.addEventListener('keyup', event => {
  const currentFileContent = event.target.value
  renderMarkdownToHtml(currentFileContent)
  const hasChanges = currentFileContent !== originalFileContent
  updateUserInterface({ hasChanges, fileOpened })
})

openFileButton.addEventListener('click', () => {
  ipcRenderer.invoke('get-file-from-user')
})

ipcRenderer.on('file-open', (e, { filePath, fileContent }) => {
  fileOpened = filePath
  originalFileContent = fileContent
  markdownView.value = fileContent
  renderMarkdownToHtml(fileContent)
  updateUserInterface({ fileOpened })
})
