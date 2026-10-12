"use client";

import { TRACKING_API } from "@/app/APIs";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import MapWithMarkers from "./MapWithMarkers";

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

interface Position {
  lat: number;
  lng: number;
}

const RecordingCarTrackingMap = () => {
  const [open, setOpen] = useState(false);
  const initialCenterPosition = {
    lat: 31.1704,
    lng: 72.7097,
  };
  const [position, setPosition] = useState<Position>(); // Starting position (latitude, longitude)
  const [path, setPath] = useState<Position[]>([]); // Empty path initially
  const [direction, setDirection] = useState<string[]>([""]); // Empty path initially
  const [rotationAngle, setRotationAngle] = useState<number>(0); // Track rotation angle
  const [apiData, setAPIData] = useState<Tracking>();
  const [arrayIndex, setArrayIndex] = useState(0);

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

  const duration = 500; // Duration between each move (in ms)
  // Helper function to interpolate between two points
  const lerp = (start: number, end: number, t: number) => {
    return start + t * (end - start);
  };

  const moveCar = (from: Position, to: Position, duration: number) => {
    let start = Date.now();
    const step = () => {
      const now = Date.now();
      const elapsedTime = now - start;
      const t = Math.min(elapsedTime / duration, 1); // Ensure `t` is between 0 and 1

      const newLat = lerp(from.lat, to.lat, t);
      const newLng = lerp(from.lng, to.lng, t);

      setPosition({ lat: newLat, lng: newLng });

      if (t < 1) {
        requestAnimationFrame(step); // Continue moving until `t` reaches 1
      } else {
        // Move to the next point after reaching the current destination
        if (arrayIndex < path.length - 1) {
          setArrayIndex((prev) => prev + 1);
        }
      }
    };

    requestAnimationFrame(step); // Start the animation
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(TRACKING_API); // Replace with your API endpoint
        const data: Tracking = await response.json();
        setAPIData(data);
        const coordinatesList = data["GBB-062"]["coordnaties list"];
        if (coordinatesList.length > 0) {
          const newPath: Position[] = coordinatesList.map((coord) => ({
            lat: coord.lat,
            lng: coord.lon,
          }));
          const directions: string[] = coordinatesList.map(
            (coord) => coord.direction
          );
          setPath(newPath);
          setDirection(directions);
          setPosition({
            lat: coordinatesList[0].lat,
            lng: coordinatesList[0].lon,
          }); // Set initial position to the first coordinate
          setRotationAngle(getRotationAngle(coordinatesList[0].direction)); // Set initial rotation
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (path.length > 0 && arrayIndex < path.length - 1) {
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / 3000; // 1 second per movement
        const start = path[arrayIndex];
        const end = path[arrayIndex + 1];

        const lat = start.lat + (end.lat - start.lat) * progress;
        const lng = start.lng + (end.lng - start.lng) * progress;
        setPosition({ lat, lng });

        if (progress < 1) {
          requestAnimationFrame(animate); // Continue animation until progress is complete
        } else {
          setPosition(end); // Snap to end position at the end
          setRotationAngle(getRotationAngle(direction[arrayIndex + 1])); // Update rotation angle
          setArrayIndex((prevIndex) => prevIndex + 1); // Move to the next point
        }
      };

      requestAnimationFrame(animate);
    }
  }, [arrayIndex, path]);

  return (
    <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
      {position && apiData && (
        <div
          style={{
            width: "100%",
            height: "670px",
            border: 0,
            borderRadius: "10px",
            overflow: "hidden",
          }}
          className="shadow-sm mb-2"
        >
          <Map
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
            defaultZoom={17}
            // defaultCenter={position}
            center={{ lat: position.lat + 0.0015, lng: position.lng }}
            gestureHandling={"greedy"}
          >
            {/* <AdvancedMarker position={position} onClick={() => setOpen(!open)}>
              <div
                style={{
                  transform: `rotate(${rotationAngle}deg)`,
                  transition: "transform 2s",
                }}
              >
                <img
                  src="/images/carTop2.png"
                  alt="carTop2"
                  style={{ width: "56px", height: "70px" }}
                />
              </div>
            </AdvancedMarker>
            {open && (
              <InfoWindow
                position={position}
                pixelOffset={[0, -70]}
                onCloseClick={() => setOpen(false)}
              >
                {apiData && <CarCard apiData={apiData} />}
              </InfoWindow>
            )} */}
            <MapWithMarkers
              position={position}
              setOpen={setOpen}
              rotationAngle={rotationAngle}
              open={open}
              apiData={apiData}
            />
          </Map>
        </div>
      )}
    </APIProvider>
  );
};

export default RecordingCarTrackingMap;
