// components/MapCars.tsx

import { COORDINATES_API } from "@/app/APIs";
import apiClient from "@/app/services/api-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import search2 from "../../../../public/icons/search2.svg";

const carIcon = new L.Icon({
  iconUrl: "/images/locationPointRoad.png", // Assuming the car icon is stored in public
  iconSize: [26, 33], // Adjust size
  iconAnchor: [25, 25],
});

export interface StaffTracking {
  id: number;
  visitID: number;
  userID: number;
  latitude: string;
  longitude: string;
  createdAt: string;
}

const MapCarsComponent = () => {
  const [refresh, setRefresh] = useState(false);
  const [visitId, setVisitId] = useState(3);
  const [data, setData] = useState<StaffTracking[]>();
  const [error, setError] = useState("");
  // Fetch data from API
  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await apiClient.get(`${COORDINATES_API}/${visitId}`);
        setData(response.data.data);
      } catch (err) {
        setError("Failed to fetch data.");
      }
    };
    loadItems();
  }, [visitId]);
  const [position, setPosition] = useState<[number, number]>(); // Starting position (latitude, longitude)
  let [arrayIndex, setArrayIndex] = useState(1);
  const [transition, setTransition] = useState(true);
  const [path, setPath] = useState<[number, number][]>([
    [31.595181, 74.385725],
    [31.5950975, 74.3857307],
    [31.594839, 74.3857054],
    [31.5946391, 74.3858683],
    [31.5944101, 74.3860407],
    [31.5942604, 74.3859933],
    [31.5938827, 74.3861043],
    [31.5938066, 74.3865182],
    [31.5936273, 74.3870635],
    [31.5934235, 74.3879404],
    [31.5933343, 74.3882422],
  ]);
  const [position2, setPosition2] = useState<[number, number]>([
    31.59326, 74.388661,
  ]); // Starting position (latitude, longitude)
  let [arrayIndex2, setArrayIndex2] = useState(1);

  const [path2, setPath2] = useState<[number, number][]>([
    [31.59326, 74.388661],
    [31.59303, 74.388632],
    [31.592676, 74.388598],
    [31.592274, 74.388557],
    [31.591815, 74.38851],
    [31.591509, 74.388482],
    [31.591263, 74.388456],
    [31.591077, 74.388437],
    [31.590798, 74.38838],
    [31.590518, 74.388286],
    [31.590227, 74.388187],
  ]);

  const markerRef = useRef<L.Marker>(null);
  const markerRef2 = useRef<L.Marker>(null);
  const speed = 0.0001; // Adjust speed of car animation

  useEffect(() => {
    if (data) {
      setPosition([
        parseFloat(data[0].latitude),
        parseFloat(data[0].longitude),
      ]);
    }
    console.log("staff center", position);
  }, [data]);

  // useEffect(() => {
  //   // Dummy data for car movement animation
  //   const interval = setInterval(() => {
  //     setPosition((prevPosition) => {
  //       const [latA, lngA] = prevPosition;
  //       const [latB, lngB] = path[arrayIndex]; // Destination
  //       console.log("path with array index:", path[arrayIndex]);
  //       console.log("latA:", latA, "lngA", lngA);
  //       console.log("latB:", latB, "lngB", lngB);
  //       setArrayIndex(arrayIndex++);
  //       if (path.length - 1 === arrayIndex) {
  //         clearInterval(interval); // Stop movement when car reaches destination
  //         return prevPosition;
  //       }
  //       return [latB + speed, lngB + speed]; // Move towards Point B
  //     });
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [path]);

  // useEffect(() => {
  //   // Dummy data for car movement animation
  //   const interval = setInterval(() => {
  //     setPosition2((prevPosition) => {
  //       const [latA, lngA] = prevPosition;
  //       const [latB, lngB] = path2[arrayIndex2]; // Destination
  //       console.log("path with array index:", path2[arrayIndex2]);
  //       console.log("latA:", latA, "lngA", lngA);
  //       console.log("latB:", latB, "lngB", lngB);
  //       setArrayIndex2(arrayIndex2++);
  //       if (path2.length - 1 === arrayIndex2) {
  //         clearInterval(interval); // Stop movement when car reaches destination
  //         return prevPosition;
  //       }
  //       return [latB + speed, lngB + speed]; // Move towards Point B
  //     });
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [path]);

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
          zoom={12}
          style={{
            height: "780px",
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
          {/* <Polyline positions={path} color="blue" />
      <Polyline positions={path2} color="red" /> */}

          {/* Moving Car */}
          {/* <Marker position={position} icon={carIcon} ref={markerRef}>
        <Popup
          maxWidth={195}
          className="mapPopup"
          closeButton={false}
          offset={L.point(-12, -16)}
        >
          <CarCard />
        </Popup>
      </Marker> */}
          {/* {data && (
        <Marker
          position={[parseInt(data[0].latitude), parseInt(data[0].longitude)]}
          icon={carIcon}
          ref={markerRef}
        >
          <Popup
            maxWidth={195}
            className="mapPopup"
            closeButton={false}
            offset={L.point(0, -16)}
          >
            <CarCard latitude={data[0].latitude} />
          </Popup>
        </Marker>
      )} */}
          {data?.map((d: any, i) => (
            <Marker
              key={i}
              position={[d.latitude, d.longitude]}
              icon={carIcon}
              ref={markerRef2}
            >
              <Popup closeButton={false} offset={L.point(-10, -20)}>
                {/* <CarCard data={d} /> */}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </>
  );
};

export default MapCarsComponent;
