export interface VehicleData {
  GpsTime: string;
  Latitude: number;
  Longitude: number;
  Speed: number;
  Ignition: string;
  Distance: number;
  ["Fuel burned"]: number;
  Direction: string;
}

export interface VehicleTrackingRecording {
  [vehicleNumber: string]: VehicleData[];
}
