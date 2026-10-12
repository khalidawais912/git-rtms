import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";

const Test = () => {
  const markers = [
    {
      id: 1,
      position: { lat: 37.7749, lng: -122.4194 },
      label: "San Francisco",
    },
    { id: 2, position: { lat: 34.0522, lng: -118.2437 }, label: "Los Angeles" },
    {
      id: 3,
      position: { lat: 31.499628, lng: 74.380395 },
      label: "Lahore Pakistan",
    },
  ];

  const MapWithMarkers = () => {
    const map = useMap();

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
        map.setZoom(12); // Adjust zoom level
      }
    };

    return (
      <>
        {markers.map((marker) => (
          <AdvancedMarker
            key={marker.id}
            position={marker.position}
            onClick={() => handleMarkerClick(marker.position)}
          >
            <span className="fw-bold fs-1">{marker.label}</span>
          </AdvancedMarker>
        ))}
      </>
    );
  };

  return (
    <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
      <div style={{ height: "500px", width: "100%" }}>
        <Map
          defaultCenter={{ lat: 36.7783, lng: -119.4179 }}
          defaultZoom={7}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        >
          <MapWithMarkers />
        </Map>
      </div>
    </APIProvider>
  );
};

export default Test;
