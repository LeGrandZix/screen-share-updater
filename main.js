const { app, BrowserWindow, desktopCapturer, ipcMain, dialog } = require('electron');
const path = require('path');

let autoUpdater;
if (app.isPackaged) {
  autoUpdater = require('electron-updater').autoUpdater;
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

ipcMain.handle('get-sources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });
  return sources;
});

app.whenReady().then(() => {
  createWindow();
  if (autoUpdater) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

// Configuration auto-updater
if (autoUpdater) {
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Mise à jour disponible',
      message: 'Une nouvelle version est disponible. Elle sera téléchargée en arrière-plan.',
      buttons: ['OK']
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Mise à jour prête',
      message: 'La mise à jour a été téléchargée. L\'application va redémarrer pour l\'installer.',
      buttons: ['Redémarrer', 'Plus tard']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
}

ipcMain.handle('check-for-updates', () => {
  if (autoUpdater) {
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    console.log('Auto-updater non disponible en mode développement');
  }
});

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