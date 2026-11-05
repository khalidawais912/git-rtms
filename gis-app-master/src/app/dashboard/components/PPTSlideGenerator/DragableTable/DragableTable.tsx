"use client";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TableRow from "./TableRow";
import { Dispatch, SetStateAction } from "react";
import { SectorItem } from "../../../types";

interface Props {
  sectors: SectorItem[];
  setSectors: Dispatch<SetStateAction<SectorItem[]>>;
}

const DragableTable = ({ sectors, setSectors }: Props) => {
  const getSectorPos = (id: number) =>
    sectors.findIndex((sector) => sector.id === id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Dropped outside the list, or back on the same row
    if (!over || active.id === over.id) return;

    setSectors((sectors) => {
      const originalPos = getSectorPos(Number(active.id));
      const newPos = getSectorPos(Number(over.id));
      return arrayMove(sectors, originalPos, newPos);
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Sr</th>
              <th scope="col">Sectors</th>
            </tr>
          </thead>
          <tbody>
            <SortableContext
              items={sectors}
              strategy={verticalListSortingStrategy}
            >
              {sectors.map((sector, index) => (
                <TableRow
                  key={index}
                  id={sector.id}
                  title={sector.title}
                  index={index}
                />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </div>
    </DndContext>
  );
};

export default DragableTable;
