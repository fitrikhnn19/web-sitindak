"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathRendererProps {
  math: string;
  display?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  math,
  display = false,
  className = "",
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math, display]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

