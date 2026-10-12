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
    <Image src="/images/carTop2.png" width="70" height="56"/>
    </div>`,
    iconSize: [70, 56],
    iconAnchor: [35, 28], // center the icon
  });

const carIcon = new L.Icon({
  iconUrl: "/images/carTop2.png",
  iconSize: [70, 56], // Adjust size
  iconAnchor: [25, 25],
});

const MapCarsRecordedComponent = () => {
  const [position, setPosition] = useState<[number, number]>(); // Starting position (latitude, longitude)
  const [path, setPath] = useState<[number, number][]>([]); // Empty path initially
  const [direction, setDirection] = useState<string>("north"); // Empty path initially
  const [rotationAngle, setRotationAngle] = useState<number>(0); // Track rotation angle
  const [arrayIndex, setArrayIndex] = useState(0);
  const markerRef = useRef<L.Marker>(null);
  const duration = 500; // Duration between each move (in ms)
  const [data, setData] = useState<StaffTracking[]>();
  const [visitId, setVisitId] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${COORDINATES_API}/${visitId}`);
        setData(response.data.data);
        if (data) {
          const newPath: [number, number][] = data.map((coord) => [
            parseFloat(coord.latitude),
            parseFloat(coord.longitude),
          ]);
          setPath(newPath);
          setPosition([
            parseFloat(data[0].latitude),
            parseFloat(data[0].longitude),
          ]); // Set initial position to the first coordinate
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

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

  useEffect(() => {
    if (arrayIndex < path.length - 1) {
      moveCar(path[arrayIndex - 1], path[arrayIndex], duration);
    }
  }, [path, arrayIndex]);

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
              {/* {apiData && <CarCard data={d} />} */}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </>
  );
};

export default MapCarsRecordedComponent;
