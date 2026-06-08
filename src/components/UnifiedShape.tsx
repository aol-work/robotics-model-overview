import { strings } from "../content/strings";
import { FOUNDATION_RECT } from "./shapes";
import { SUBTITLE_LINE_HEIGHT, WrappedSubtitle, wrapText } from "./textLayout";

/**
 * Unified world-action model: a single box with caption, world-model label, and
 * an explanatory subtitle from strings.
 */
export function UnifiedShape() {
  const cx = FOUNDATION_RECT.x + FOUNDATION_RECT.width / 2;
  const captionY = FOUNDATION_RECT.y + 26;
  const subtitle = strings.nodes.unified.subtitle;
  const subtitleLines = wrapText(subtitle, 66);
  const subtitleBlock = subtitleLines.length * SUBTITLE_LINE_HEIGHT;
  const labelY =
    FOUNDATION_RECT.y +
    FOUNDATION_RECT.height / 2 -
    subtitleBlock / 2 -
    8;
  const subtitleY = labelY + 36 + SUBTITLE_LINE_HEIGHT / 2;

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
      <text x={cx} y={labelY} className="model-box__label">
        {strings.pipeline.worldModel}
      </text>
      <WrappedSubtitle text={subtitle} x={cx} y={subtitleY} />
    </g>
  );
}
