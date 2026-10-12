import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Position, StaffTracking } from "../StaffTracking";

interface Props {
  recordingData: StaffTracking[];
  startLocation: string;
  endLocation: string;
  setGoogleDuration: Dispatch<SetStateAction<string | undefined>>;
  setOfficerDuration: Dispatch<SetStateAction<string | undefined>>;
  path: Position[];
}

const TimelineBothCustomAndGoogle = ({
  recordingData,
  startLocation,
  endLocation,
  setGoogleDuration,
  setOfficerDuration,
  path,
}: Props) => {
  const position = { lat: 31.5638102, lng: 74.3245938 };

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
          defaultCenter={position}
          defaultZoom={9}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
          fullscreenControl={false}
        >
          {path && (
            <RoutePolyline
              routeCoordinates={path}
              recordingData={recordingData}
              setOfficerDuration={setOfficerDuration}
            />
          )}
          <Directions
            setGoogleDuration={setGoogleDuration}
            recordingData={recordingData}
          />
        </Map>
      </APIProvider>
    </div>
  );
};

export default TimelineBothCustomAndGoogle;

// for google map routes
interface DirectionProps {
  setGoogleDuration: Dispatch<SetStateAction<string | undefined>>;
  recordingData: StaffTracking[];
}

function Directions({ setGoogleDuration, recordingData }: DirectionProps) {
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
          strokeColor: "#25b814", // Change this to your desired color
          strokeOpacity: 1,
          strokeWeight: 6,
        },
      })
    );
  }, [routesLibrary, map, recordingData]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    // Add an outline polyline
    const outlinePolyline = new google.maps.Polyline({
      strokeColor: "#198a0c", // Outline color
      strokeOpacity: 0.6,
      strokeWeight: 13, // Thickness of the outline (greater than the route)
      map,
    });

    directionsService
      .route({
        origin: {
          lat: parseFloat(recordingData[0]?.coordinates[0]?.latitude),
          lng: parseFloat(recordingData[0]?.coordinates[0]?.longitude),
        },
        destination: {
          lat: parseFloat(
            recordingData[0]?.coordinates[
              recordingData[0]?.coordinates?.length - 1
            ]?.latitude
          ),
          lng: parseFloat(
            recordingData[0]?.coordinates[
              recordingData[0]?.coordinates?.length - 1
            ]?.longitude
          ),
        },
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response?.routes);
        // Extract the route and apply it to the outline polyline
        const path = response.routes[0].overview_path;
        outlinePolyline.setPath(path);
      });
  }, [directionsService, directionsRenderer]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  setGoogleDuration(leg.duration?.text); // Send duration to parent
  return (
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
  );
}

// for custom routes
interface RoutePolylineProps {
  routeCoordinates: { lat: number; lng: number }[];
  recordingData: StaffTracking[];
  setOfficerDuration: Dispatch<SetStateAction<string | undefined>>;
  strokeOpacity?: number;
  strokeWeight?: number;
}

function RoutePolyline({
  routeCoordinates,
  recordingData,
  setOfficerDuration,
}: RoutePolylineProps) {
  const map = useMap();
  const geometryLibrary = useMapsLibrary("geometry");
  const [distance, setDistance] = useState<any>();

  const calculateDuration = (recordingData: StaffTracking[]) => {
    if (recordingData && recordingData[0]?.coordinates?.length > 0) {
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
        return `${minutes} ${minutes === 1 ? "min" : "mins"} `;
      } else {
        return ``;
      }
    }
  };

  useEffect(() => {
    if (!map) return;

    if (geometryLibrary && recordingData && recordingData.length > 0) {
      const startLatLng = new google.maps.LatLng(
        parseFloat(recordingData[0]?.coordinates[0].latitude),
        parseFloat(recordingData[0]?.coordinates[0].longitude)
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

    const outerRoutePath = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: "#FF0000", // Line color
      strokeOpacity: 0.6,
      strokeWeight: 13, // Line thickness
    });
    // Create a new Polyline
    const routePath = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: "#db6969", // Line color
      strokeOpacity: 1,
      strokeWeight: 6, // Line thickness
    });

    // Add the Polyline to the map
    outerRoutePath.setMap(map);
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
        color: "#fff",
        backgroundColor: "rgba(255, 0, 0, 0.7)",
        borderRadius: "10px",
      }}
    >
      <p className="m-0 fs-6">Officer</p>
      <p className="m-0 fs-6">Distance: {distance}</p>
      <p className="m-0 fs-6">Duration: {calculateDuration(recordingData)}</p>
    </div>
  );
}
