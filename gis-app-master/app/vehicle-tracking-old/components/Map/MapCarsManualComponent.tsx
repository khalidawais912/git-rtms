"use client";
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
import carTop2 from "../../../../public/images/carTop2.png";
import CarCard from "./CarCard";
import { Tracking } from "./MapCarsComponent";

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
    <img src=${carTop2.src} width="70" height="56"/>
    </div>`,
    iconSize: [70, 56],
    iconAnchor: [35, 28], // center the icon
  });

const MapCarsManualComponent = () => {
  const [position, setPosition] = useState<[number, number]>([
    31.4589, 74.2631966,
  ]); // Starting position
  const [apiData, setAPIData] = useState<Tracking>();
  const [direction, setDirection] = useState<string[]>([""]); // Empty path initially
  const [rotationAngle, setRotationAngle] = useState<number>(0); // Track rotation angle
  const [arrayIndex, setArrayIndex] = useState<number>(0);
  const [path, setPath] = useState<[number, number][]>([]);

  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(TRACKING_API); // Replace with your API endpoint
        const data: Tracking = await response.json();
        setAPIData(data);
        const coordinatesList = data["GBB-062"]["coordnaties list"];
        if (coordinatesList.length > 0) {
          const newPath: [number, number][] = coordinatesList.map((coord) => [
            coord.lat,
            coord.lon,
          ]);
          const directions: string[] = coordinatesList.map(
            (coord) => coord.direction
          );
          setPath(newPath);
          setDirection(directions);
          setPosition([coordinatesList[0].lat, coordinatesList[0].lon]); // Set initial position to the first coordinate
          setRotationAngle(getRotationAngle(coordinatesList[0].direction)); // Set initial rotation
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  // Move the car based on the path at a fixed interval
  useEffect(() => {
    if (path.length > 0 && arrayIndex < path.length) {
      const interval = setInterval(() => {
        setPosition(path[arrayIndex]); // Move car to the next point
        setRotationAngle(getRotationAngle(direction[arrayIndex])); // Set rotation based on direction
        setArrayIndex((prevIndex) => prevIndex + 1); // Move to the next point

        if (arrayIndex >= path.length - 1) {
          clearInterval(interval); // Stop the movement when reaching the last point
        }
      }, 1000); // Change position every 1 second (adjust as needed)

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [path, direction, arrayIndex]);

  return (
    <div className="position-relative">
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
    </div>
  );
};

export default MapCarsManualComponent;
