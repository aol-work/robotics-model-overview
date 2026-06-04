import { strings } from "../content/strings";
import { CASCADE } from "./shapes";

/**
 * Cascaded rendering: a world model box and an action model box filling the
 * footprint, with a "?" placeholder between them. The placeholder marks where
 * the intermediate representation (RGB / latent image) appears once a generation
 * subtype (explicit / implicit) is chosen.
 */
export function CascadedShape() {
  const { left, right, middle, arrowY, leftArrow, rightArrow } = CASCADE;
  const leftCx = left.x + left.width / 2;
  const rightCx = right.x + right.width / 2;
  const cy = left.y + left.height / 2;

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

      <rect
        x={middle.x}
        y={middle.y}
        width={middle.size}
        height={middle.size}
        rx={10}
        className="placeholder__rect"
      />
      <text x={middle.cx} y={middle.cy} className="placeholder__mark">
        ?
      </text>

      <line
        x1={leftArrow.x1}
        y1={arrowY}
        x2={leftArrow.x2}
        y2={arrowY}
        className="model-arrow"
        markerEnd="url(#arrowhead)"
      />
      <line
        x1={rightArrow.x1}
        y1={arrowY}
        x2={rightArrow.x2}
        y2={arrowY}
        className="model-arrow"
        markerEnd="url(#arrowhead)"
      />

      <text x={leftCx} y={cy} className="model-box__label">
        {strings.pipeline.worldModel}
      </text>
      <text x={rightCx} y={cy} className="model-box__label">
        {strings.pipeline.actionModel}
      </text>
    </g>
  );
}
