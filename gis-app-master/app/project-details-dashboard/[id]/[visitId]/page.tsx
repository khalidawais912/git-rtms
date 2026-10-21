import ProjectDetailsDashboard from "../../components/ProjectDetailsDashboard";

interface Props {
  params: { id: string; visitId: number }; // Change to string to match the routing expectations
}

const SingleProjectDashboard = ({ params }: Props) => {
  const { id, visitId } = params; // Use the id as a string here, if necessary convert it later
  return (
    <div className="p-3">
      <ProjectDetailsDashboard id={id} visitId={visitId} />
    </div>
  );
};

export default SingleProjectDashboard;

