// import { useEffect, useRef, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   Popup,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// // import carIconUrl from "/images/carTop2.png"; // Add a car icon to show on the map
// import CarCard from "./CarCard";
// import axios from "axios";

// const carIcon = new L.Icon({
//   iconUrl: "/images/carTop2.png",
//   iconSize: [70, 70], // Adjust size
//   iconAnchor: [35, 35], // Center of the icon
// });

// interface Tracking {
//   ["GBB-062"]: {
//     "coordnaties list": [
//       {
//         lat: number;
//         lon: number;
//       }
//     ];
//   };
// }

// const MapCarsComponent = () => {
//   const [position, setPosition] = useState<[number, number]>([
//     31.4589, 4.2631966,
//   ]); // Starting position (latitude, longitude)
//   const [arrayIndex, setArrayIndex] = useState(0);
//   const [path, setPath] = useState<[number, number][]>([]);
//   const [error, setError] = useState("");
//   const [data, setData] = useState<Tracking | null>(null);

//   // Fetch data from API
//   useEffect(() => {
//     const loadItems = async () => {
//       try {
//         const response = await axios.get("/api/TRACKING_API");
//         setData(response.data);
//       } catch (err) {
//         setError("Failed to fetch data.");
//       }
//     };
//     loadItems();
//   }, []);

//   // Parse and set the position and path from the data
//   useEffect(() => {
//     if (data && data["GBB-062"] && data["GBB-062"]["coordnaties list"]) {
//       const coordinatesList = data["GBB-062"]["coordnaties list"];
//       if (coordinatesList.length > 0) {
//         const firstCoordinate = coordinatesList[0];
//         setPosition([firstCoordinate.lat, firstCoordinate.lon]);

//         const pathCoordinates = coordinatesList.map(
//           (coord) => [coord.lat, coord.lon] as [number, number]
//         );
//         setPath(pathCoordinates);
//       }
//     }
//   }, [data]);

//   // Animate the car movement along the path
//   useEffect(() => {
//     if (path.length > 1 && arrayIndex < path.length) {
//       const interval = setInterval(() => {
//         setPosition((prevPosition) => {
//           const [latB, lngB] = path[arrayIndex]; // Destination
//           setArrayIndex((prevIndex) => prevIndex + 1); // Update index

//           if (arrayIndex >= path.length - 1) {
//             clearInterval(interval); // Stop when reaching the end
//           }

//           // Update position to the next destination
//           return [latB, lngB];
//         });
//       }, 5000); // Adjust speed

//       return () => clearInterval(interval);
//     }
//   }, [path, arrayIndex]);

//   return (
//     <MapContainer
//       center={position}
//       zoom={17}
//       style={{
//         height: "670px",
//         width: "100%",
//         borderRadius: "10px",
//       }}
//       className="shadow-sm mb-2"
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />

//       {/* Draw the path if available */}
//       {path.length > 1 && <Polyline positions={path} color="blue" />}

//       {/* Moving Car */}
//       <Marker position={position} icon={carIcon}>
//         <Popup>
//           <CarCard />
//         </Popup>
//       </Marker>
//     </MapContainer>
//   );
// };

// export default MapCarsComponent;
