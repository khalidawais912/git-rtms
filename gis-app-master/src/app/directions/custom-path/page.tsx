import dynamic from "next/dynamic";

const CustomRouteMap = dynamic(() => import("../components/CustomRouteMap"), {
  ssr: false,
});

const CustomPathPage = () => {
  return <CustomRouteMap />;
};

export default CustomPathPage;
