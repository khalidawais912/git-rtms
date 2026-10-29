import { useEffect, useState } from "react";
import { useEffectEvent } from "@/hooks/useEffectEvent";

interface Props {
  reportPath: string;
  iframeKey: string;
}

const PdfIframe: React.FC<Props> = ({ reportPath, iframeKey }) => {
  const [timeStamp, setTimeStamp] = useState(0);
  const [srcWithTimestamp, setSrcWithTimestamp] = useState("");

  useEffect(() => {
    const timestamp = new Date().getTime();
    if (timestamp) setTimeStamp(timestamp);
  }, [reportPath]);

  const onTimeStampChange = useEffectEvent(() => {
    if (timeStamp) setSrcWithTimestamp(`${reportPath}?t=${timeStamp}`);
  });
  useEffect(() => onTimeStampChange(), [timeStamp, onTimeStampChange]);

  return (
    <iframe
      key={iframeKey}
      src={srcWithTimestamp}
      width="100%"
      height="600px"
      style={{ border: "none" }}
    />
  );
};

export default PdfIframe;
