const { globalShortcut, BrowserWindow, app  } = require('electron')
require('./app.js')

let mainWindow;

function createWindow() {

  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 440,
    height: 680,
    icon: __dirname + '/build/icon.ico',
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

 
  mainWindow.loadURL(`http://localhost:3000/`);
  //mainWindow.webContents.openDevTools();
  mainWindow.on("close", () => {
    mainWindow.webContents.send("stop-server");
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}


app.on('ready', () => {
    createWindow()
    // Register a 'CommandOrControl+X' shortcut listener.
    const ret = globalShortcut.register('CommandOrControl+N', () => {
        mainWindow.loadURL(`http://localhost:3000/upload`)
    })
<<<<<<< HEAD
=======
    globalShortcut.register('CommandOrControl+H', () => {
        mainWindow.loadURL(`http://localhost:3000`)
    })
    globalShortcut.register('CommandOrControl+S', () => {
      
  })
>>>>>>> Heroku
})
  

app.on("browser-window-created", function(e, window) {
  window.setMenu(null);
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('will-quit', function() {
    // Unregister a shortcut.
    globalShortcut.unregister('CommandOrControl+N');
<<<<<<< HEAD
=======
    globalShortcut.unregister('CommandOrControl+H');
    globalShortcut.unregister('CommandOrControl+S');
>>>>>>> Heroku
  });

module.exports = app;