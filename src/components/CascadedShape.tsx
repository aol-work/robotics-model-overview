import { strings } from "../content/strings";
import { CASCADE } from "./shapes";

/**
 * Cascaded rendering: the single model box becomes two sub-boxes of the same
 * overall footprint (left = world model, right = action model), connected by an
 * arrow pointing from the world model to the action model.
 */
export function CascadedShape() {
  const { left, right, arrow } = CASCADE;
  const leftCx = left.x + left.width / 2;
  const rightCx = right.x + right.width / 2;
  const leftCy = left.y + left.height / 2;
  const rightCy = right.y + right.height / 2;

  return (
    <g className="shape shape--cascaded">
      <rect
        x={left.x}
        y={left.y}
        width={left.width}
        height={left.height}
        rx={left.rx}
        className="model-box__rect"
      />
      <rect
        x={right.x}
        y={right.y}
        width={right.width}
        height={right.height}
        rx={right.rx}
        className="model-box__rect"
      />
      <line
        x1={arrow.x1}
        y1={arrow.y}
        x2={arrow.x2}
        y2={arrow.y}
        className="model-arrow"
        markerEnd="url(#arrowhead)"
      />
      <text x={leftCx} y={leftCy} className="model-box__label">
        {strings.pipeline.worldModel}
      </text>
      <text x={rightCx} y={rightCy} className="model-box__label">
        {strings.pipeline.actionModel}
      </text>
    </g>
  );
}
