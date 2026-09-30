import React from 'react';
import katex from 'katex';

interface FormulaTextProps {
  text: string;
  className?: string;
  asSpan?: boolean;
}

/**
 * Renders text containing inline LaTeX formulas ($...$), isotopes ({}_{Z}^{A}\text{X}),
 * chemical equations, and plain text with chemical subscripts.
 */
export const FormulaText: React.FC<FormulaTextProps> = ({
  text,
  className = '',
  asSpan = true,
}) => {
  if (!text) return null;

  // Pre-process text to normalize common unescaped LaTeX patterns
  let processedText = text
    .replace(/\\\\/g, '\\') // Unescape double backslashes
    .replace(/\$\{([^}]+)\}\$/g, '$$1$') // Replace ${...}$ with $...$
    // Normalize isotope notation like (${}_{13}^{27}\text{Al}$) -> (${}_{13}^{27}\text{Al}$)
    .replace(/(\(|\s|^)(_\{?\d+\}?)\^?(\{?\d+\}?)\\text\{([A-Za-z]+)\}/g, '$1${}_{$2}^{$3}\\text{$4}$')
    // Normalize isotope notation like {}_{13}^{27}\text{Al} without dollar signs
    .replace(/(?<!\$)(_\{?\d+\}?\^\{?\d+\}?\\text\{[A-Za-z]+\})(?!\$)/g, '$$$1$$');

  // Split text into segments: math ($...$) and plain text
  // Match $...$ inline math blocks
  const segments: Array<{ type: 'math' | 'text'; content: string }> = [];
  const regex = /\$([^$]+)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(processedText)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: processedText.substring(lastIndex, match.index),
      });
    }
    segments.push({
      type: 'math',
      content: match[1],
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < processedText.length) {
    segments.push({
      type: 'text',
      content: processedText.substring(lastIndex),
    });
  }

  // Render HTML for each segment
  const renderedElements = segments.map((segment, idx) => {
    if (segment.type === 'math') {
      try {
        // Prepare math string for KaTeX
        let mathContent = segment.content.trim();
        
        // Clean up common LaTeX syntax quirks
        // e.g., {}_{13}^{27}\text{Al} -> {}_{13}^{27}\text{Al}
        const html = katex.renderToString(mathContent, {
          displayMode: false,
          throwOnError: false,
        });

        return (
          <span
            key={idx}
            className="inline-katex mx-0.5 inline-block align-baseline"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <span key={idx}>{segment.content}</span>;
      }
    } else {
      // Plain text: split by words/formula tokens or keep as string
      return <span key={idx}>{segment.content}</span>;
    }
  });

  const Component = asSpan ? 'span' : 'div';

  return <Component className={`formula-text ${className}`}>{renderedElements}</Component>;
};
