const electron = require("electron")
 
  require('./app.js')
  const { Menu, globalShortcut, BrowserWindow, app  } = require('electron')


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 440,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const dockMenu = Menu.buildFromTemplate([
    {
      label: 'New Upload',
      click () {   mainWindow.loadURL(`http://localhost:3000/upload`) }
    }
  ])
  
  app.dock.setMenu(dockMenu)

  
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
    globalShortcut.register('CommandOrControl+H', () => {
        mainWindow.loadURL(`http://localhost:3000`)
    })
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
    globalShortcut.unregister('CommandOrControl+H');
  });