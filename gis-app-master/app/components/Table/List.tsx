import { Dispatch, SetStateAction } from "react";

interface Props<T> {
  tableData: T[];
  setTableData: Dispatch<SetStateAction<T[] | undefined>>;
  label: string;
  keys: (keyof T)[];
  allowLink?: boolean;
  searchTermDefault?: string;
}

const ProjectsTable = <T,>({
  tableData,
  setTableData,
  label,
  keys,
  allowLink = false,
  searchTermDefault = "",
}: Props<T>) => {
  return (
    <div>
      <h3>{label}</h3>
      <table className="table">
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key as string}>{key.toString()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {keys.map((key) => (
                <td key={key as string}>
                  {allowLink && key === "id" ? (
                    <a href={`/details/${row[key]}`}>{row[key] as string}</a>
                  ) : (
                    (row[key] as string) // Ensure type compatibility
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
