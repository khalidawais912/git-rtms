"use client";
import Image from "next/image";
import { CSSProperties, ReactNode, useState } from "react";

interface Props {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  defaultImagePath?: string;
  styles?: CSSProperties;
}

const Avatar = ({
  src,
  alt = "picture",
  width = 30,
  height = 30,
  defaultImagePath = "/images/dp1.png",
  styles = {
    objectFit: "cover",
    objectPosition: "center top",
    width: `${width}px`,
    height: `${height}px`,
  },
}: Props) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className="rounded-circle"
      style={styles}
      onError={() => setImgSrc(defaultImagePath)}
    />
  );
};

export default Avatar;
