import { FOUNDATION_RECT } from "./shapes";

/**
 * A plain model box filling the footprint with a single centered label. Used for
 * the high-level model-type nodes (world model, world-action model, inverse
 * kinematics model) whose internal structure is revealed only at deeper levels.
 */
export function SimpleModelBox({ label }: { label: string }) {
  const cx = FOUNDATION_RECT.x + FOUNDATION_RECT.width / 2;
  const cy = FOUNDATION_RECT.y + FOUNDATION_RECT.height / 2;

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
      <text x={cx} y={cy} className="model-box__label">
        {label}
      </text>
    </g>
  );
}
