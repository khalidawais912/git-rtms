const RenderRichText = ({ data }: { data: string }) => {
  let parsedContent;

  try {
    // Parse the JSON string
    const parsed = JSON.parse(data);
    parsedContent = parsed[0]?.insert || "No data available";
  } catch (error) {
    console.error("Error parsing data:", error);
    parsedContent = "Invalid data format";
  }

  return (
    <span
      className="col"
      style={{ whiteSpace: "pre-line" }} // Preserve new line characters
      dangerouslySetInnerHTML={{ __html: parsedContent }} // Render bold and other HTML formatting
    />
  );
};

export default RenderRichText;
