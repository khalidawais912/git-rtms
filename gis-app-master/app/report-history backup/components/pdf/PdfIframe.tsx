interface Props {
  reportPath: string;
}

const PdfIframe: React.FC<Props> = ({ reportPath }) => {
  if (!reportPath) return <p>No report available</p>;

  return (
    <iframe
      src={reportPath}
      width="100%"
      height="600px"
      style={{ border: "none" }}
    />
  );
};

export default PdfIframe;
