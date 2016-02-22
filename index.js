'use strict';

const electron = require('electron');
const proxy = require('./js/services/proxy');
const ipcMain = require('electron').ipcMain;
const config = require('./config.json');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.commandLine.appendSwitch('proxy-server', `127.0.0.1:${config.proxyPort}`);
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('ssl-version-fallback-min', 'tls1');

let mainWindow;

let createWindow = () => {

    if(process.platform == 'win32') {
        mainWindow = new BrowserWindow({
            'width': 666,
            'height': 568,
            'icon': './images/icons/gbfplayer.png'
        });
    }else {
        mainWindow = new BrowserWindow({
            'width': 650,
            'height': 568,
            'icon': './images/icons/gbfplayer.png'
        });
    }

    proxy.init({
        webContents: mainWindow.webContents,
        port: config.proxyPort
    });

    let session = mainWindow.webContents.session;
    
    // set iphone UA
    session.webRequest.onBeforeSendHeaders(function(details, callback) {
        details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
        callback({cancel: false, requestHeaders: details.requestHeaders});
    });

    mainWindow.setResizable(false);
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.setMaximizable(false);
    
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    
    //mainWindow.webContents.openDevTools();

    ipcMain.on('clearCache-msg', (event, arg) => {
        if(arg === 'clearCache') {
            session.clearStorageData(() => {
                event.sender.send('clearCache-reply', '缓存清除完毕！请重新打开程序。');
            });
        }
    });

    ipcMain.on('switch-window-msg', function() {
        if(mainWindow.getSize()[0] === 650) {
            if(process.platform == 'win32') {
                mainWindow.setSize(336, 568);
            }else {
                mainWindow.setSize(320, 568);
            }
        }else {
            mainWindow.setSize(650, 568);
        }
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});