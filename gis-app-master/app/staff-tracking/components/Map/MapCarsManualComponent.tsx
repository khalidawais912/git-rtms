"use client";
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
// import carIconUrl from "/images/carTop.png"; // Add a car icon to show on the map
import { COORDINATES_API } from "@/app/APIs";
import apiClient from "@/app/services/api-client";
import Image from "next/image";
import search2 from "../../../../public/icons/search2.svg";
import { StaffTracking } from "./MapCarsComponent";

const carIcon = new L.Icon({
  iconUrl: "/images/locationPointRoadBig.png",
  iconSize: [60, 70], // Adjust size
  iconAnchor: [25, 25],
});

const MapCarsManualComponent = () => {
  const [position, setPosition] = useState<[number, number]>([
    31.4589, 74.2631966,
  ]); // Starting position (latitude, longitude)

  const [arrayIndex, setArrayIndex] = useState(1);
  const [path, setPath] = useState<[number, number][]>([]);

  const markerRef = useRef<L.Marker>(null);
  const speed = 0.0001; // Adjust speed of car animation
  const duration = 2000; // Duration between each move (in ms)
  const [visitId, setVisitId] = useState(3);
  const [data, setData] = useState<StaffTracking[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${COORDINATES_API}/${visitId}`);
        setData(response.data.data);
        console.log("staff", response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [visitId]);

  useEffect(() => {
    if (data) {
      const newPath: [number, number][] = data?.map((coord) => [
        parseFloat(coord.latitude),
        parseFloat(coord.longitude),
      ]);
      setPath(newPath);
      setPosition([
        parseFloat(data[0].latitude),
        parseFloat(data[0].longitude),
      ]); // Set initial position to the first coordinate
      console.log(data);
    }
  }, [data]);

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

      {data && path && (
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
          {/* Draw the line from Point A to Point B */}
          <Polyline positions={path} color="blue" />

          {/* Moving Car */}
          <Marker position={position} icon={carIcon} ref={markerRef}>
            <Popup
              maxWidth={195}
              className="mapPopup"
              closeButton={false}
              offset={L.point(0, -16)}
            >
              {/* {data && <CarCard data={data[0]} />} */}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </>
  );
};

export default MapCarsManualComponent;
