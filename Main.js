const electron = require("electron");
const ipc = require("electron").ipcMain;
const os = require("os");
const path = require("path");
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const isMac = os.platform() === "darwin";

const template = [
    {
        label: "Install PyPlus",
        submenu: [
            {role: "quit"}
        ]
    }
];

function createMenu() {
    let menu;
    if (isMac) {
        menu = Menu.buildFromTemplate(template);
    } else {
        menu = new Menu();
    }
    Menu.setApplicationMenu(menu);

}

async function openSel(window) {
    const folder = await electron.dialog.showOpenDialog(window, {properties: ["openDirectory"]});

    if (folder.canceled) {
        const res = await electron.dialog.showMessageBox(window, {
            message: "Retry Select Install Directory?",
            type: "question",
            buttons: ["Yes", "No"]
        });
        if (res.response === 1) {
            process.exit(1);
        } else {
            await openSel(window);
        }
    }
}

function createWindow() {
    const win = new BrowserWindow({
        width: 667, height: 271,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        resizable: true
    });
    createMenu();
    win.loadFile(path.join(__dirname, "install-ui/index.html")).then();

    win.openDevTools();
    win.show();
    win.focus();

    win.onclick = () => {
        win.focus();
    };

    ipc.on("invokeAction", function () {
        const _ = openSel();
    });
}

electron.app.on("ready", () => {
    createWindow();
});
