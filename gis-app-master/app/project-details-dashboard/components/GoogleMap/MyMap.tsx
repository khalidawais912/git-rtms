"use client";

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import ProjectCard from "../Map/ProjectCard";
import { Groups } from "../ProjectDetailsDashboard";

interface Props {
  data: Groups;
}

interface Position {
  lat: number;
  lng: number;
}

const MyMap = ({ data }: Props) => {
  const [open, setOpen] = useState(false);
  const [initialPosition, setInitialPosition] = useState<Position>();
  const [zoom, setZoom] = useState<number>(17);

  useEffect(() => {
    if (data) {
      const latitude = data.attributes
        .filter((attribute) => attribute.values[0]?.latitude)
        .find((attribute) => attribute.values[0]?.latitude)
        ?.values[0]?.latitude;

      const longitude = data.attributes
        .filter((attribute) => attribute.values[0]?.longitude)
        .find((attribute) => attribute.values[0]?.longitude)
        ?.values[0]?.longitude;

      if (latitude && longitude) {
        setInitialPosition({
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
        });
      }
      setZoom(17);
    }
  }, [data]);

  const [selectedStaffIndex, setSelectedStaffIndex] = useState(0);

  const MapWithMarkers = () => {
    const map = useMap();

    const markers = data.attributes
      .filter(
        (attribute) =>
          attribute.values[0]?.latitude && attribute.values[0]?.longitude
      )
      .map((attribute) => {
        return {
          position: {
            lat: parseFloat(attribute.values[0].latitude),
            lng: parseFloat(attribute.values[0].longitude),
          },
        };
      });

    useEffect(() => {
      if (map && markers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach((marker) => bounds.extend(marker.position));
        map.fitBounds(bounds);
      }
    }, [map, markers]);

    const handleMarkerClick = (position: { lat: number; lng: number }) => {
      if (map) {
        map.setCenter(position); // Set the center to the clicked marker
        map.setZoom(17); // Adjust zoom level
      }
    };

    return (
      <>
        {data.attributes
          .filter(
            (attribute) =>
              attribute.values[0]?.latitude && attribute.values[0]?.longitude
          )
          .map((attribute) => (
            <AdvancedMarker
              key={attribute.attributeId}
              position={{
                lat: parseFloat(attribute.values[0].latitude),
                lng: parseFloat(attribute.values[0].longitude),
              }}
              onClick={() => {
                setSelectedStaffIndex(attribute.attributeId);
              }}
            >
              <span>
                <img
                  src="/images/projectLocation.png"
                  alt="projectLocation"
                  style={{ width: "60px", height: "70px" }}
                />
              </span>
            </AdvancedMarker>
          ))}

        {data.attributes
          .filter(
            (attribute) =>
              attribute.values[0]?.latitude && attribute.values[0]?.longitude
          )
          .map(
            (attribute) =>
              selectedStaffIndex === attribute.attributeId && (
                <InfoWindow
                  key={attribute.attributeId}
                  position={{
                    lat: parseFloat(attribute.values[0].latitude),
                    lng: parseFloat(attribute.values[0].longitude),
                  }}
                  pixelOffset={[0, -60]}
                >
                  <ProjectCard
                    data={attribute}
                    setSelectedStaffIndex={setSelectedStaffIndex}
                  />
                </InfoWindow>
              )
          )}
      </>
    );
  };

  return (
    <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
      {initialPosition && (
        <div
          style={{
            width: "100%",
            height: "500px",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Map
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_Reduce_ID}
            mapTypeId="hybrid"
            defaultZoom={zoom}
            defaultCenter={initialPosition}
            gestureHandling={"greedy"}
          >
            <MapWithMarkers />
          </Map>
        </div>
      )}
    </APIProvider>
  );
};

export default MyMap;
