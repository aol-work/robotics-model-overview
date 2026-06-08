import type { ReactNode } from "react";
import { strings } from "../content/strings";
import { FOUNDATION_RECT } from "./shapes";

interface UnifiedFrameProps {
  /** Subtype caption shown below the "Unified" header (e.g. Autoregressive). */
  subtypeCaption?: string;
  children: ReactNode;
}

/**
 * Outer unified box framing subtype visualizations. Keeps the unified character
 * visible when drilling into autoregressive or diffusion variants.
 */
export function UnifiedFrame({ subtypeCaption, children }: UnifiedFrameProps) {
  const cx = FOUNDATION_RECT.x + FOUNDATION_RECT.width / 2;

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
      <text x={cx} y={FOUNDATION_RECT.y + 26} className="model-box__caption">
        {strings.nodes.unified.caption}
      </text>
      {subtypeCaption && (
        <text x={cx} y={FOUNDATION_RECT.y + 50} className="unified-frame__subtype">
          {subtypeCaption}
        </text>
      )}
      {children}
    </g>
  );
}
