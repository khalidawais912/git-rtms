"use client";

import { TRACKING_API } from "@/app/APIs";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import CarCard from "../Map/CarCard";

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

const LiveCarTrackingMap = () => {
  const [open, setOpen] = useState(false);
  const initialCenterPosition = {
    lat: 31.1704,
    lng: 72.7097,
  };
  const [position, setPosition] = useState<Position>(); // Starting position (latitude, longitude)
  const [path, setPath] = useState<Position[]>([]); // Empty path initially
  const [direction, setDirection] = useState<string>("north"); // Empty path initially
  const [rotationAngle, setRotationAngle] = useState<number>(0); // Track rotation angle
  const [apiData, setAPIData] = useState<Tracking>();
  const [arrayIndex, setArrayIndex] = useState(0);

  const [isError, setError] = useState(false);

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
    // Function to fetch the latest coordinates from the API
    const fetchCoordinates = async () => {
      try {
        if (!isError) {
          const response = await fetch(TRACKING_API); // Replace with your API endpoint
          const data: Tracking = await response.json();
          setAPIData(data);
          // Get the coordinates from the response
          const coordinatesList = data["GBB-062"]["coordnaties list"];

          if (coordinatesList.length > 0) {
            const latestCoordinates: Position = {
              lat: coordinatesList[coordinatesList.length - 1].lat, // Get the last coordinate's latitude
              lng: coordinatesList[coordinatesList.length - 1].lon, // Get the last coordinate's longitude
            };
            const latestDirection: string =
              coordinatesList[coordinatesList.length - 1].direction;
            // Update the path with the latest coordinates
            if (
              path.length === 0 ||
              !path.some(
                (coord) =>
                  coord.lat === latestCoordinates.lat &&
                  coord.lng === latestCoordinates.lng
              )
            ) {
              setPath((prevPath) => [...prevPath, latestCoordinates]);
              setDirection(latestDirection);

              if (!position) {
                setPosition(latestCoordinates);
              }
            }
          }
        }
      } catch (error) {
        setError(true);
        console.error("Error fetching coordinates:", error);
      }
    };

    // Fetch coordinates every 3 seconds
    const interval = setInterval(() => {
      fetchCoordinates();
    }, 5000);

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, [path]);

  useEffect(() => {
    // Move the car if there are more points in the path
    if (arrayIndex < path.length) {
      const from = path[arrayIndex];
      const to = path[arrayIndex + 1];

      if (to) {
        moveCar(from, to, duration);
      }
    }
  }, [arrayIndex, path]);

  useEffect(() => {
    const newAngle = getRotationAngle(direction);

    // Only rotate if the new angle is different from the current angle
    if (Math.abs(newAngle - rotationAngle) > 1) {
      // Calculate the shortest rotation direction
      let angleDifference = (newAngle - rotationAngle + 360) % 360;
      if (angleDifference > 180) {
        angleDifference -= 360; // Rotate in the shorter direction
      }

      const stepDuration = 20; // Lower value means smoother and slower rotation
      let animationFrameId: number;

      const step = () => {
        setRotationAngle((prevAngle) => {
          // Calculate the next incremental rotation
          const newRotation = prevAngle + angleDifference * 0.05; // Adjust 0.05 to control rotation speed

          // Stop the rotation when it's close enough to the target
          if (Math.abs(newRotation - newAngle) < 1) {
            cancelAnimationFrame(animationFrameId);
            return newAngle; // Set to exact target angle when close
          }

          return newRotation; // Continue rotating
        });

        animationFrameId = requestAnimationFrame(step);
      };

      // Start the animation
      animationFrameId = requestAnimationFrame(step);

      // Cleanup to stop animation if component unmounts
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [direction, rotationAngle]);

  const map = useMap();

  const handleMarkerClick = (position: { lat: number; lng: number }) => {
    if (map) {
      map.setCenter(position); // Set the center to the clicked marker
      map.setZoom(12); // Adjust zoom level
    }
  };

  const MapWithMarkers = () => {
    const map = useMap();

    const handleMarkerClick = (position: { lat: number; lng: number }) => {
      if (map) {
        map.setCenter(position); // Set the center to the clicked marker
        map.setZoom(12); // Adjust zoom level
      }
    };

    return (
      <>
        {position && (
          <AdvancedMarker
            key={0}
            position={position}
            onClick={() => {
              setOpen(!open);
              handleMarkerClick(position);
            }}
          >
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
        )}
        {open && (
          <InfoWindow
            position={position}
            pixelOffset={[0, -70]}
            onCloseClick={() => setOpen(false)}
          >
            {apiData && <CarCard apiData={apiData} />}
          </InfoWindow>
        )}
      </>
    );
  };

  return (
    <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
      {position && (
        <div
          style={{
            width: "100%",
            height: "750px",
            border: 0,
            borderRadius: "10px",
            overflow: "hidden",
          }}
          className="shadow-sm mb-2"
        >
          <Map
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
            defaultZoom={17}
            center={{ lat: position.lat + 0.0015, lng: position.lng }}
            gestureHandling={"greedy"}
          >
            <AdvancedMarker
              position={position}
              onClick={() => {
                setOpen(!open);
                handleMarkerClick(position);
              }}
              clickable={true}
            >
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
            )}
            {/* <MapWithMarkers
              position={position}
              setOpen={setOpen}
              rotationAngle={rotationAngle}
              open={open}
              apiData={apiData}
            /> */}
          </Map>
        </div>
      )}
    </APIProvider>
  );
};

export default LiveCarTrackingMap;
