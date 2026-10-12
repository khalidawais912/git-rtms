"use client";

import { REVERSE_GEO_CODING_API } from "@/app/APIs";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import StaffCard from "../Map/StaffCard";
import { Position, StaffTracking } from "../StaffTracking";

interface Props {
  recordingData: StaffTracking[];
  markerPositions: { [userId: string]: Position };
  fetchRecordingData: () => Promise<void>;
  position: Position;
  setPosition: Dispatch<SetStateAction<Position>>;
  path: Position[];
}

const RecordingStaffTrackingMap: any = ({
  fetchRecordingData,
  position,
  setPosition,
  path,
  recordingData,
}: Props) => {
  const [selectedStaffIndex, setSelectedStaffIndex] = useState<
    number | undefined
  >(0);
  const [open, setOpen] = useState(false);
  const [arrayIndex, setArrayIndex] = useState(0);

  const [startLocation, setStartLocation] = useState<string>();
  const [endLocation, setEndLocation] = useState<string>();

  const fetchStartLocationAddress = async (data: StaffTracking) => {
    try {
      if (data && data.startAddressLat && data.startAddressLong) {
        const response = await fetch(
          `${REVERSE_GEO_CODING_API}${data.startAddressLat},${data.startAddressLong}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`
        );
        const resopnseData = await response.json();
        setStartLocation(resopnseData.results[0].formatted_address);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const fetchEndLocationAddress = async (data: StaffTracking) => {
    try {
      if (data && data.endAddressLat && data.endAddressLong) {
        const response = await fetch(
          `${REVERSE_GEO_CODING_API}${data.endAddressLat},${data.endAddressLong}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`
        );
        const resopnseData = await response.json();
        setEndLocation(resopnseData.results[0].formatted_address);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  // Helper function to interpolate between two points
  const lerp = (start: number, end: number, t: number) => {
    return start + t * (end - start);
  };

  useEffect(() => {
    fetchRecordingData();
  }, []);

  useEffect(() => {
    if (path && path.length > 0 && arrayIndex < path.length - 1) {
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / 1000; // 1 second per movement
        const start = path[arrayIndex];
        const end = path[arrayIndex + 1];

        const lat = start.lat + (end.lat - start.lat) * progress;
        const lng = start.lng + (end.lng - start.lng) * progress;
        setPosition({ lat, lng });

        if (progress < 1) {
          requestAnimationFrame(animate); // Continue animation until progress is complete
        } else {
          setPosition(end); // Snap to end position at the end
          setArrayIndex((prevIndex) => prevIndex + 1); // Move to the next point
        }
      };

      requestAnimationFrame(animate);
    }
  }, [arrayIndex, path]);

  const MapWithMarkers = () => {
    const map = useMap();

    const markers = recordingData.map((d) => {
      return {
        position: { position },
      };
    });

    useEffect(() => {
      if (map && markers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach((marker) => bounds.extend(position));
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
        {recordingData.map((d) => (
          <AdvancedMarker
            key={d.userId}
            position={position}
            onClick={() => {
              setSelectedStaffIndex(parseInt(d.userId));
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

        {recordingData.map(
          (d) =>
            selectedStaffIndex === parseInt(d.userId) && (
              <InfoWindow
                key={d.userId}
                position={position}
                pixelOffset={[0, -60]}
              >
                <StaffCard
                  data={d}
                  setSelectedStaffIndex={setSelectedStaffIndex}
                  startLocation={startLocation}
                  endLocation={endLocation}
                />
              </InfoWindow>
            )
        )}
      </>
    );
  };

  return (
    <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
      <div
        style={{
          width: "100%",
          height: "840px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {recordingData && recordingData.length > 0 && (
          <Map
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
            defaultZoom={6}
            center={{ lat: position.lat + 0.85, lng: position.lng }}
            gestureHandling={"greedy"}
          >
            {recordingData.map((d) => (
              <Fragment key={d.userId}>
                <AdvancedMarker
                  position={position}
                  onClick={() => {
                    selectedStaffIndex === parseInt(d.userId)
                      ? setSelectedStaffIndex(-1)
                      : setSelectedStaffIndex(parseInt(d.userId));
                    fetchStartLocationAddress(d);
                    fetchEndLocationAddress(d);
                  }}
                >
                  <span>
                    <div className="position-relative">
                      <div className="position-absolute">
                        <img
                          src="/images/locationPointRoadBig.png"
                          alt="locationPointRoadBig"
                          style={{
                            width: "60px",
                            height: "70px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="position-absolute">
                        <img
                          className="img-fluid rounded-circle"
                          src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.userPicture}`}
                          alt="staffMember"
                          style={{
                            marginLeft: "10px",
                            marginTop: "2px",
                            width: "42px",
                            height: "42px",
                            objectFit: "cover",
                            objectPosition: "center top",
                          }}
                        />
                      </div>
                    </div>
                  </span>
                  {selectedStaffIndex === parseInt(d.userId) && (
                    <InfoWindow
                      position={position}
                      pixelOffset={[30, 0]}
                      onCloseClick={() => setOpen(false)}
                    >
                      <StaffCard
                        data={d}
                        setSelectedStaffIndex={setSelectedStaffIndex}
                        startLocation={startLocation}
                        endLocation={endLocation}
                      />
                    </InfoWindow>
                  )}
                </AdvancedMarker>
              </Fragment>
            ))}
            {/* <MapWithMarkers /> */}
          </Map>
        )}
      </div>
    </APIProvider>
  );
};

export default RecordingStaffTrackingMap;
