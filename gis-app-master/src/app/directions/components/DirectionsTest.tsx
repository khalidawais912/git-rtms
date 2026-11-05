"use client";

import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import React, { useEffect, useState } from "react";

const DirectionsTest = () => {
  const position = { lat: 43.6532, lng: -79.3832 };
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
        <Map
          defaultCenter={position}
          defaultZoom={9}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
          fullscreenControl={false}
        >
          <Directions />
        </Map>
      </APIProvider>
    </div>
  );
};

export default DirectionsTest;

function Directions() {
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
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin: "100 Front St, Toronto ON",
        destination: "500 College St, Toronto ON",
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

  return (
    <div
      style={{
        position: "absolute",
        width: "275px",
        top: "0px",
        right: "0px",
        padding: "1.25rem",
        paddingTop: "0px",
        margin: "0.25rem",
        color: "white",
        backgroundColor: "#2d3748",
        borderRadius: "0.25rem",
      }}
    >
      <h2>{selected.summary}</h2>
      <p>
        {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
      </p>
      <p>Distance: {leg.distance?.text}</p>
      <p>Duration: {leg.duration?.text}</p>

      <h2>Other Routes</h2>
      <ul>
        {routes.map((route, index) => (
          <li key={route.summary} className="mb-2">
            <button
              className="btn btn-primary"
              onClick={() => setRouteIndex(index)}
            >
              {route.summary}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
