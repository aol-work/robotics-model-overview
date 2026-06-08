import { strings } from "../content/strings";
import { CASCADE, FOUNDATION_RECT } from "./shapes";
import { WrappedSubtitle } from "./WrappedSubtitle";
import { SUBTITLE_LINE_HEIGHT, wrapText } from "./textUtils";

/**
 * Cascaded rendering: world model and action model boxes with a "?" placeholder
 * between them, plus caption and subtitle explaining the architecture.
 */
export function CascadedShape() {
  const { left, right, middle, arrowY, leftArrow, rightArrow } = CASCADE;
  const leftCx = left.x + left.width / 2;
  const rightCx = right.x + right.width / 2;
  const cy = left.y + left.height / 2;
  const cx = FOUNDATION_RECT.x + FOUNDATION_RECT.width / 2;
  const captionY = FOUNDATION_RECT.y + 26;
  const subtitle = strings.nodes.cascaded.subtitle;
  const subtitleLines = wrapText(subtitle, 66);
  const subtitleY =
    FOUNDATION_RECT.y +
    FOUNDATION_RECT.height -
    24 -
    (subtitleLines.length - 1) * SUBTITLE_LINE_HEIGHT;

  return (
    <g className="shape shape--cascaded">
      <text x={cx} y={captionY} className="model-box__caption">
        {strings.nodes.cascaded.caption}
      </text>

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

      <WrappedSubtitle text={subtitle} x={cx} y={subtitleY} />
    </g>
  );
}
