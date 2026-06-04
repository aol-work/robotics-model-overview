import { strings } from "../content/strings";
import { FOUNDATION_RECT } from "./shapes";

/**
 * Unified world model: its own dedicated shape. A single box that fills the
 * whole model footprint, marked with the "Unified" caption at the top and the
 * world model label in the center.
 */
export function UnifiedShape() {
  const cx = FOUNDATION_RECT.x + FOUNDATION_RECT.width / 2;
  const cy = FOUNDATION_RECT.y + FOUNDATION_RECT.height / 2;
  const captionY = FOUNDATION_RECT.y + 26;

  return (
    <g className="shape shape--unified">
      <rect
        x={FOUNDATION_RECT.x}
        y={FOUNDATION_RECT.y}
        width={FOUNDATION_RECT.width}
        height={FOUNDATION_RECT.height}
        rx={FOUNDATION_RECT.rx}
        className="model-box__rect"
      />
      <text x={cx} y={captionY} className="model-box__caption">
        {strings.nodes.unified.caption}
      </text>
      <text x={cx} y={cy} className="model-box__label">
        {strings.pipeline.worldModel}
      </text>
    </g>
  );
}
