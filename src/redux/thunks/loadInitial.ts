import * as Font from "expo-font";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

import uiSlice from "../slices/ui";
import { TMThunkAction, TMThunkDispatch, t } from "../types";
import { withDatabaseTxn, DB_PATH, DB_FOLDER } from "../../tree_data/sqlite";

const { setLoaded } = uiSlice.actions;

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
  const fileInfo = await FileSystem.getInfoAsync(DB_PATH);
  if (fileInfo.exists) {
    // Test the db to see if it works
    try {
      await withDatabaseTxn((tx, resolve, reject) => {
        tx.executeSql(
          "select count(*) from trees",
          [],
          () => {
            resolve();
          },
          (err) => {
            reject(err);
            return true;
          }
        );
      });
      console.log("The existing DB looks good");
      return;
    } catch (e) {
      console.log("Removing existing DB", e);
      await FileSystem.deleteAsync(DB_PATH, { idempotent: true });
      await FileSystem.deleteAsync(`${DB_PATH}-journal`, { idempotent: true });
    }
  }

  const folderInfo = await FileSystem.getInfoAsync(DB_FOLDER);
  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(DB_FOLDER, { intermediates: true });
  }

  console.log("Loading DB from asset file");
  const { uri } = await FileSystem.downloadAsync(
    Asset.fromModule(require("../../../assets/tree_data.db")).uri,
    DB_PATH
  );
  console.log("Loaded DB file: " + uri);
}
