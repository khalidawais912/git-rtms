"use client";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useState } from "react";
import projectLocation from "../../../../public/images/projectLocation.png";
import { SingleProjectDashboard } from "../ProjectDetailsDashboard";

const containerStyle = {
  width: "100%",
  height: "411px",
  borderRadius: "10px",
  boxShadow: "0px 3px 10px 1px #c4c4c4",
};

interface Props {
  data: SingleProjectDashboard;
}

function Map({ data }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`,
  });
  const [isOpen, setIsOpen] = useState(false); // State to control InfoWindow visibility

  // const center = {
  //   lat: parseFloat(data.projectLat),
  //   lng: parseFloat(data.projectlong),
  // };

  const center = {
    lat: 0,
    lng: 0,
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={18}
      mapTypeId="hybrid"
    >
      {/* Child components, such as markers, info windows, etc. */}
      <Marker
        position={center}
        onClick={() => setIsOpen(!isOpen)}
        icon={{
          url: projectLocation.src,
          scaledSize: new window.google.maps.Size(43, 51),
        }}
      >
        {isOpen && (
          <InfoWindow>
            <div
              className="flex"
              style={{
                overflow: "hidden",
                width: "300px",
              }}
            >
              {/* <p className="fs-6 fw-normal m-0">{data.projectName}</p> */}
              {/* Add any other details or style as needed */}
            </div>
          </InfoWindow>
        )}
      </Marker>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(Map);
