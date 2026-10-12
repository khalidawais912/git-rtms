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
import toast, { Toaster } from "react-hot-toast";

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
  const initialCenterPosition = {
    lat: 31.1704,
    lng: 72.7097,
  };

  return (
    <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
      {initialCenterPosition && (
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
            defaultCenter={initialCenterPosition}
            gestureHandling={"greedy"}
          >
            {/* <AdvancedMarker
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
            </AdvancedMarker> */}
            {/* {open && (
              <InfoWindow
                position={position}
                pixelOffset={[0, -70]}
                onCloseClick={() => setOpen(false)}
              >
                {apiData && <CarCard apiData={apiData} />}
              </InfoWindow>
            )} */}
            <MapWithMarkers />
          </Map>
        </div>
      )}
    </APIProvider>
  );
};

const MapWithMarkers = () => {
  const map = useMap();

  const [open, setOpen] = useState(false);
  const [hasCenteredMap, setHasCenteredMap] = useState(false); // To track map centering

  const [position, setPosition] = useState<Position>(); // Starting position (latitude, longitude)
  const [path, setPath] = useState<Position[]>([]); // Empty path initially
  const [direction, setDirection] = useState<string>("north"); // Empty path initially
  const [rotationAngle, setRotationAngle] = useState<number>(0); // Track rotation angle
  const [apiData, setAPIData] = useState<Tracking>();
  const [arrayIndex, setArrayIndex] = useState(0);

  const [isError, setError] = useState(false);

  const [followCar, setFollowCar] = useState(false); // Follow mode flag
  const [initialCenterDone, setInitialCenterDone] = useState(false); // Initial centering flag

  // Function to toggle follow mode
  const toggleFollowMode = () => setFollowCar((prev) => !prev);

  useEffect(() => {
    if (map && position) {
      // Initial centering only once
      if (!initialCenterDone) {
        map.setCenter(position);
        map.setZoom(12);
        setInitialCenterDone(true);
      }

      // Follow car if enabled
      if (followCar) {
        map.setCenter(position);
      }
    }
  }, [map, position, followCar, initialCenterDone]);

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
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newLat = lerp(from.lat, to.lat, progress);
      const newLng = lerp(from.lng, to.lng, progress);
      setPosition({ lat: newLat, lng: newLng });

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (arrayIndex < path.length - 1) {
          setArrayIndex((prev) => prev + 1);
        }
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (!map) return;

    const fetchCoordinates = async () => {
      try {
        const response = await fetch(TRACKING_API);
        const data: Tracking = await response.json();
        setAPIData(data);
        const coordinatesList = data["GBB-062"]["coordnaties list"];
        if (coordinatesList.length > 0) {
          const latestCoordinates = {
            lat: coordinatesList[coordinatesList.length - 1].lat,
            lng: coordinatesList[coordinatesList.length - 1].lon,
          };
          const latestDirection =
            coordinatesList[coordinatesList.length - 1].direction;

          if (
            !path.length ||
            path[path.length - 1]?.lat !== latestCoordinates.lat ||
            path[path.length - 1]?.lng !== latestCoordinates.lng
          ) {
            setPath((prevPath) => [...prevPath, latestCoordinates]);
            setDirection(latestDirection);
            if (!position) setPosition(latestCoordinates);
          }
        }
      } catch (error) {
        setError(true);
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates(); // Fetch initially
    const interval = setInterval(fetchCoordinates, 5000);

    return () => clearInterval(interval);
  }, [map]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch coordinates.");
    }
  }, [isError]);

  useEffect(() => {
    if (!map || arrayIndex >= path.length - 1) return;

    const from = path[arrayIndex];
    const to = path[arrayIndex + 1];

    if (from && to) {
      moveCar(from, to, duration);
    }
  }, [arrayIndex, path, map]);

  useEffect(() => {
    if (!map) return;

    const newAngle = getRotationAngle(direction);

    if (Math.abs(newAngle - rotationAngle) > 1) {
      const stepDuration = 20;
      let animationFrameId: number;

      const step = () => {
        setRotationAngle((prevAngle) => {
          const angleDifference =
            (newAngle - prevAngle + 360) % 360 > 180
              ? ((newAngle - prevAngle + 360) % 360) - 360
              : (newAngle - prevAngle + 360) % 360;

          const nextRotation = prevAngle + angleDifference * 0.05;

          if (Math.abs(nextRotation - newAngle) < 1) {
            cancelAnimationFrame(animationFrameId);
            return newAngle;
          }
          return nextRotation;
        });

        animationFrameId = requestAnimationFrame(step);
      };

      animationFrameId = requestAnimationFrame(step);

      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [direction, rotationAngle, map]);

  const handleMarkerClick = debounce(
    (position: { lat: number; lng: number }) => {
      if (map) {
        map.setCenter(position);
        map.setZoom(12);
      }
    },
    300
  ); // Adjust debounce timing as needed

  // const handleMarkerClick = () => {
  //   toggleFollowMode();
  // };

  // Debounce utility
  function debounce(fn: Function, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  return (
    <>
      <div>
        <Toaster />
      </div>
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

export default LiveCarTrackingMap;
