import type { PipelineSlot } from "./shapes";

/**
 * Split a label into lines that fit `maxChars` per line. Spaces and hyphens are
 * break points (the hyphen stays attached to the preceding fragment), so long
 * names like "End-Effector Position Extractor" wrap cleanly inside narrow boxes.
 */
function wrapLabel(label: string, maxChars: number): string[] {
  const tokens = label
    .split(" ")
    .flatMap((word) =>
      word
        .split(/(?<=-)/) // keep the hyphen on the left fragment
        .filter(Boolean),
    );

  const lines: string[] = [];
  let current = "";
  for (const token of tokens) {
    const needsSpace = current && !current.endsWith("-");
    const candidate = needsSpace ? `${current} ${token}` : current + token;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = token;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

interface PipelineBoxProps {
  slot: PipelineSlot;
  label: string;
}

/** A single model box stage in a horizontal pipeline with wrapped label text. */
export function PipelineBox({ slot, label }: PipelineBoxProps) {
  const fontSize = Math.max(14, Math.min(26, slot.width * 0.16));
  const charWidth = fontSize * 0.58;
  const maxChars = Math.max(4, Math.floor((slot.width * 0.88) / charWidth));
  const lines = wrapLabel(label, maxChars);
  const lineHeight = fontSize * 1.15;
  const firstY = slot.cy - ((lines.length - 1) * lineHeight) / 2;

  return (
    <g className="pipeline-box">
      <rect
        x={slot.x}
        y={slot.y}
        width={slot.width}
        height={slot.height}
        rx={16}
        className="model-box__rect"
      />
      <text
        x={slot.cx}
        y={firstY}
        className="pipeline-box__label"
        style={{ fontSize }}
      >
        {lines.map((line, i) => (
          <tspan key={i} x={slot.cx} dy={i === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

interface PipelineArrowProps {
  from: PipelineSlot;
  to: PipelineSlot;
  y: number;
}

/** A connector arrow from the right edge of `from` to the left edge of `to`. */
export function PipelineArrow({ from, to, y }: PipelineArrowProps) {
  return (
    <line
      x1={from.x + from.width}
      y1={y}
      x2={to.x}
      y2={y}
      className="model-arrow"
      markerEnd="url(#arrowhead)"
    />
  );
}
