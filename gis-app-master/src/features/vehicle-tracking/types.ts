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

export interface AvailableDrivers {
  driverId: number;
  visitId: number;
  driverName: string;
  driverNo: string;
  driverImage: string;
  vehicleName: string;
  vehicleColor: string;
  vehicleNumber: string;
}

export interface Tracking {
  ["GBB-062"]: {
    Vehicle_Make: string;
    Vehicle_Model: string;
    Vehicle_Device: string;
    Vehicle_DeviceSerial: string;
    ["Distance traveled"]: number;
    ["Fuel burned"]: number;
    ["Engine value"]: string;
    ["Geofence values"]: number;
    ["coordnaties list"]: [
      {
        lat: number;
        lon: number;
        direction: string;
      }
    ];
    Date_time: string;
    Latitude: number;
    Longitude: number;
    Speed: number;
    Ignition: string;
    Address: string;
    ["Last Ignition Off Time"]: string;
    ["Last Ignition Location"]: string;
    ["First Ignition On Time"]: string;
    ["First Ignition Location"]: string;
  };
}

export interface Position {
  lat: number;
  lng: number;
}

export interface AvailableVehicles {
  vehicleId: number;
  name: string;
  description: string;
  vehicleNumber: string;
  model: string;
  color: string;
  trasnmission: string;
  seatsCapacity: number;
  fuelType: string;
  vehicleImage: string;
  vehicleIcon: string;
  vehicleSatus: string;
}
