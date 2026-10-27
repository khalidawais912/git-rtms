import { useRef, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  maxFont?: number;
  minFont?: number;
}

const ResizeableText = ({ children, maxFont = 24, minFont = 12 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(maxFont);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    let currentFont = maxFont;
    const containerWidth = containerRef.current.offsetWidth;

    // shrink font until it fits
    while (
      textRef.current.scrollWidth > containerWidth &&
      currentFont > minFont
    ) {
      currentFont -= 1;
      textRef.current.style.fontSize = `${currentFont}px`;
    }

    setFontSize(currentFont);
  }, [children, maxFont, minFont]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "100%", // 👈 constrain how wide the number can be
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <span
        ref={textRef}
        style={{ fontSize: fontSize, display: "inline-block" }}
      >
        {children}
      </span>
    </div>
  );
};

export default ResizeableText;
