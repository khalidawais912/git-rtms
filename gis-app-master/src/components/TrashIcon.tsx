"use client";

import { useState } from "react";
import { FaTrash } from "react-icons/fa";

const TrashIcon = () => {
  const [isHover, setHover] = useState(false);
  return (
    <FaTrash
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: `${isHover ? "red" : "#83898C"}`,
        transition: ".4s color",
      }}
    />
  );
};

export default TrashIcon;
