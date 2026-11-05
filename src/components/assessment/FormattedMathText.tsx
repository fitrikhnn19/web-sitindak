"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface FormattedMathTextProps {
  text: string;
  className?: string;
  display?: boolean;
}

export const FormattedMathText: React.FC<FormattedMathTextProps> = ({
  text,
  className = "",
  display = false,
}) => {
  const content = useMemo(() => {
    if (!text) return null;

    // Check if the text contains LaTeX dollar delimiters: $ ... $
    if (text.includes("$")) {
      const parts = text.split(/(\$[^$]+\$)/g);

      return parts.map((part, index) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
          const mathExpr = part.slice(1, -1);
          try {
            const html = katex.renderToString(mathExpr, {
              displayMode: display,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="inline-block mx-0.5 align-middle"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <span key={index}>{part}</span>;
          }
        }
        return <span key={index}>{part}</span>;
      });
    }

    // If no '$' but has raw LaTeX command like \begin or \circ or \pmatrix
    if (text.includes("\\begin") || text.includes("\\frac") || text.includes("\\pmatrix")) {
      try {
        const html = katex.renderToString(text, {
          displayMode: display,
          throwOnError: false,
        });
        return (
          <span
            className="inline-block align-middle"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return text;
      }
    }

    // Regular text
    return text;
  }, [text, display]);

  return <span className={className}>{content}</span>;
};

