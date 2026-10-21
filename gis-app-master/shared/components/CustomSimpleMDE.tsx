"use client";
// CustomSimpleMDE.tsx
import React, { forwardRef } from "react";
import dynamic from "next/dynamic";
import type { SimpleMDEReactProps } from "react-simplemde-editor";

// Dynamically import SimpleMDEEditor to avoid SSR issues
const SimpleMDEEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

// Our props type includes the original props plus an optional callback ref
type Props = SimpleMDEReactProps & {
  inputRef?: (instance: HTMLDivElement | null) => void;
};

// Helper to assign to both function and object refs
function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && typeof ref === "object" && "current" in ref) {
    // @ts-expect-error – ignore readonly typing for compatibility
    ref.current = value;
  }
}

// Our custom wrapper with forwardRef
const CustomSimpleMDE = forwardRef<HTMLDivElement, Props>(
  ({ inputRef, ...restProps }, ref) => {
    const combinedRef = (node: HTMLDivElement | null) => {
      assignRef(ref, node);
      if (inputRef) inputRef(node);
    };

    return <SimpleMDEEditor {...restProps} ref={combinedRef} />;
  }
);

CustomSimpleMDE.displayName = "CustomSimpleMDE";

export default CustomSimpleMDE;
