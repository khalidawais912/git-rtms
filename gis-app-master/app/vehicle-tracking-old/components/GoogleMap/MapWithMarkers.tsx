import { Position } from "@/app/staff-tracking/components/StaffTracking";
import { AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import CarCard from "../Map/CarCard";
import { Tracking } from "./LiveCarTrackingMap";

interface Props {
  position: Position;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rotationAngle: number;
  open: boolean;
  apiData: Tracking;
}

const MapWithMarkers = ({
  position,
  setOpen,
  rotationAngle,
  open,
  apiData,
}: Props) => {
  const map = useMap();

  const handleMarkerClick = (position: { lat: number; lng: number }) => {
    if (map) {
      map.setCenter(position); // Set the center to the clicked marker
      map.setZoom(17); // Adjust zoom level
    }
  };

  return (
    <>
      {position && (
        <AdvancedMarker
          position={position}
          onClick={() => {
            setOpen(!open);
            handleMarkerClick(position);
          }}
        >
          <div
            style={{
              transform: `rotate(${rotationAngle}deg)`,
              transition: "transform 2s",
            }}
          >
            <img
              src="/images/carTop2.png"
              alt="carTop2"
              style={{ width: "56px", height: "70px" }}
            />
          </div>
        </AdvancedMarker>
      )}
      {open && (
        <InfoWindow
          position={position}
          pixelOffset={[0, -70]}
          onCloseClick={() => setOpen(false)}
        >
          {apiData && <CarCard apiData={apiData} />}
        </InfoWindow>
      )}
    </>
  );
};

export default MapWithMarkers;
