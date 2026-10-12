import { PROJECT_DOCUMENT_NAMES_API } from "@/shared/api/endpoints";
import { ProjectDocumentName } from "../project-document-names/components/Form";
import useData from "@/shared/hooks/useData";

interface Props {
  refresh?: boolean;
}

const useProjectDocumentNames = ({ refresh = false }: Props = {}) =>
  useData<ProjectDocumentName>({
    refresh,
    endpoint: PROJECT_DOCUMENT_NAMES_API,
  });

export default useProjectDocumentNames;
