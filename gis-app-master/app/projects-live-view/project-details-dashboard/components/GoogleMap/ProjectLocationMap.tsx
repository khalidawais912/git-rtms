import { APIProvider, Map } from "@vis.gl/react-google-maps";
import React, { useEffect, useState } from "react";

interface Position {
  lat: number;
  lng: number;
}

const ProjectLocationMap = ({ height = "130px" }: { height?: string }) => {
  const [initialPosition, setInitialPosition] = useState<Position>();
  const [zoom, setZoom] = useState<number>(17);
  useEffect(() => {
    setInitialPosition({
      lat: 31.1471,
      lng: 75.3412,
    });
  }, []);
  return (
    <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
      {initialPosition && (
        <div
          style={{
            width: "100%",
            height,
            overflow: "hidden",
          }}
        >
          <Map
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_Reduce_ID}
            mapTypeId="hybrid"
            defaultZoom={zoom}
            defaultCenter={initialPosition}
            gestureHandling={"greedy"}
          ></Map>
        </div>
      )}
    </APIProvider>
  );
};

export default ProjectLocationMap;
