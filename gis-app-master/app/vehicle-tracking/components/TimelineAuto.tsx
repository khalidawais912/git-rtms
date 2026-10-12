"use client";

import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { VehicleTrackingRecording } from "../page";

const TimelineAuto = ({
  data,
  vehicleNo,
}: {
  data: VehicleTrackingRecording;
  vehicleNo: string;
}) => {
  const [open, setOpen] = useState(false);
  //   const position = { lat: 31.5204, lng: 74.3587 }; // lahore
  const position = { lat: 43.6532, lng: -79.3832 };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string}>
      <div style={{ height: "60vh", width: "100%" }}>
        <Map
          defaultZoom={9}
          defaultCenter={position}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_Reduce_ID}
        >
          <Directions data={data} vehicleNo={vehicleNo} showBlackCard={true} />
        </Map>
      </div>
    </APIProvider>
  );
};

export default TimelineAuto;

export function Directions({
  data,
  vehicleNo,
  showBlackCard,
}: {
  data: VehicleTrackingRecording;
  vehicleNo: string;
  showBlackCard: boolean;
}) {
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

    console.log(directionsService);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !data?.[vehicleNo]?.length)
      return;

    directionsService
      .route({
        origin: {
          lat: data[vehicleNo][0].Latitude,
          lng: data[vehicleNo][0].Longitude,
        },
        destination: {
          lat: data[vehicleNo][data[vehicleNo].length - 1].Latitude,
          lng: data[vehicleNo][data[vehicleNo].length - 1].Longitude,
        },
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });
    return () => {
      directionsRenderer.setMap(null); // Cleanup to avoid flicker
    };
  }, [directionsService, directionsRenderer, vehicleNo, data]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer, routes]);

  if (!leg) return null;

  console.log(routes);
  return (
    <>
      {showBlackCard ? (
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
          <p className="m-0 f-6">Distance: {leg.distance?.text}</p>
          <p className="m-0 f-6">Duration: {leg.duration?.text}</p>
        </div>
      ) : (
        <div
          className="col-auto position-absolute p-2"
          style={{
            bottom: "105px",
            left: "10px",
            color: "#fff",
            backgroundColor: "rgba(37, 184, 20, 0.7)",
            borderRadius: "10px",
          }}
        >
          <p className="m-0 fs-6">Google</p>
          <p className="m-0 f-6">Distance: {leg.distance?.text}</p>
          <p className="m-0 f-6">Duration: {leg.duration?.text}</p>
        </div>
      )}
    </>
  );
}
