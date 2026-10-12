"use client";

import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useState } from "react";
import { VehicleTrackingRecording } from "../page";

const TimelineCustom = ({
  data,
  vehicleNo,
}: {
  data: VehicleTrackingRecording;
  vehicleNo: string;
}) => {
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
          <RoutePolyline
            data={data}
            vehicleNo={vehicleNo}
            showBlackCard={true}
          />
        </Map>
      </div>
    </APIProvider>
  );
};

export default TimelineCustom;

export function RoutePolyline({
  data,
  vehicleNo,
  showBlackCard,
}: {
  data: VehicleTrackingRecording;
  vehicleNo: string;
  showBlackCard: boolean;
}) {
  const map = useMap();
  const geometryLibrary = useMapsLibrary("geometry");
  const [distance, setDistance] = useState<any>();

  const vehiclePath = useMemo(() => {
    return (
      data?.[vehicleNo]?.map((coord) => ({
        lat: coord.Latitude,
        lng: coord.Longitude,
      })) ?? []
    );
  }, [data, vehicleNo]);

  const calculateDuration = (data: VehicleTrackingRecording) => {
    if (data[vehicleNo]?.length > 0) {
      const startDate = new Date(data[vehicleNo][0].GpsTime);
      const EndDate = new Date(
        data[vehicleNo][data[vehicleNo].length - 1].GpsTime
      );
      const durationInMs = EndDate.getTime() - startDate.getTime();
      const minutes = Math.floor(durationInMs / (1000 * 60));
      const hours = Math.floor(durationInMs / (1000 * 60 * 60));
      const days = Math.floor(durationInMs / (1000 * 60 * 60 * 24));

      if (days > 0) {
        return `${days} ${days === 1 ? "day" : "days"} `;
      } else if (hours > 0) {
        return `${hours} ${hours === 1 ? "hour" : "hours"} `;
      } else if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? "Min" : "Mins"} `;
      } else {
        return ``;
      }
    }
  };

  useEffect(() => {
    if (!map || !geometryLibrary || !vehiclePath.length) return;

    const startLatLng = new google.maps.LatLng(
      data[vehicleNo][0].Latitude,
      data[vehicleNo][0].Longitude
    );

    const endLatLng = new google.maps.LatLng(
      data[vehicleNo][data[vehicleNo].length - 1].Latitude,
      data[vehicleNo][data[vehicleNo].length - 1].Longitude
    );

    const distanceInMeters = geometryLibrary.spherical.computeDistanceBetween(
      startLatLng,
      endLatLng
    );

    setDistance(`${(distanceInMeters / 1000).toFixed(2)} km`);

    // Create a new Polyline
    const routePath = new google.maps.Polyline({
      path: vehiclePath,
      geodesic: true,
      strokeColor: "#FF0000", // Line color
      strokeOpacity: 0.8,
      strokeWeight: 8, // Line thickness
    });

    // Add the Polyline to the map
    routePath.setMap(map);

    // Optional: Adjust the viewport to include all the coordinates
    const bounds = new google.maps.LatLngBounds();
    vehiclePath.forEach((coord) => bounds.extend(coord));
    map.fitBounds(bounds);

    // Cleanup function to remove the Polyline when the component unmounts
    return () => {
      routePath.setMap(null);
    };
  }, [map, geometryLibrary, vehiclePath]);

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
          <p className="m-0 fs-6">Distance: {distance}</p>
          <p className="m-0 fs-6">Duration: {calculateDuration(data)}</p>
        </div>
      ) : (
        <div
          className="col-auto position-absolute p-2"
          style={{
            bottom: "10px",
            left: "10px",
            color: "#fff",
            backgroundColor: "rgba(255, 0, 0, 0.7)",
            borderRadius: "10px",
          }}
        >
          <p className="m-0 fs-6">Officer</p>
          <p className="m-0 fs-6">Distance: {distance}</p>
          <p className="m-0 fs-6">Duration: {calculateDuration(data)}</p>
        </div>
      )}
    </>
  );
}
