import { REVERSE_GEO_CODING_API } from "@/app/APIs";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
} from "@vis.gl/react-google-maps";
import { Fragment, useEffect, useState } from "react";
import StaffCard from "../Map/StaffCard";
import { Position, StaffTracking, TrackingRequestData } from "../StaffTracking";

interface Props {
  data: StaffTracking[];
  markerPositions: { [userId: string]: Position };
  liveTrackingRequestBody: TrackingRequestData;
  getStaffWithCoordinates: (
    trackingRequestBody: TrackingRequestData
  ) => Promise<void>;
}

const LiveStaffTrackingMap = ({
  data,
  markerPositions,
  getStaffWithCoordinates,
  liveTrackingRequestBody,
}: Props) => {
  const [selectedStaffIndex, setSelectedStaffIndex] = useState<
    number | undefined
  >(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(6);
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

  useEffect(() => {
    const interval = setInterval(() => {
      getStaffWithCoordinates(liveTrackingRequestBody);
      console.log("liveTrackingRequestBody:", liveTrackingRequestBody);
      console.log("coordinates updated");
    }, 5000); // Call every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [liveTrackingRequestBody, markerPositions]);

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
        {data && data.length > 0 && (
          <Map
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
            defaultZoom={zoom}
            defaultCenter={{
              lat: parseFloat(
                data[0].coordinates[data[0].coordinates.length - 1].latitude
              ),
              lng: parseFloat(
                data[0].coordinates[data[0].coordinates.length - 1].longitude
              ),
            }}
            gestureHandling={"greedy"}
          >
            {data.map((d) => (
              <Fragment key={d.userId}>
                <AdvancedMarker
                  position={markerPositions[d.userId]}
                  onClick={() => {
                    setSelectedStaffIndex(parseInt(d.userId));
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
                          style={{ width: "60px", height: "70px" }}
                        />
                      </div>
                      <div className="position-absolute">
                        <img
                          className="img-fluid rounded-circle"
                          src={
                            `${process.env.NEXT_PUBLIC_BACKEND_API}${d.userPicture}` ||
                            "/images/profilePic3.png"
                          }
                          alt="staffMember"
                          style={{
                            marginLeft: "10px",
                            marginTop: "2px",
                            width: "42px",
                            height: "42px",
                            objectFit: "cover",
                            objectPosition: "center top",
                            backgroundSize: "cover",
                          }}
                        />
                      </div>
                    </div>
                  </span>
                </AdvancedMarker>
                {selectedStaffIndex === parseInt(d.userId) && (
                  <InfoWindow
                    position={{
                      lat: parseFloat(
                        d.coordinates[d.coordinates.length - 1].latitude
                      ),
                      lng: parseFloat(
                        d.coordinates[d.coordinates.length - 1].longitude
                      ),
                    }}
                    pixelOffset={[30, -5]}
                    onCloseClick={() => setOpen(false)}
                  >
                    <StaffCard
                      data={d}
                      startLocation={startLocation}
                      endLocation={endLocation}
                      setSelectedStaffIndex={setSelectedStaffIndex}
                    />
                  </InfoWindow>
                )}
              </Fragment>
            ))}
          </Map>
        )}
      </div>
    </APIProvider>
  );
};

export default LiveStaffTrackingMap;
