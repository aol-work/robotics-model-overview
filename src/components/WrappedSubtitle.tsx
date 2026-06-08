import { SUBTITLE_LINE_HEIGHT, SUBTITLE_MAX_CHARS, wrapText } from "./textUtils";

interface WrappedSubtitleProps {
  text: string;
  x: number;
  y: number;
  maxChars?: number;
}

/** Centered, multi-line subtitle text for model boxes. */
export function WrappedSubtitle({ text, x, y, maxChars = SUBTITLE_MAX_CHARS }: WrappedSubtitleProps) {
  const lines = wrapText(text, maxChars);
  return (
    <text x={x} y={y} className="model-box__subtitle">
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : SUBTITLE_LINE_HEIGHT}>
          {line}
        </tspan>
      ))}
    </text>
  );
}
