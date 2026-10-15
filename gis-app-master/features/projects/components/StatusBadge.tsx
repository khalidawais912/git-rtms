const StatusBadge = ({ status }: { status: string }) => {
  const backgroundColor = (status: string) => {
    return status.toLowerCase() === "scheduled"
      ? "#EEF2FF"
      : status.toLowerCase() === "not confirmed"
      ? "#FFEEEE"
      : status.toLowerCase() === "un-approved"
      ? "#FFEEEE"
      : status.toLowerCase() === "completed"
      ? "#EEF2FF"
      : status.toLowerCase().startsWith("approved")
      ? "#EEF2FF"
      : status.toLowerCase() === "active"
      ? "#EEF2FF"
      : status.toLowerCase() === "draft"
      ? "#EEF2FF"
      : "";
  };

  const color = (status: string) => {
    return status.toLowerCase() === "scheduled"
      ? "#1c6ba6"
      : status.toLowerCase() === "not confirmed"
      ? "#A61C1C"
      : status.toLowerCase() === "un-approved"
      ? "#A61C1C"
      : status.toLowerCase() === "completed"
      ? "#1c6ba6"
      : status.toLowerCase().startsWith("approved")
      ? "#1c6ba6"
      : status.toLowerCase() === "active"
      ? "#1c6ba6"
      : status.toLowerCase() === "draft"
      ? "#1c6ba6"
      : "";
  };

  return (
    <span
      className="badge rounded-pill"
      style={{
        backgroundColor: backgroundColor(status),
        color: color(status),
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
