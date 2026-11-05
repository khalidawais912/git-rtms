import SingleProjectLiveViewPage from "./components/SingleProjectLiveView";

interface Props {
  params: { id: string; visitId: string }; // Change to string to match the routing expectations
}

const SingleProjectDashboard = ({ params }: Props) => {
  const { id, visitId } = params; // Use the id as a string here, if necessary convert it later
  return (
    <div className="p-3">
      <SingleProjectLiveViewPage id={id} visitId={Number(visitId)} />
    </div>
  );
};

export default SingleProjectDashboard;
