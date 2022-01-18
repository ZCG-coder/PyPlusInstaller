const electron = require("electron");
const ipc = require("electron").ipcMain;
const os = require("os");
const path = require("path");
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const isMac = os.platform() === "darwin";


function createMenu(template) {
    let menu;
    if (isMac) {
        menu = Menu.buildFromTemplate(template);
    } else {
        menu = new Menu();
    }
    Menu.setApplicationMenu(menu);

}

function createWindow() {
    // noinspection JSUnusedGlobalSymbols
    const menuTemplate = [
            {
                label: "Install PyPlus",
                submenu: [
                    {
                        label: "Quit",
                        click() {
                            process.exit(1);
                        },
                        accelerator: "CmdOrCtrl+q"
                    },
                    {
                        label: "Reload",
                        click() {
                            win.reload();
                        }
                    },
                    {
                        label: "DevTools",
                        click() {
                            win.openDevTools();
                        }
                    }
                ]
            }
        ]
    ;
    const win = new BrowserWindow({
        width: 667, height: 271,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        resizable: true
    });
    createMenu(menuTemplate);
    win.loadFile(path.join(__dirname, "install-ui/index.html")).then();

    win.show();
    win.focus();

    win.onclick = () => {
        win.focus();
    };

    ipc.on("cancel", async function () {
        process.exit(0);
    });
}

electron.app.on("ready", () => {
    createWindow();
});
