import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { VehicleTrackingRecording } from "../page";
import { RoutePolyline } from "./TimelineCustom";
import { Directions } from "./TimelineAuto";

interface Props {
  data: VehicleTrackingRecording;
  vehicleNo: string;
}

const TimelineBothCustomAndGoogle = ({ data, vehicleNo }: Props) => {
  const position = { lat: 31.5638102, lng: 74.3245938 };

  return (
    <div
      style={{
        height: "60vh",
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
          <Directions data={data} vehicleNo={vehicleNo} showBlackCard={false} />
          <RoutePolyline
            data={data}
            vehicleNo={vehicleNo}
            showBlackCard={false}
          />
        </Map>
      </APIProvider>
    </div>
  );
};

export default TimelineBothCustomAndGoogle;
