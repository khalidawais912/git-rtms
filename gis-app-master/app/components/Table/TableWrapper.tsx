import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface Props<T> {
  children: (
    // BEFORE: React.RefObject<HTMLTableRowElement | null>
    firstRowRef: React.RefObject<HTMLTableRowElement> // AFTER: Remove the | null from the RefObject generic
  ) => ReactNode;
  setRows: Dispatch<SetStateAction<number>>;
  currentPage: number;
  data: T[];
  isPageLimit: boolean;
  headerHeight?: number;
  bottomOffset?: number;
}

export const TableWrapper = <T,>({
  children,
  setRows,
  currentPage,
  data,
  isPageLimit,
  headerHeight = 80,
  bottomOffset = 260,
}: Props<T>) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstRowRef = useRef<HTMLTableRowElement | null>(null);
  const [rowHeight, setRowHeight] = useState<number | null>(null);

  useEffect(() => {
    if (isPageLimit || !containerRef.current) return;

    // Delay measurement slightly to allow DOM/layout settle
    const timeout = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const availableHeight = container.clientHeight - headerHeight;
      const allRows = container.querySelectorAll("tbody tr");
      if (!allRows.length) return;

      const totalHeight = Array.from(allRows).reduce(
        (sum, row) => sum + row.getBoundingClientRect().height,
        0
      );

      const bufferPx = 4;
      const avgHeight = totalHeight / allRows.length + bufferPx;

      // Ignore minor variations < 3px
      if (!rowHeight || Math.abs(avgHeight - rowHeight) > 3) {
        const maxRows = Math.max(1, Math.floor(availableHeight / avgHeight));
        setRows(maxRows);
        setRowHeight(avgHeight);
      }
    }, 200); // slight delay smooths flicker

    return () => clearTimeout(timeout);
  }, [data, currentPage, isPageLimit, headerHeight, setRows]);

  return (
    <div className="table-responsive mb-2" style={{ margin: "0 -12px" }}>
      <div
        style={{
          height: `calc(100vh - ${bottomOffset}px)`,
          overflow: "auto",
        }}
        ref={containerRef}
      >
        <table className="table table-hover mb-0">
          {children(firstRowRef)}
        </table>
      </div>
    </div>
  );
};

export default TableWrapper;
