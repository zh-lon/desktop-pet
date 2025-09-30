import { app, BrowserWindow, screen, ipcMain, Menu } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  // 创建透明的无边框窗口
  mainWindow = new BrowserWindow({
    width: 300,
    height: 300,
    x: screenWidth - 350,
    y: screenHeight - 350,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 设置窗口可以点击穿透(仅窗口透明部分)
  mainWindow.setIgnoreMouseEvents(false);

  // 开发环境加载 vite 开发服务器
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools({ mode: 'detach' }); // 不自动打开
  } else {
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC 通信:拖动窗口
ipcMain.on('drag-window', (event, { x, y }) => {
  if (mainWindow) {
    const [currentX, currentY] = mainWindow.getPosition();
    mainWindow.setPosition(currentX + x, currentY + y);
  }
});

// IPC 通信:关闭应用
ipcMain.on('close-app', () => {
  app.quit();
});

// IPC 通信:显示右键菜单
ipcMain.on('show-context-menu', (event) => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: '🎮 切换动作',
      submenu: [
        {
          label: '😊 待机',
          click: () => {
            mainWindow?.webContents.send('change-action', 'idle');
          }
        },
        {
          label: '🚶 行走',
          click: () => {
            mainWindow?.webContents.send('change-action', 'walk');
          }
        },
        {
          label: '🪑 坐下',
          click: () => {
            mainWindow?.webContents.send('change-action', 'sit');
          }
        },
        {
          label: '😴 睡觉',
          click: () => {
            mainWindow?.webContents.send('change-action', 'sleep');
          }
        }
      ]
    },
    { type: 'separator' },
    {
      label: '💬 说句话',
      click: () => {
        mainWindow?.webContents.send('say-something');
      }
    },
    { type: 'separator' },
    {
      label: '🔧 开发工具',
      click: () => {
        mainWindow?.webContents.toggleDevTools();
      }
    },
    { type: 'separator' },
    {
      label: '❌ 退出',
      click: () => {
        app.quit();
      }
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  menu.popup({ window: BrowserWindow.fromWebContents(event.sender)! });
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
