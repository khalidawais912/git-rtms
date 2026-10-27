"use client";

import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

const CustomRouteMap = () => {
  const routeCoordinates = [
    { lat: 43.6532, lng: -79.3832 }, // Toronto
    { lat: 44.2312, lng: -76.4859 }, // Kingston
    { lat: 45.4215, lng: -75.6972 }, // Ottawa
    { lat: 45.5017, lng: -73.5673 }, // Montreal
  ];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
        <Map
          defaultCenter={{ lat: 43.6532, lng: -79.3832 }}
          defaultZoom={7}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        >
          <RoutePolyline routeCoordinates={routeCoordinates} />
        </Map>
      </APIProvider>
    </div>
  );
};

export default CustomRouteMap;

function RoutePolyline({
  routeCoordinates,
}: {
  routeCoordinates: { lat: number; lng: number }[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Create a new Polyline
    const routePath = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: "#FF0000", // Line color
      strokeOpacity: 0.8,
      strokeWeight: 4, // Line thickness
    });

    // Add the Polyline to the map
    routePath.setMap(map);

    // Optional: Adjust the viewport to include all the coordinates
    const bounds = new google.maps.LatLngBounds();
    routeCoordinates.forEach((coord) => bounds.extend(coord));
    map.fitBounds(bounds);

    // Cleanup function to remove the Polyline when the component unmounts
    return () => {
      routePath.setMap(null);
    };
  }, [map, routeCoordinates]);

  return null;
}
