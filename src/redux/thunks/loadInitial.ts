import * as Font from "expo-font";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

import uiSlice from "../slices/ui";
import { TMThunkAction, TMThunkDispatch, t } from "../types";

const { setLoaded } = uiSlice.actions;

const DB_FOLDER = `${FileSystem.documentDirectory}SQLite`;
const DB_FILE = `${DB_FOLDER}/tree_map.db`;

export default function loadInitial(): TMThunkAction {
  return t("loadInitial", {}, async (dispatch: TMThunkDispatch) => {
    await loadFont();
    await loadDb();
    dispatch(setLoaded());
  });
}

async function loadFont() {
  await Font.loadAsync({
    "material-icons": require("../../../assets/MaterialIcons-Regular.ttf"),
  });
}

async function loadDb() {
  const asset = Asset.fromModule(require("../../../assets/tree_data.db"));
  const fileInfo = await FileSystem.getInfoAsync(DB_FILE, { md5: true });
  if (fileInfo.exists && fileInfo.md5 === asset.hash) {
    console.log("Existing DB found");
    return;
  }

  const folderInfo = await FileSystem.getInfoAsync(DB_FOLDER);
  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(DB_FOLDER, { intermediates: true });
  }

  console.log("Loading DB from asset file");
  const result = await FileSystem.downloadAsync(
    Asset.fromModule(require("../../../assets/tree_data.db")).uri,
    DB_FILE
  );
  console.log("Loaded DB file");
}
