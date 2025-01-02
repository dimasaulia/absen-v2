export type LocationResponse = {
  location_id: number;
  name: string;
  lokasi: string;
  alamat: string;
  state: string;
  provinsi: string;
};

export type AddLocationRequest = {
  name: string;
  lokasi: string;
  alamat: string;
  state: string;
  provinsi: string;
};
