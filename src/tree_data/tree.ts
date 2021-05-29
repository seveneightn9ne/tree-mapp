type Status = "Alive" | "Dead" | "Stump";
type Health = "" | "Good" | "Fair" | "Poor";
export interface Tree {
  tree_id: number;
  diameter: number;
  latitude: number;
  longitude: number;
  status: Status;
  health: Health;
  address: string;
  postcode: number;
  spc_latin: string;
  spc_common: string;
}
