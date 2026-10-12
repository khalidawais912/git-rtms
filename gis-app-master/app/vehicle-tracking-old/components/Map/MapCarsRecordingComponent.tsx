import { TRACKING_API } from "@/app/APIs";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import CarCard from "./CarCard";

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

const getRotationAngle = (direction: string): number => {
  switch (direction?.toLocaleLowerCase()) {
    case "north":
      return 0;
    case "north east":
      return 45;
    case "east":
      return 90;
    case "south east":
      return 135;
    case "south":
      return 180;
    case "south west":
      return 225;
    case "west":
      return 270;
    case "north west":
      return 315;
    default:
      return 0;
  }
};

const getRotatedCarIcon = (rotationAngle: number) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="transform: rotate(${rotationAngle}deg);">
    <Image src="/images/carTop2.png" width="70" height="56"/>
    </div>`,
    iconSize: [70, 56],
    iconAnchor: [35, 28],
  });

const MapCarsRecordingComponent = () => {
  const [position, setPosition] = useState<[number, number]>();
  const [path, setPath] = useState<[number, number][]>([]);
  const [direction, setDirection] = useState<string>("north");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [apiData, setAPIData] = useState<Tracking>();
  const markerRef = useRef<L.Marker>(null);
  const duration = 500; // Duration for moving to the next point (in ms)

  const lerp = (start: number, end: number, t: number) => {
    return start + t * (end - start);
  };

  const moveCar = (to: [number, number], duration: number) => {
    const from = position;

    if (!from) return;

    let start = Date.now();
    const step = () => {
      const now = Date.now();
      const elapsedTime = now - start;
      const t = Math.min(elapsedTime / duration, 1);

      const newLat = lerp(from[0], to[0], t);
      const newLng = lerp(from[1], to[1], t);

      setPosition([newLat, newLng]);

      if (t < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  // Fetch coordinates from the API once
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(TRACKING_API);
        const data: Tracking = await response.json();
        setAPIData(data);

        const coordinatesList = data["GBB-062"]["coordnaties list"];
        if (coordinatesList.length > 0) {
          const newPath: [number, number][] = coordinatesList.map((coord) => [
            coord.lat,
            coord.lon,
          ]);
          setPath(newPath);
          setPosition([coordinatesList[0].lat, coordinatesList[0].lon]); // Set initial position to the first coordinate
          setDirection(coordinatesList[0].direction);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, []); // Fetch only once on mount

  // Move the car along the path
  useEffect(() => {
    if (path.length > 0 && position) {
      const currentIndex = path.findIndex(
        (coord) => coord[0] === position[0] && coord[1] === position[1]
      );

      if (currentIndex !== -1 && currentIndex < path.length - 1) {
        const nextPoint = path[currentIndex + 1]; // Get the next point

        moveCar(nextPoint, duration); // Move the car
      }
    }
  }, [position, path]); // Trigger when position or path changes

  // Rotate the car icon based on the direction
  useEffect(() => {
    if (direction) {
      const newAngle = getRotationAngle(direction);
      setRotationAngle(newAngle);
    }
  }, [direction]);

  return (
    <>
      {position && (
        <MapContainer
          center={position}
          zoom={17}
          style={{
            height: "670px",
            width: "100%",
            border: 0,
            borderRadius: "10px",
          }}
          className="shadow-sm mb-2"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Polyline positions={path} color="blue" />
          <Marker
            position={position}
            icon={getRotatedCarIcon(rotationAngle)}
            ref={markerRef}
          >
            <Popup
              maxWidth={195}
              className="mapPopup"
              closeButton={false}
              offset={L.point(0, -16)}
            >
              {apiData && <CarCard apiData={apiData} />}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </>
  );
};

export default MapCarsRecordingComponent;
