const { contextBridge, ipcRenderer } = require('electron');

// Gửi và nhận từ main process thông qua IPC
contextBridge.exposeInMainWorld('electronAPI', {
    getProducts: () => ipcRenderer.invoke('products:get'),
    createProduct: (data) => ipcRenderer.invoke('products:create', data)
});
