"use client";
import { COORDINATES_API } from "@/app/APIs";
import apiClient from "@/app/services/api-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import search2 from "../../../../public/icons/search2.svg";

export interface StaffTracking {
  id: number;
  visitID: number;
  userID: number;
  latitude: string;
  longitude: string;
  createdAt: string;
}

const getRotationAngle = (direction: string): number => {
  switch (direction.toLocaleLowerCase()) {
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
    <Image src="/images/locationPointRoadBig.png" width="70" height="70"/>
    </div>`,
    iconSize: [70, 56],
    iconAnchor: [35, 28], // center the icon
  });

const carIcon = new L.Icon({
  iconUrl: "/images/locationPointRoad.png",
  iconSize: [70, 56], // Adjust size
  iconAnchor: [25, 25],
});

const MapCarsComponent = () => {
  const [position, setPosition] = useState<[number, number]>(); // Starting position (latitude, longitude)
  const [path, setPath] = useState<[number, number][]>([]); // Empty path initially
  const [direction, setDirection] = useState<string>("north"); // Empty path initially
  const [rotationAngle, setRotationAngle] = useState<number>(0); // Track rotation angle
  // const [apiData, setAPIData] = useState<Tracking>();
  const [arrayIndex, setArrayIndex] = useState(0);
  const markerRef = useRef<L.Marker>(null);
  const duration = 500; // Duration between each move (in ms)
  // Helper function to interpolate between two points
  const lerp = (start: number, end: number, t: number) => {
    return start + t * (end - start);
  };

  const moveCar = (
    from: [number, number],
    to: [number, number],
    duration: number
  ) => {
    let start = Date.now();
    const step = () => {
      const now = Date.now();
      const elapsedTime = now - start;
      const t = Math.min(elapsedTime / duration, 1); // Ensure `t` is between 0 and 1

      const newLat = lerp(from[0], to[0], t);
      const newLng = lerp(from[1], to[1], t);

      setPosition([newLat, newLng]);

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
  const [data, setData] = useState<StaffTracking[]>();
  const [visitId, setVisitId] = useState(1);

  useEffect(() => {
    // Function to fetch the latest coordinates from the API
    const fetchCoordinates = async () => {
      try {
        const response = await apiClient.get(`${COORDINATES_API}/${visitId}`);
        setData(response.data.data);
        // Get the coordinates from the response
        const coordinatesList = response.data.data;

        if (coordinatesList) {
          const latestCoordinates: [number, number] = [
            parseFloat(coordinatesList[coordinatesList.length - 1].latitude), // Get the last coordinate's latitude
            parseFloat(coordinatesList[coordinatesList.length - 1].longitude), // Get the last coordinate's longitude
          ];

          // Update the path with the latest coordinates
          if (
            path.length === 0 ||
            !path.some(
              (coord) =>
                coord[0] === latestCoordinates[0] &&
                coord[1] === latestCoordinates[1]
            )
          ) {
            setPath((prevPath) => [...prevPath, latestCoordinates]);
            // setDirection(data["GBB-062"].Direction);

            if (!position) {
              setPosition(latestCoordinates);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    // Fetch coordinates every 3 seconds
    const interval = setInterval(() => {
      fetchCoordinates();
    }, 3000);

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, [path, visitId]);

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

  return (
    <>
      <div className="row">
        <div className="col fw-bold" style={{ fontSize: "1.5rem" }}>
          Maps
        </div>
        <div className="col">
          <div className="row d-flex justify-content-center mb-2">
            <div className="col">
              <div className="input-group">
                <span
                  className="input-group-text pe-0 border-0 rounded-end rounded-pill"
                  id="basic-addon1"
                  style={{ background: "#E0EEFC" }}
                >
                  <Image
                    src={search2}
                    alt="search2"
                    width={20}
                    height={20}
                    style={{
                      color: "#7e7e7e !important",
                    }}
                  />
                </span>
                <input
                  type="number"
                  className="form-control border-0 rounded-start rounded-pill p-3"
                  style={{ background: "#E0EEFC" }}
                  id="username"
                  placeholder="Search by Visit Id"
                  onChange={(e) => setVisitId(parseInt(e.target.value))}
                  value={visitId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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

          {/* Moving Car */}
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
              {/* {data && <VisitCard data={data[0]} />} */}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </>
  );
};

export default MapCarsComponent;
