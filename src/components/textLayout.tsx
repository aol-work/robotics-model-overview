/** Greedily wrap text into lines of at most `maxChars` characters. */
export function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(" ")) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export const SUBTITLE_FONT = 22;
export const SUBTITLE_LINE_HEIGHT = SUBTITLE_FONT * 1.4;
export const SUBTITLE_MAX_CHARS = 66;

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
