import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
  const indexPath = path.join(__dirname, "dist", "index.html");
  console.log("Loading file:", indexPath); // Add this line to log the path

  win.loadFile(indexPath).catch((err) => {
    console.error("Failed to load file:", err); // Add this line to log any errors
  });

  win.webContents.on("did-finish-load", () => {
    console.log("Loaded URL:", win.webContents.getURL()); // Log the loaded URL
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
