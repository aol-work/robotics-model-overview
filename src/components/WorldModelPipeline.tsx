import { strings } from "../content/strings";
import { PipelineBox } from "./PipelineParts";
import {
  FOUNDATION_RECT,
  inputPortYs,
  outputPortYs,
  type PipelineSlot,
} from "./shapes";

type ConditioningVariant = "action" | "language";

const WM_TOP_MARGIN = 48;
/** Wide gap between encoder and backbone so the conditioning label fits cleanly. */
const CONDITIONING_GAP = 112;

function wmConditionedLayout(): {
  encoder: PipelineSlot;
  backbone: PipelineSlot;
  imageInputY: number;
  outputY: number;
} {
  const imageInputY = inputPortYs(2)[0];
  const condInputY = inputPortYs(2)[1];
  const outputY = outputPortYs(1)[0];

  const contentH = FOUNDATION_RECT.height - WM_TOP_MARGIN - 12;

  const encoderW = 200;
  const encoderH = Math.min(140, contentH * 0.4);
  const backboneH = Math.min(280, contentH * 0.82);

  const encoder: PipelineSlot = {
    x: FOUNDATION_RECT.x + 20,
    y: condInputY - encoderH / 2,
    width: encoderW,
    height: encoderH,
    cx: FOUNDATION_RECT.x + 20 + encoderW / 2,
    cy: condInputY,
  };

  const backboneX = encoder.x + encoderW + CONDITIONING_GAP;
  const backboneW = FOUNDATION_RECT.x + FOUNDATION_RECT.width - backboneX - 20;
  const backbone: PipelineSlot = {
    x: backboneX,
    y: imageInputY - backboneH * 0.28,
    width: backboneW,
    height: backboneH,
    cx: backboneX + backboneW / 2,
    cy: imageInputY + backboneH * 0.22,
  };

  return { encoder, backbone, imageInputY, outputY };
}

/** Horizontal conditioning arrow in the gap between encoder and backbone. */
function ConditioningArrow({ encoder, backbone }: { encoder: PipelineSlot; backbone: PipelineSlot }) {
  const y = encoder.cy;
  const x1 = encoder.x + encoder.width;
  const x2 = backbone.x;
  const midX = (x1 + x2) / 2;

  return (
    <g className="conditioning-arrow">
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        className="model-arrow model-arrow--conditioning"
        markerEnd="url(#arrowhead)"
      />
      <text x={midX} y={y - 14} className="conditioning-arrow__label">
        {strings.pipeline.conditioning}
      </text>
    </g>
  );
}

function WorldModelConditionedPipeline({ variant }: { variant: ConditioningVariant }) {
  const { encoder, backbone, imageInputY, outputY } = wmConditionedLayout();
  const caption =
    variant === "action"
      ? strings.nodes.actionConditioned.caption
      : strings.nodes.languageConditioned.caption;
  const encoderLabel =
    variant === "action"
      ? strings.pipeline.actionEncoder
      : strings.pipeline.languageEncoder;
  const cx = FOUNDATION_RECT.x + FOUNDATION_RECT.width / 2;

  return (
    <g className={`shape shape--world-model shape--world-model--${variant}`}>
      <text x={cx} y={FOUNDATION_RECT.y + 32} className="model-box__caption">
        {caption}
      </text>

      <PipelineBox slot={encoder} label={encoderLabel} />
      <PipelineBox slot={backbone} label={strings.pipeline.videoBackbone} />

      <line
        x1={FOUNDATION_RECT.x}
        y1={imageInputY}
        x2={backbone.x}
        y2={imageInputY}
        className="model-arrow"
        markerEnd="url(#arrowhead)"
      />
      <ConditioningArrow encoder={encoder} backbone={backbone} />
      <line
        x1={backbone.x + backbone.width}
        y1={outputY}
        x2={FOUNDATION_RECT.x + FOUNDATION_RECT.width}
        y2={outputY}
        className="model-arrow"
      />
    </g>
  );
}

/** World model conditioned on the action input. */
export function ActionConditionedWorldModelPipeline() {
  return <WorldModelConditionedPipeline variant="action" />;
}

/** World model conditioned on a language instruction. */
export function LanguageConditionedWorldModelPipeline() {
  return <WorldModelConditionedPipeline variant="language" />;
}
