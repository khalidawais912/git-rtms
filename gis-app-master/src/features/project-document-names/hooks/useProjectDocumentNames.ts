import { PROJECT_DOCUMENT_NAMES_API } from "@/shared/api/endpoints";
import { ProjectDocumentName } from "./schema";
import useData from "@/shared/hooks/useData";

interface Props {
  refresh?: boolean;
}

export const useProjectDocumentNames = ({ refresh = false }: Props = {}) =>
  useData<ProjectDocumentName>({
    refresh,
    endpoint: PROJECT_DOCUMENT_NAMES_API,
  });
