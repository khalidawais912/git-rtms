import dynamic from "next/dynamic";

const MapCarsRecorded = dynamic(
  () => import("../components/Map/MapCarsRecorded"),
  {
    ssr: false,
  }
);

const OldMap = () => {
  return (
    <>
      <MapCarsRecorded />
    </>
  );
};

export default OldMap;
