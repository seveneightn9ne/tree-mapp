import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

export const DB_FOLDER = `${FileSystem.documentDirectory}SQLite`;
export const DB_FILE = `tree_data.db`;
export const DB_PATH = `${DB_FOLDER}/${DB_FILE}`;

export async function withDatabaseTxn<T>(
  cb: (
    tx: SQLite.SQLTransaction,
    resolve: (t?: T) => void,
    reject: (e: any) => void
  ) => void
): Promise<T> {
  console.log("withDatabaseTxn");
  const db = SQLite.openDatabase(DB_FILE);

  return new Promise<T>((resolve, reject) => {
    try {
      db.transaction(
        (tx) => {
          console.log("in txn, b4 callback");
          cb(tx, resolve, reject);
          console.log("in txn, after callback");
        },

        (error) => {
          console.log("in error handler");
          reject(new Error("SQL error: " + error));
        }
      );
    } catch (e) {
      console.log("caught exception in txn");
      reject(e);
    }
  }).finally(() => {
    console.log("in finally - closing");
    try {
      //(db as any)._db.close();
    } catch (e) {
      console.log("ignoring", e);
      // ignore
    }
  });
}

export type ResultWithArray = SQLite.SQLResultSet & {
  rows: { _array: unknown[] };
};
