import PcvFormPage from "@/features/pcv/components/PcvFormPage";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

const PcvDetailPage = ({ params }: Props) => {
  const pcvId = Number(params.id);
  if (!Number.isInteger(pcvId) || pcvId <= 0) notFound();
  return <PcvFormPage pcvId={pcvId} />;
};

export default PcvDetailPage;
