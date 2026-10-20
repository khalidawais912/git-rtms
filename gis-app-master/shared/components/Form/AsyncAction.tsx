"use client";

import { ReactNode, useState } from "react";
import Spinner from "../Spinner";

interface AsyncActionProps {
  onClick: () => Promise<void>;
  children: ReactNode;
  loadingContent?: ReactNode;
  className?: string;
}

const AsyncAction = ({
  onClick,
  children,
  loadingContent = <Spinner />,
  className = "",
}: AsyncActionProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={handleClick} className={`${className}`}>
      {loading ? loadingContent : children}
    </div>
  );
};

export default AsyncAction;
