import { strings } from "../content/strings";

interface ThumbnailProps {
  /** Center x of the thumbnail. */
  cx: number;
  /** Center y of the thumbnail. */
  cy: number;
  /** Side length of the (square) thumbnail. */
  size: number;
  /** Optional caption rendered below the thumbnail. */
  label?: string;
}

const CAPTION_GAP = 26;

/**
 * RGB image thumbnail: a small framed square split into red / green / blue
 * vertical bands, suggesting a rendered colour image.
 */
export function RgbThumbnail({ cx, cy, size, label = strings.pipeline.rgbImage }: ThumbnailProps) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  const band = size / 3;
  const colors = ["#ef4444", "#22c55e", "#3b82f6"];

  return (
    <g className="thumbnail thumbnail--rgb">
      {colors.map((color, i) => (
        <rect
          key={color}
          x={x + i * band}
          y={y}
          width={band}
          height={size}
          fill={color}
          className="thumbnail__cell"
        />
      ))}
      <rect x={x} y={y} width={size} height={size} className="thumbnail__frame" />
      <text x={cx} y={y + size + CAPTION_GAP} className="thumbnail__label">
        {label}
      </text>
    </g>
  );
}

/* Deterministic pseudo-random in [0,1) for stable noise rendering. */
function noise(i: number): number {
  const x = Math.sin(i * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Noised action thumbnail: a robot emoji under a grain overlay, signalling a
 * (partially) denoised diffusion sample of the action rather than a clean image.
 */
export function NoisyRgbThumbnail({
  cx,
  cy,
  size,
  label = strings.pipeline.noisedImage,
}: ThumbnailProps) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  const grid = 9;
  const cell = size / grid;
  const emojiSize = size * 0.62;

  return (
    <g className="thumbnail thumbnail--noisy">
      <rect x={x} y={y} width={size} height={size} className="thumbnail__bg" />
      <text x={cx} y={cy} className="thumbnail__emoji" style={{ fontSize: emojiSize }}>
        {strings.io.ports.robot.emoji}
      </text>
      {Array.from({ length: grid * grid }, (_, i) => {
        const col = i % grid;
        const row = Math.floor(i / grid);
        return (
          <rect
            key={i}
            x={x + col * cell}
            y={y + row * cell}
            width={cell}
            height={cell}
            style={{ fill: noise(i + 1) > 0.5 ? "#ffffff" : "#000000", opacity: noise(i) * 0.5 }}
          />
        );
      })}
      <rect x={x} y={y} width={size} height={size} className="thumbnail__frame" />
      <text x={cx} y={y + size + CAPTION_GAP} className="thumbnail__label">
        {label}
      </text>
    </g>
  );
}

/* Motion vectors for the optical-flow thumbnail, expressed in unit coordinates
 * (0..1) relative to the thumbnail box: [startX, startY, dirX, dirY]. */
const FLOW_VECTORS: Array<[number, number, number, number]> = [
  [0.2, 0.25, 1, 0.2],
  [0.5, 0.3, 0.9, -0.3],
  [0.75, 0.4, 0.4, 0.6],
  [0.25, 0.6, 0.7, 0.5],
  [0.55, 0.7, 1, 0],
  [0.78, 0.72, -0.2, -0.8],
];

/**
 * Optical-flow thumbnail: a special "image" of movement, drawn as a field of
 * short motion vectors (arrows) over a dark frame.
 */
export function FlowThumbnail({
  cx,
  cy,
  size,
  label = strings.pipeline.opticalFlow,
}: ThumbnailProps) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  const vlen = size * 0.26;
  const head = size * 0.07;

  return (
    <g className="thumbnail thumbnail--flow">
      <rect x={x} y={y} width={size} height={size} className="thumbnail__bg" />
      {FLOW_VECTORS.map(([sx, sy, dx, dy], i) => {
        const norm = Math.hypot(dx, dy) || 1;
        const ux = dx / norm;
        const uy = dy / norm;
        const x1 = x + sx * size;
        const y1 = y + sy * size;
        const x2 = x1 + ux * vlen;
        const y2 = y1 + uy * vlen;
        // Arrowhead: two short barbs rotated off the direction vector.
        const leftX = x2 - head * (ux * 0.7 + uy);
        const leftY = y2 - head * (uy * 0.7 - ux);
        const rightX = x2 - head * (ux * 0.7 - uy);
        const rightY = y2 - head * (uy * 0.7 + ux);
        return (
          <path
            key={i}
            d={`M${x1},${y1} L${x2},${y2} M${x2},${y2} L${leftX},${leftY} M${x2},${y2} L${rightX},${rightY}`}
            className="thumbnail__flow-vector"
          />
        );
      })}
      <rect x={x} y={y} width={size} height={size} className="thumbnail__frame" />
      <text x={cx} y={y + size + CAPTION_GAP} className="thumbnail__label">
        {label}
      </text>
    </g>
  );
}

/* Deterministic 0..1 values driving the latent grid opacities (no randomness so
 * the render is stable across frames). */
const LATENT_CELLS = [
  0.2, 0.7, 0.4, 0.9, 0.55, 0.15, 0.8, 0.35, 0.6, 0.25, 0.95, 0.45, 0.5, 0.85,
  0.3, 0.65,
];

/**
 * Latent image thumbnail: an abstract 4x4 grid of cells with varying intensity,
 * suggesting a latent feature map rather than a viewable image.
 */
export function LatentThumbnail({
  cx,
  cy,
  size,
  label = strings.pipeline.latentImage,
}: ThumbnailProps) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  const cols = 4;
  const cell = size / cols;

  return (
    <g className="thumbnail thumbnail--latent">
      {LATENT_CELLS.map((intensity, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <rect
            key={i}
            x={x + col * cell}
            y={y + row * cell}
            width={cell}
            height={cell}
            className="thumbnail__cell"
            style={{ fill: "var(--accent, #38bdf8)", opacity: 0.15 + intensity * 0.7 }}
          />
        );
      })}
      <rect x={x} y={y} width={size} height={size} className="thumbnail__frame" />
      <text x={cx} y={y + size + CAPTION_GAP} className="thumbnail__label">
        {label}
      </text>
    </g>
  );
}
