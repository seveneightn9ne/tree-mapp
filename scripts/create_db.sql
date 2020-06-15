-- Reads the street tree data csv into a sqlite db
-- Usage:
-- Get csv from https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/uvpi-gqnh
-- $ sqlite3 assets/tree_data.db
-- sqlite> .read scripts/create_db.sql

create table trees (
  "tree_id" INTEGER PRIMARY KEY,
  "block_id" INTEGER,
  "created_at" TEXT,
  "tree_dbh" INTEGER,
  "stump_diam" INTEGER,
  "curb_loc" TEXT,
  "status" TEXT,
  "health" TEXT,
  "spc_latin" TEXT,
  "spc_common" TEXT,
  "steward" TEXT,
  "guards" TEXT,
  "sidewalk" TEXT,
  "user_type" TEXT,
  "problems" TEXT,
  "root_stone" TEXT,
  "root_grate" TEXT,
  "root_other" TEXT,
  "trunk_wire" TEXT,
  "trnk_light" TEXT,
  "trnk_other" TEXT,
  "brch_light" TEXT,
  "brch_shoe" TEXT,
  "brch_other" TEXT,
  "address" TEXT,
  "postcode" INTEGER,
  "zip_city" TEXT,
  "community board" INTEGER,
  "borocode" INTEGER,
  "borough" TEXT,
  "cncldist" INTEGER,
  "st_assem" INTEGER,
  "st_senate" INTEGER,
  "nta" TEXT,
  "nta_name" TEXT,
  "boro_ct" INTEGER,
  "state" TEXT,
  "latitude" REAL,
  "longitude" REAL,
  "x_sp" REAL,
  "y_sp" REAL,
  "council district" INTEGER,
  "census tract" INTEGER,
  "bin" INTEGER,
  "bbl" INTEGER
) WITHOUT ROWID;

.mode csv
.import /Users/jessk/git/tree-mapp/assets/2015_Street_Tree_Census_-_Tree_Data.csv trees

BEGIN TRANSACTION;
CREATE TEMPORARY TABLE trees_lite(
    tree_id INTEGER,
    tree_dbh INTEGER,
    status TEXT,
    health TEXT,
    spc_latin TEXT,
    spc_common TEXT,
    address TEXT,
    postcode INTEGER,
    latitude REAL,
    longitude REAL
    );
INSERT INTO trees_lite SELECT tree_id, tree_dbh, status, health, spc_latin, spc_common, address, postcode, latitude, longitude FROM trees;
DROP TABLE trees;
CREATE TABLE trees(
    tree_id INTEGER,
    tree_dbh INTEGER,
    status TEXT,
    health TEXT,
    spc_latin TEXT,
    spc_common TEXT,
    address TEXT,
    postcode INTEGER,
    latitude REAL,
    longitude REAL
);
INSERT INTO trees SELECT tree_id, tree_dbh, status, health, spc_latin, spc_common, address, postcode, latitude, longitude FROM trees_lite;
DROP TABLE trees_lite;

CREATE INDEX index_pos on trees (latitude, longitude);

COMMIT;

VACUUM;
