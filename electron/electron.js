import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  shell,
  clipboard,
} from "electron";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import https from "https";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.IS_DEV == "true" ? true : false;

function createWindow() {
  const iconFile = path.join(__dirname, "../src/assets/icon.ico");
  console.log(iconFile);
  const mainWindow = new BrowserWindow({
    width: 1130,
    height: 700,
    autoHideMenuBar: true,
    icon: iconFile,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: `${__dirname}/preload.js`,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile("./dist/index.html");
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    ensureapppath();
    createWindow();
  }
});

ipcMain.handle("open-github-repo", () => {
  shell.openExternal("https://github.com/TheRealSavi/ProfileSaver");
});

ipcMain.handle("open-yt", () => {
  shell.openExternal(
    "https://www.youtube.com/channel/UCK-rzIpYZiYwGZH9kkeXywA"
  );
});

ipcMain.handle("open-discord-portal", () => {
  shell.openExternal("https://discord.com/developers/applications");
});

ipcMain.handle("copy-to-clipboard", async (_, text) => {
  try {
    clipboard.writeText(text);
    return "complete";
  } catch (err) {
    console.error(err);
    return "error";
  }
});

ipcMain.handle("create-collection", (_, collectionObj) => {
  try {
    // Ensure the collectionObj has a profiles field initialized to an empty array
    if (!Object.prototype.hasOwnProperty.call(collectionObj, "profiles")) {
      collectionObj.profiles = [];
    }

    const appDataPath = app.getPath("appData");
    const folderPath = path.join(appDataPath, "profilesaver", "collections");
    const id = getNextSavePath(folderPath);
    const savePath = path.join(folderPath, id, "data.json");

    // Write the updated collection object with the profiles field to the file
    fs.writeFile(savePath, JSON.stringify(collectionObj, null, 2), (err) => {
      if (err) {
        console.error("Error creating collection:", err);
        return null;
      } else {
        return "complete";
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
});

ipcMain.handle("open-saveid", (_, id) => {
  const appDataPath = app.getPath("appData");
  const folderPath = path.join(appDataPath, "profilesaver", "profiles", id);
  shell.openPath(folderPath);
});

ipcMain.handle("select-file", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "gif"] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }

  return null;
});

ipcMain.handle("get-saveid-images", async (_, id) => {
  const appDataPath = app.getPath("appData");
  const folderPath = path.join(appDataPath, "profilesaver", "profiles", id);

  try {
    const output = { avatar: undefined, banner: undefined };

    // Check if banner file exists
    const bannerFiles = fs.readdirSync(folderPath);
    const bannerFile = bannerFiles.find((file) => file.startsWith("banner."));

    if (bannerFile) {
      output.banner = path.join(folderPath, bannerFile);
    }

    // Check if avatar file exists
    const avatarFiles = fs.readdirSync(folderPath);
    const avatarFile = avatarFiles.find((file) => file.startsWith("avatar."));

    if (avatarFile) {
      output.avatar = path.join(folderPath, avatarFile);
    }

    return output;
  } catch (error) {
    console.error("Error while retrieving avatar and banner files:", error);
    return { avatar: undefined, banner: undefined };
  }
});

ipcMain.handle("read-file-as-data-url", async (_, filePath) => {
  try {
    const data = fs.readFileSync(filePath, { encoding: "base64" });
    return `data:image/png;base64,${data}`;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
});

const getBotToken = async () => {
  try {
    const appDataPath = app.getPath("appData");
    const appPath = path.join(appDataPath, "profilesaver");
    const settingsFilePath = path.join(appPath, "settings.json");

    // Read the contents of the settings.json file
    const settingsData = fs.readFileSync(settingsFilePath, "utf-8");
    const settings = JSON.parse(settingsData);

    return settings.botToken;
  } catch (err) {
    console.error("Error reading settings:", err.message);
    return null;
  }
};

const fetchUserProfile = async (userID) => {
  try {
    const botToken = await getBotToken();
    if (botToken == null) {
      throw "no token";
    }

    const response = await fetch(
      `https://discord.com/api/v10/users/${userID}`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
      }
    );

    if (response.ok) {
      const userData = await response.json();
      return userData;
    } else {
      console.error("Failed to fetch user data");
      return null;
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    return null;
  }
};

ipcMain.handle("fetch-discord-user", async (_, userID) => {
  try {
    return fetchUserProfile(userID);
  } catch (error) {
    console.error("Error fetching discord user", error);
    return null;
  }
});

const ensureapppath = () => {
  const appDataPath = app.getPath("appData");
  const appPath = path.join(appDataPath, "profilesaver");
  if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath, { recursive: true });
  }
};

const getNextSavePath = (basePath) => {
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  for (let i = 0; ; i++) {
    const folderPath = path.join(basePath, i.toString());

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      return i.toString();
    }
  }
};

ipcMain.handle("allocate-new-profile", () => {
  const appDataPath = app.getPath("appData");
  const appPath = path.join(appDataPath, "profilesaver", "profiles");
  const id = getNextSavePath(appPath);
  return id;
});

ipcMain.handle("save-json", (_, id, json) => {
  const appDataPath = app.getPath("appData");
  const appPath = path.join(appDataPath, "profilesaver", "profiles");
  const dirPath = path.join(appPath, id);
  const savePath = path.join(dirPath, "data.json");
  fs.writeFile(savePath, json, (err) => {
    if (err) {
      console.error("download-error", err);
      return null;
    } else {
      return "complete";
    }
  });
});

ipcMain.handle("is-in-collection", async (_, profileId, collectionId) => {
  const appDataPath = app.getPath("appData");
  const appPath = path.join(appDataPath, "profilesaver");
  const collectionDataFP = path.join(
    appPath,
    "collections",
    collectionId,
    "data.json"
  );

  try {
    const collectionData = fs.readFileSync(collectionDataFP, "utf-8");
    const collection = JSON.parse(collectionData);

    // Check if profileId is in the profiles array
    const isInCollection = collection.profiles.includes(profileId);

    return isInCollection;
  } catch (error) {
    console.error("Error reading or parsing collection data:", error);
    // If an error occurs, you might want to handle it accordingly.
    // Returning false here assumes that if there's an error, the profile is not in the collection.
    return false;
  }
});

ipcMain.handle(
  "modify-profile-in-collection",
  async (_, profileId, collectionId, addProfile = true) => {
    const appDataPath = app.getPath("appData");
    const appPath = path.join(appDataPath, "profilesaver");
    const collectionDataFP = path.join(
      appPath,
      "collections",
      collectionId,
      "data.json"
    );

    try {
      // Read and parse the JSON data from the file
      const collectionData = fs.readFileSync(collectionDataFP, "utf-8");
      const collection = JSON.parse(collectionData);

      // Add or remove the profileId from the profiles array based on the addProfile parameter
      if (addProfile && !collection.profiles.includes(profileId)) {
        collection.profiles.push(profileId);
      } else if (!addProfile) {
        collection.profiles = collection.profiles.filter(
          (id) => id !== profileId
        );
      }

      // Write the updated collection data back to the file
      fs.writeFileSync(
        collectionDataFP,
        JSON.stringify(collection, null, 2),
        "utf-8"
      );

      // Return the updated collection object
      return collection;
    } catch (error) {
      console.error(
        "Error reading, parsing, or updating collection data:",
        error
      );
      // If an error occurs, you might want to handle it accordingly.
      // Returning null here indicates that the operation was not successful.
      return null;
    }
  }
);

ipcMain.handle("save-settings", (_, json) => {
  const appDataPath = app.getPath("appData");
  const appPath = path.join(appDataPath, "profilesaver");
  const savePath = path.join(appPath, "settings.json");
  fs.writeFile(savePath, json, (err) => {
    if (err) {
      console.error("download-error", err);
      return null;
    } else {
      return "complete";
    }
  });
});

ipcMain.handle("read-settings", async () => {
  try {
    const appDataPath = app.getPath("appData");
    const appPath = path.join(appDataPath, "profilesaver");
    const settingsFilePath = path.join(appPath, "settings.json");

    // Read the contents of the settings.json file
    const settingsData = fs.readFileSync(settingsFilePath, "utf-8");
    const settings = JSON.parse(settingsData);

    return settings;
  } catch (error) {
    console.error("Error reading settings:", error.message);
    return null;
  }
});

ipcMain.handle("delete-profile", async (_, id) => {
  const appDataPath = app.getPath("appData");
  const folderPath = path.join(appDataPath, "profilesaver", "profiles");
  const profileFolderPath = path.join(folderPath, id);

  try {
    fs.rmSync(profileFolderPath, { recursive: true, force: true });
    return { success: true, message: `Profile ${id} deleted successfully.` };
  } catch (error) {
    return {
      success: false,
      message: `Error deleting profile ${id}: ${error.message}`,
    };
  }
});

ipcMain.handle("delete-collection", async (_, id) => {
  const appDataPath = app.getPath("appData");
  const folderPath = path.join(appDataPath, "profilesaver", "collections");
  const profileFolderPath = path.join(folderPath, id);

  try {
    fs.rmSync(profileFolderPath, { recursive: true, force: true });
    return { success: true, message: `Collection ${id} deleted successfully.` };
  } catch (error) {
    return {
      success: false,
      message: `Error deleting collection ${id}: ${error.message}`,
    };
  }
});

ipcMain.handle("get-all-collections", async () => {
  const appDataPath = app.getPath("appData");
  const folderPath = path.join(appDataPath, "profilesaver", "collections");
  try {
    // Recursively read files in the folder
    const jsonFilesWithContents = readJsonFilesRecursively(folderPath);
    return jsonFilesWithContents;
  } catch (error) {
    console.error("Error while retrieving JSON files:", error.message);
    return [];
  }
});

ipcMain.handle("get-all-profiles", async () => {
  const appDataPath = app.getPath("appData");
  const folderPath = path.join(appDataPath, "profilesaver", "profiles");

  try {
    // Recursively read files in the folder
    const jsonFilesWithContents = readJsonFilesRecursively(folderPath);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    return jsonFilesWithContents;
  } catch (error) {
    console.error("Error while retrieving JSON files:", error.message);
    return [];
  }
});

// Helper function to recursively read JSON files
function readJsonFilesRecursively(folderPath) {
  const result = [];

  function readFiles(folderPath) {
    const folderContents = fs.readdirSync(folderPath, { withFileTypes: true });

    for (const dirent of folderContents) {
      const fullPath = path.join(folderPath, dirent.name);

      if (dirent.isFile() && path.extname(dirent.name) === ".json") {
        const fileContent = fs.readFileSync(fullPath, "utf-8");
        const jsonData = JSON.parse(fileContent);
        let id = dirent.path.split("\\");
        id = id[id.length - 1];
        result.push({ id: id, content: jsonData });
      } else if (dirent.isDirectory()) {
        // Recursive call for subdirectories
        readFiles(fullPath);
      }
    }
  }

  readFiles(folderPath);
  return result;
}

ipcMain.handle("save-image", (_, id, imageUrl, fileName) => {
  const appDataPath = app.getPath("appData");
  const appPath = path.join(appDataPath, "profilesaver", "profiles");
  const dirPath = path.join(appPath, id);
  const savePath = path.join(dirPath, fileName);

  if (imageUrl.startsWith("data:")) {
    // Data URL handling
    const data = imageUrl.split(",")[1]; // Extract the base64-encoded image data
    const buffer = Buffer.from(data, "base64");

    const magicNumbers = Buffer.alloc(4);
    buffer.copy(magicNumbers, 0, 0, 4);
    const magicHex = magicNumbers.toString("hex");

    let fileType;

    switch (magicHex) {
      case "89504e47":
        fileType = ".png";
        break;
      case "47494638":
        fileType = ".gif";
        break;
      case "ffd8ffe0":
      case "ffd8ffe1":
      case "ffd8ffe2":
        fileType = ".jpeg";
        break;
      default:
        fileType = ".idk";
    }

    fs.writeFile(savePath + fileType, buffer, (err) => {
      if (err) {
        console.error("download-error", err);
        return null;
      } else {
        return "complete";
      }
    });
  } else if (imageUrl.startsWith("/src/assets")) {
    return "complete";
  } else {
    // Regular URL handling
    const file = fs.createWriteStream(savePath);
    https
      .get(imageUrl, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          return "complete";
        });
      })
      .on("error", (err) => {
        fs.unlink(savePath);
        console.error("download-error", err);
        return null;
      });
  }
});
