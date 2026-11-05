import { ReactNode } from "react";

interface Props {
  deleteNode?: ReactNode;
  formNode?: ReactNode;
}

const Actions = ({ deleteNode, formNode }: Props) => {
  return (
    <div className="col p-0">
      <div className="row d-flex flex-nowrap justify-content-center">
        {deleteNode && <div className="col-auto p-0">{deleteNode}</div>}
        {formNode && <div className="col-auto p-0">{formNode}</div>}
      </div>
    </div>
  );
};

export default Actions;
