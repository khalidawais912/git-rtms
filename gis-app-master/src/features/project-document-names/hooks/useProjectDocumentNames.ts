import { PROJECT_DOCUMENT_NAMES_API } from "@/services/endpoints";
import { ProjectDocumentName } from "../schema";
import useData from "@/hooks/useData";

interface Props {
  refresh?: boolean;
}

export const useProjectDocumentNames = ({ refresh = false }: Props = {}) =>
  useData<ProjectDocumentName>({
    refresh,
    endpoint: PROJECT_DOCUMENT_NAMES_API,
  });
