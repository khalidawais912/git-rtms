import dynamic from "next/dynamic";

const MapCars = dynamic(() => import("./MapCarsComponent"), {
  ssr: false, // This ensures the component is not server-side rendered
});

export default MapCars;
