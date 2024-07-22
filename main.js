// src/main.js

const { app, BrowserWindow } = require('electron');
const path = require('path');
const {autoUpdater,AppUpdater} = require("electron-updater")

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.autoRunAppAfterInstall = true;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.on('ready', ()=>{
    createWindow();
    autoUpdater.checkForUpdates();
    autoUpdater.on('update-downloaded', (info) => {
        log.info('Update downloaded');
        dialog.showMessageBox({
          type: 'info',
          title: 'Update ready',
          message: 'Update downloaded. The application will restart to apply the updates.',
          buttons: ['Restart', 'Later']
        }).then((result) => {
          if (result.response === 0) {
            autoUpdater.quitAndInstall(true, true);
          }
        });
      });
} );




app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
