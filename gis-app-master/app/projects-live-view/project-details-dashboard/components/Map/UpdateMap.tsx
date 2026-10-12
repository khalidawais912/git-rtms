"use client";
import { Library } from "@googlemaps/js-api-loader";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { SingleProjectDashboard } from "../ProjectDetailsDashboard";

const containerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "10px",
  boxShadow: "0px 3px 10px 1px #c4c4c4",
};

interface Props {
  data: SingleProjectDashboard;
}

const libraries: Library[] = ["marker"];

function UpdateMap({ data }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  // const center = {
  //   lat: parseFloat(
  //     data.projectLat ? data.projectLat : data.vehicalTrackings[0].startLat
  //   ),
  //   lng: parseFloat(
  //     data.projectlong ? data.projectlong : data.vehicalTrackings[0].startLong
  //   ),
  // };

  const center = {
    lat: 0,
    lng: 0,
  };

  useEffect(() => {
    if (isLoaded && map) {
      if (center.lat && center.lng) {
        const { AdvancedMarkerElement, PinElement } = google.maps.marker;
        const { InfoWindow } = google.maps;

        const pin = new PinElement({
          // glyph: "P",
          background: "#ff0000",
        });

        const marker = new AdvancedMarkerElement({
          map: map,
          position: new google.maps.LatLng(center.lat, center.lng),
          content: pin.element,
          gmpClickable: true,
        });

        const contentString = `
        <div
          style="overflow: hidden; width: 250px; padding: 10px; border-radius: 8px; background-color: white; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);"
          class="p-2 rounded shadow"
        >
          <p class="m-0 fs-6 fw-bold">Project Name</p>
          <p class="m-0 fs-6 fw-normal">projectName</p>
        </div>
      `;
        const infoWindow = new InfoWindow({
          content: contentString,
        });

        // Add click event directly to the marker
        marker.addListener("click", () => {
          infoWindow.open({
            anchor: marker,
            map,
          });
        });
      }
    }
  }, [isLoaded, map, center.lat, center.lng]);

  const mapOptions = {
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
    mapTypeId: "hybrid",
    zoom: 15,
    center: center,
  };

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={(map) => setMap(map)}
        options={mapOptions}
      ></GoogleMap>
    </div>
  ) : (
    <></>
  );
}

export default React.memo(UpdateMap);
