"use client";

import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Position, StaffTracking } from "../StaffTracking";

interface Props {
  path: Position[];
  startLocation: string;
  endLocation: string;
  recordingData: StaffTracking[];
  setOfficerDuration: Dispatch<SetStateAction<string | undefined>>;
}

const TimelineCustomPath = ({
  recordingData,
  path,
  startLocation,
  endLocation,
  setOfficerDuration,
}: Props) => {
  const routeCoordinates = [
    { lat: 43.6532, lng: -79.3832 }, // Toronto
    { lat: 44.2312, lng: -76.4859 }, // Kingston
    { lat: 45.4215, lng: -75.6972 }, // Ottawa
    { lat: 45.5017, lng: -73.5673 }, // Montreal
  ];

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
          defaultCenter={{ lat: 43.6532, lng: -79.3832 }}
          defaultZoom={7}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        >
          <RoutePolyline
            routeCoordinates={path}
            recordingData={recordingData}
            startLocation={startLocation}
            endLocation={endLocation}
            setOfficerDuration={setOfficerDuration}
          />
        </Map>
      </APIProvider>
    </div>
  );
};

export default TimelineCustomPath;

interface RoutePolylineProps {
  routeCoordinates: { lat: number; lng: number }[];
  recordingData: StaffTracking[];
  startLocation: string;
  endLocation: string;
  setOfficerDuration: Dispatch<SetStateAction<string | undefined>>;
}

function RoutePolyline({
  routeCoordinates,
  recordingData,
  startLocation,
  endLocation,
  setOfficerDuration,
}: RoutePolylineProps) {
  const map = useMap();
  const geometryLibrary = useMapsLibrary("geometry");
  const [distance, setDistance] = useState<any>();

  const calculateDuration = (recordingData: StaffTracking[]) => {
    if (recordingData && recordingData[0].coordinates.length > 0) {
      const startDate = new Date(recordingData[0].coordinates[0].createdAt);
      const EndDate = new Date(
        recordingData[0].coordinates[
          recordingData[0].coordinates.length - 1
        ].createdAt
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
    if (!map) return;

    if (geometryLibrary && recordingData) {
      const startLatLng = new google.maps.LatLng(
        parseFloat(recordingData[0].coordinates[0].latitude),
        parseFloat(recordingData[0].coordinates[0].longitude)
      );

      const endLatLng = new google.maps.LatLng(
        parseFloat(
          recordingData[0].coordinates[recordingData[0].coordinates.length - 1]
            .latitude
        ),
        parseFloat(
          recordingData[0].coordinates[recordingData[0].coordinates.length - 1]
            .longitude
        )
      );

      const distanceInMeters = geometryLibrary.spherical.computeDistanceBetween(
        startLatLng,
        endLatLng
      );
      setDistance(`${(distanceInMeters / 1000).toFixed(2)} km`);
    }

    // Create a new Polyline
    const routePath = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: "#FF0000", // Line color
      strokeOpacity: 0.8,
      strokeWeight: 8, // Line thickness
    });

    // Add the Polyline to the map
    routePath.setMap(map);

    // Optional: Adjust the viewport to include all the coordinates
    const bounds = new google.maps.LatLngBounds();
    routeCoordinates.forEach((coord) => bounds.extend(coord));
    map.fitBounds(bounds);

    setOfficerDuration(calculateDuration(recordingData));

    // Cleanup function to remove the Polyline when the component unmounts
    return () => {
      routePath.setMap(null);
    };
  }, [map, routeCoordinates, geometryLibrary]);

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
      <p className="m-0 fs-6">Distance: {distance}</p>
      <p className="m-0 fs-6">Duration: {calculateDuration(recordingData)}</p>
    </div>
  );
}
