"use client";

import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StaffTracking } from "../StaffTracking";

interface Props {
  setGoogleDuration: Dispatch<SetStateAction<string | undefined>>;
  recordingData: StaffTracking[];
}

const TimelineAuto = ({ setGoogleDuration, recordingData }: Props) => {
  const position = { lat: 31.5638102, lng: 74.3245938 };

  return (
    <div
      style={{
        height: "50vh",
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
        <Map
          defaultCenter={position}
          defaultZoom={9}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
          fullscreenControl={false}
        >
          <Directions
            setGoogleDuration={setGoogleDuration}
            recordingData={recordingData}
          />
        </Map>
      </APIProvider>
    </div>
  );
};

export default TimelineAuto;

interface DirectionProps {
  setGoogleDuration: Dispatch<SetStateAction<string | undefined>>;
  recordingData: StaffTracking[];
}

function Directions({ setGoogleDuration, recordingData }: DirectionProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();

  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!routesLibrary || !map) return;

    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        map,
        polylineOptions: {
          strokeColor: "#16800a", // Change this to your desired color
          strokeOpacity: 0.8,
          strokeWeight: 6,
        },
      })
    );
  }, [routesLibrary, map, recordingData]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin: {
          lat: parseFloat(recordingData[0]?.coordinates[0]?.latitude),
          lng: parseFloat(recordingData[0]?.coordinates[0]?.longitude),
        },
        destination: {
          lat: parseFloat(
            recordingData[0]?.coordinates[
              recordingData[0]?.coordinates?.length - 1
            ]?.latitude
          ),
          lng: parseFloat(
            recordingData[0]?.coordinates[
              recordingData[0]?.coordinates?.length - 1
            ]?.longitude
          ),
        },
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });
  }, [directionsService, directionsRenderer]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  setGoogleDuration(leg.duration?.text); // Send duration to parent
  return (
    <div
      className="col-auto position-absolute p-2"
      style={{
        bottom: "10px",
        left: "10px",
        color: "#D0D0D0",
        backgroundColor: "rgba(28, 28, 29, 0.86)",
        borderRadius: "10px",
      }}
    >
      {/* <h2>{selected.summary}</h2> */}
      {/* <Button
        className="btn btn-sm btn-info my-2"
        onClick={() => setShowFullAddress(!showFullAddress)}
      >
        {showFullAddress ? "Show Short Address" : "Show Full Address"}
      </Button>
      {showFullAddress ? (
        <p>
          {leg.start_address} To {leg.end_address}
        </p>
      ) : (
        <p>
          {leg.start_address.split(",")[0]} To {leg.end_address.split(",")[0]}
        </p>
      )} */}
      <p className="m-0 f-6">Distance: {leg.distance?.text}</p>
      <p className="m-0 f-6">Duration: {leg.duration?.text}</p>

      {/* <h2>Other Routes</h2>
      <ul>
        {routes.map((route, index) => (
          <li key={route.summary} className="mb-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setRouteIndex(index)}
            >
              {route.summary}
            </button>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
