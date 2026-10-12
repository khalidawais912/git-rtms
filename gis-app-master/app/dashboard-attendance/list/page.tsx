import dynamic from "next/dynamic";

const List = dynamic(() => import("../components/List"), {
  ssr: false,
});

const AttendanceList = () => {
  return (
    <div>
      <List />
    </div>
  );
};

export default AttendanceList;
