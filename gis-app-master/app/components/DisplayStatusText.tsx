const DisplayStatusText = ({ statusId }: { statusId: number }) => {
  return (
    <>
      {statusId === 0
        ? "SCHEDULED"
        : statusId === 1
        ? "COMPLETED"
        : statusId === 2
        ? "CANCELLED"
        : statusId === 3
        ? "SUBMITTED"
        : statusId === 4
        ? "APPROVED"
        : statusId === 5
        ? "REFERBACK"
        : statusId === 6
        ? "ISSUED"
        : ""}
    </>
  );
};

export default DisplayStatusText;
