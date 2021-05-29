import { LatLng } from "react-native-maps";

import { Tree } from "./tree";
import { ResultWithArray, withDatabaseTxn } from "./sqlite";

export enum GetTreesError {
  ErrTooManyTrees = "ErrTooManyTrees",
}

const MAX_TREES = 5000;

export interface Area {
  northEast: LatLng;
  southWest: LatLng;
}

export default async function getTreesInArea(
  area: Area
): Promise<Array<Tree> | GetTreesError> {
  // Latitude around 40
  // Longitude around -74
  // SouthWest closest to 0,0
  const minLat = area.southWest.latitude;
  const maxLat = area.northEast.latitude;
  const minLong = area.southWest.longitude;
  const maxLong = area.northEast.longitude;

  return withDatabaseTxn<Tree[] | GetTreesError>((tx, resolve) => {
    tx.executeSql(
      "select * from trees where latitude > ? and latitude < ? and longitude > ? and longitude < ? limit ?",
      [minLat, maxLat, minLong, maxLong, MAX_TREES],
      (_tx, result) => {
        console.log("Got trees: " + result.rows.length);
        if (result.rows.length == MAX_TREES) {
          resolve(GetTreesError.ErrTooManyTrees);
          return;
        }
        const trees: Tree[] = [];
        (result as ResultWithArray).rows._array.forEach((row: any) =>
          trees.push({
            tree_id: row.tree_id,
            diameter: row.tree_dbh,
            latitude: row.latitude,
            longitude: row.longitude,
            status: row.status,
            health: row.health,
            address: row.address,
            postcode: row.postcode,
            spc_latin: row.spc_latin,
            spc_common: row.spc_common,
          })
        );
        console.log(trees.length + " trees");
        resolve(trees);
      }
    );
  });
}
