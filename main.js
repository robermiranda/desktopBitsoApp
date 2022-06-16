const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const {fork} = require('child_process');

function createWindow () {
    const win = new BrowserWindow({
        width : 1300,
        height : 1100,
        webPreferences : {
            nodeIntegration : true
        }
    });

    win.loadFile(path.join(__dirname, 'src/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    app.quit();
});


ipcMain.on('balance', (e, args) => {
    
    const params = JSON.stringify({
        action : args.action,
        filter : args.filter
    });

    const bitso = fork('bitsoConn/bitsogw', [params]);

    bitso.on('message', data => e.reply('resBalance',data));
});

ipcMain.on('bitsogw', (e, args) => {
    
    const params = JSON.stringify(args);

    const bitso = fork('bitsoConn/bitsogw', [params]);

    bitso.on('message', data => {

        const dataObj = JSON.parse(data);

        dataObj.requestFunction = args.requestFunction;

        e.reply('resBitsogw', JSON.stringify(dataObj));
    });
});

ipcMain.on('books', (e, args) => {
    
    const params = JSON.stringify(args);

    const bitso = fork('bitsoConn/bitsogw', [params]);

    bitso.on('message', data => {

        const dataObj = JSON.parse(data);

        dataObj.requestFunction = args.requestFunction;

        e.reply('resBooks', JSON.stringify(dataObj));
    });
});