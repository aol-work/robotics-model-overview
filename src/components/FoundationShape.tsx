import { strings } from "../content/strings";
import { FOUNDATION_RECT } from "./shapes";

/**
 * The initial, unselected state: a single box labeled "Robotics Foundation
 * Model" with a hint prompting the user to hover and choose an architecture.
 */
export function FoundationShape() {
  const cx = FOUNDATION_RECT.x + FOUNDATION_RECT.width / 2;
  const cy = FOUNDATION_RECT.y + FOUNDATION_RECT.height / 2;

  return (
    <g className="shape shape--foundation">
      <rect
        x={FOUNDATION_RECT.x}
        y={FOUNDATION_RECT.y}
        width={FOUNDATION_RECT.width}
        height={FOUNDATION_RECT.height}
        rx={FOUNDATION_RECT.rx}
        className="model-box__rect"
      />
      <rect
        x={FOUNDATION_RECT.x}
        y={FOUNDATION_RECT.y}
        width={FOUNDATION_RECT.width}
        height={FOUNDATION_RECT.height}
        rx={FOUNDATION_RECT.rx}
        pathLength={100}
        className="foundation-hint-ring"
      />
      <text x={cx} y={cy - 12} className="model-box__label">
        {strings.foundationModel.label}
      </text>
      <text x={cx} y={cy + 16} className="model-box__hint">
        {strings.foundationModel.hoverPrompt}
      </text>
    </g>
  );
}
