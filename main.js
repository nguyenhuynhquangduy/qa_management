const { app, BrowserWindow } = require('electron');
const path = require('path');
const expressApp = require('./app'); // Chạy Express bên trong Electron
require('dotenv').config();

const port = process.env.PORT || '3000';
// const isDev = !app.isPackaged;
// const basePath = isDev ? __dirname : path.join(process.resourcesPath);
console.log('🔧 Running in', app.isPackaged ? 'PRODUCTION' : 'DEVELOPMENT', 'mode');
// Bắt đầu Express server
expressApp.listen(port, () => {
  console.log(`Express running on http://localhost:${port}/`);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'public', 'image', 'ndsoft.ico')

  });

  win.loadURL(`http://localhost:${port}/`);
}
// Sự kiện Electron
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


app.whenReady().then(() => {
  createWindow();
});
