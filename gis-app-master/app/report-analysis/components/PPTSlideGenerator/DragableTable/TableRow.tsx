import { RxHamburgerMenu } from "react-icons/rx";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TableRow = ({
  id,
  title,
  index,
}: {
  id: number;
  title: string;
  index: number;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    touchAction: "none",
  };

  return (
    <tr ref={setNodeRef} {...attributes} {...listeners} style={style} key={id}>
      <th scope="row">{index + 1}</th>
      <td>{title}</td>
      {/* <td>
        <RxHamburgerMenu />
      </td> */}
    </tr>
  );
};

export default TableRow;
