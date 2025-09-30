import { contextBridge, ipcRenderer } from 'electron';

// 暴露安全的API到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  dragWindow: (x: number, y: number) => {
    ipcRenderer.send('drag-window', { x, y });
  },
  closeApp: () => {
    ipcRenderer.send('close-app');
  },
  showContextMenu: () => {
    ipcRenderer.send('show-context-menu');
  },
  onChangeAction: (callback: (action: string) => void) => {
    ipcRenderer.on('change-action', (_event, action) => callback(action));
  },
  onSaySomething: (callback: () => void) => {
    ipcRenderer.on('say-something', () => callback());
  }
});
