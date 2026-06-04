import { FOUNDATION_RECT } from "./shapes";

/** Greedily wrap text into lines of at most `maxChars` characters. */
function wrapText(text: string, maxChars: number): string[] {
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

const LABEL_FONT = 34;
const SUBTITLE_FONT = 22;
const SUBTITLE_LINE_HEIGHT = SUBTITLE_FONT * 1.4;
const LABEL_SUBTITLE_GAP = 28;
const SUBTITLE_MAX_CHARS = 66;

interface SimpleModelBoxProps {
  label: string;
  subtitle?: string;
}

/**
 * A plain model box filling the footprint with a centered label and an optional
 * wrapped subtitle beneath it. Used for the high-level model-type nodes whose
 * internal structure is revealed only at deeper levels.
 */
export function SimpleModelBox({ label, subtitle }: SimpleModelBoxProps) {
  const cx = FOUNDATION_RECT.x + FOUNDATION_RECT.width / 2;
  const cy = FOUNDATION_RECT.y + FOUNDATION_RECT.height / 2;

  const lines = subtitle ? wrapText(subtitle, SUBTITLE_MAX_CHARS) : [];
  const subtitleBlock = lines.length
    ? LABEL_SUBTITLE_GAP + lines.length * SUBTITLE_LINE_HEIGHT
    : 0;
  const blockTop = cy - (LABEL_FONT + subtitleBlock) / 2;
  const labelY = blockTop + LABEL_FONT / 2;
  const subtitleStart = blockTop + LABEL_FONT + LABEL_SUBTITLE_GAP + SUBTITLE_LINE_HEIGHT / 2;

  return (
    <g className="shape shape--simple">
      <rect
        x={FOUNDATION_RECT.x}
        y={FOUNDATION_RECT.y}
        width={FOUNDATION_RECT.width}
        height={FOUNDATION_RECT.height}
        rx={FOUNDATION_RECT.rx}
        className="model-box__rect"
      />
      <text x={cx} y={labelY} className="model-box__label">
        {label}
      </text>
      {lines.length > 0 && (
        <text x={cx} y={subtitleStart} className="model-box__subtitle">
          {lines.map((line, i) => (
            <tspan key={i} x={cx} dy={i === 0 ? 0 : SUBTITLE_LINE_HEIGHT}>
              {line}
            </tspan>
          ))}
        </text>
      )}
    </g>
  );
}
