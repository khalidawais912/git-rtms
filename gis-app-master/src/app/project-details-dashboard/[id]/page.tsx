import ProjectDetailsDashboard from "../components/ProjectDetailsDashboard";

interface Props {
  params: { id: string }; // Change to string to match the routing expectations
}

const SingleProjectDashboard = ({ params }: Props) => {
  const { id } = params; // Use the id as a string here, if necessary convert it later
  return (
    <div className="p-3">
      <ProjectDetailsDashboard id={id} visitId={0} />
    </div>
  );
};

export default SingleProjectDashboard;

