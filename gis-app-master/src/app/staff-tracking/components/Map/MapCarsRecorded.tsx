import dynamic from "next/dynamic";

const MapCarsRecorded = dynamic(() => import("./MapCarsManualComponent"), {
  ssr: false, // This ensures the component is not server-side rendered
});

export default MapCarsRecorded;
