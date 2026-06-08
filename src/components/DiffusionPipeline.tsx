import { strings } from "../content/strings";
import { PipelineArrow, PipelineBox } from "./PipelineParts";
import { UnifiedFrame } from "./UnifiedFrame";
import {
  FOUNDATION_RECT,
  IO,
  pipelineLayout,
  UNIFIED_INNER,
  outputPortYs,
  type PipelineSlot,
} from "./shapes";

/** Vision and action encoders stacked in the left pipeline column. */
function EncodersColumn({ slot }: { slot: PipelineSlot }) {
  const gap = 20;
  const boxH = (slot.height - gap) / 2;
  const visionSlot: PipelineSlot = {
    x: slot.x,
    y: slot.y,
    width: slot.width,
    height: boxH,
    cx: slot.cx,
    cy: slot.y + boxH / 2,
  };
  const actionSlot: PipelineSlot = {
    x: slot.x,
    y: slot.y + boxH + gap,
    width: slot.width,
    height: boxH,
    cx: slot.cx,
    cy: slot.y + boxH + gap + boxH / 2,
  };

  return (
    <>
      <PipelineBox slot={visionSlot} label={strings.pipeline.visionEncoder} />
      <PipelineBox slot={actionSlot} label={strings.pipeline.actionEncoder} />
    </>
  );
}

/** Arrows from the two encoders into a diffusion transformer block. */
function EncoderArrows({ encoders, dit }: { encoders: PipelineSlot; dit: PipelineSlot }) {
  const gap = 20;
  const boxH = (encoders.height - gap) / 2;
  const visionCy = encoders.y + boxH / 2;
  const actionCy = encoders.y + boxH + gap + boxH / 2;

  return (
    <>
      <line
        x1={encoders.x + encoders.width}
        y1={visionCy}
        x2={dit.x}
        y2={dit.cy - 36}
        className="model-arrow"
        markerEnd="url(#arrowhead)"
      />
      <line
        x1={encoders.x + encoders.width}
        y1={actionCy}
        x2={dit.x}
        y2={dit.cy + 36}
        className="model-arrow"
        markerEnd="url(#arrowhead)"
      />
    </>
  );
}

/** Unified stream: action to the port and a direct optional image branch. */
function UnifiedStreamOutputs({ source }: { source: PipelineSlot }) {
  const actionY = outputPortYs(2)[1];
  const imageY = outputPortYs(2)[0];

  return (
    <>
      <line
        x1={source.x + source.width}
        y1={imageY}
        x2={IO.outputX - 60}
        y2={imageY}
        className="io-arrow io-arrow--optional"
        markerEnd="url(#arrowhead-muted)"
      />
      <line
        x1={source.x + source.width}
        y1={actionY}
        x2={FOUNDATION_RECT.x + FOUNDATION_RECT.width}
        y2={actionY}
        className="model-arrow"
      />
    </>
  );
}

const MOT_ROW_GAP = 24;
const MOT_COL_GAP = 44;

/** Two paired rows: encoders on the left, diffusion transformers on the right. */
function motLayout(): {
  visionEnc: PipelineSlot;
  actionEnc: PipelineSlot;
  dit1: PipelineSlot;
  dit2: PipelineSlot;
  crossAttn: PipelineSlot;
} {
  const bounds = UNIFIED_INNER;
  const rowH = (bounds.height - MOT_ROW_GAP) / 2;
  const boxW = (bounds.width - MOT_COL_GAP) / 2;

  const visionEnc: PipelineSlot = {
    x: bounds.x,
    y: bounds.y,
    width: boxW,
    height: rowH,
    cx: bounds.x + boxW / 2,
    cy: bounds.y + rowH / 2,
  };
  const actionEnc: PipelineSlot = {
    x: bounds.x,
    y: bounds.y + rowH + MOT_ROW_GAP,
    width: boxW,
    height: rowH,
    cx: bounds.x + boxW / 2,
    cy: bounds.y + rowH + MOT_ROW_GAP + rowH / 2,
  };
  const dit1: PipelineSlot = {
    x: bounds.x + boxW + MOT_COL_GAP,
    y: bounds.y,
    width: boxW,
    height: rowH,
    cx: bounds.x + boxW + MOT_COL_GAP + boxW / 2,
    cy: bounds.y + rowH / 2,
  };
  const dit2: PipelineSlot = {
    x: bounds.x + boxW + MOT_COL_GAP,
    y: bounds.y + rowH + MOT_ROW_GAP,
    width: boxW,
    height: rowH,
    cx: bounds.x + boxW + MOT_COL_GAP + boxW / 2,
    cy: bounds.y + rowH + MOT_ROW_GAP + rowH / 2,
  };

  const crossAttnW = Math.min(56, boxW * 0.32);
  const crossAttn: PipelineSlot = {
    x: dit1.cx - crossAttnW / 2,
    y: dit1.y,
    width: crossAttnW,
    height: dit2.y + dit2.height - dit1.y,
    cx: dit1.cx,
    cy: (dit1.cy + dit2.cy) / 2,
  };

  return { visionEnc, actionEnc, dit1, dit2, crossAttn };
}

/** Cross-attention as a distinct vertical box spanning both diffusion transformers. */
function CrossAttentionBox({ slot }: { slot: PipelineSlot }) {
  const fontSize = 14;
  const lineHeight = fontSize * 1.15;
  const lines = ["Cross-", "Attention"];

  return (
    <g className="cross-attn">
      <rect
        x={slot.x}
        y={slot.y}
        width={slot.width}
        height={slot.height}
        rx={10}
        className="cross-attn__rect"
      />
      <text
        x={slot.cx}
        y={slot.cy - ((lines.length - 1) * lineHeight) / 2}
        className="cross-attn__label"
        style={{ fontSize }}
      >
        {lines.map((line, i) => (
          <tspan key={line} x={slot.cx} dy={i === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

/** Each diffusion transformer feeds its matching output port. */
function MotOutputs({ dit1, dit2 }: { dit1: PipelineSlot; dit2: PipelineSlot }) {
  const imageY = outputPortYs(2)[0];
  const actionY = outputPortYs(2)[1];

  return (
    <>
      <line
        x1={dit1.x + dit1.width}
        y1={imageY}
        x2={IO.outputX - 60}
        y2={imageY}
        className="io-arrow io-arrow--optional"
        markerEnd="url(#arrowhead-muted)"
      />
      <line
        x1={dit2.x + dit2.width}
        y1={actionY}
        x2={FOUNDATION_RECT.x + FOUNDATION_RECT.width}
        y2={actionY}
        className="model-arrow"
      />
    </>
  );
}

function diffusionSubtypeCaption(subtype: "unifiedStream" | "mixtureOfTransformers"): string {
  return `${strings.nodes.diffusion.caption} · ${strings.nodes[subtype].caption}`;
}

/**
 * Unified diffusion overview: encoders feed a single diffusion transformer.
 * Shown before choosing unified stream vs. mixture of transformers.
 */
export function DiffusionShape() {
  const { slots } = pipelineLayout(2, [1, 1.35], { bounds: UNIFIED_INNER });
  const [encoders, dit] = slots;

  return (
    <UnifiedFrame subtypeCaption={strings.nodes.diffusion.caption}>
      <g className="shape shape--diffusion">
        <EncodersColumn slot={encoders} />
        <PipelineBox slot={dit} label={strings.pipeline.diffusionTransformer} />
        <EncoderArrows encoders={encoders} dit={dit} />
      </g>
    </UnifiedFrame>
  );
}

/**
 * Unified stream: vision and action encoders merge into one diffusion transformer
 * that outputs action and optionally a rendered image.
 */
export function UnifiedStreamPipeline() {
  const { slots } = pipelineLayout(2, [1, 1.45], { bounds: UNIFIED_INNER });
  const [encoders, dit] = slots;

  return (
    <UnifiedFrame subtypeCaption={diffusionSubtypeCaption("unifiedStream")}>
      <g className="shape shape--diffusion shape--unified-stream">
        <EncodersColumn slot={encoders} />
        <PipelineBox slot={dit} label={strings.pipeline.diffusionTransformer} />
        <EncoderArrows encoders={encoders} dit={dit} />
        <UnifiedStreamOutputs source={dit} />
      </g>
    </UnifiedFrame>
  );
}

/**
 * Mixture of transformers: the same encoders feed two diffusion transformers
 * linked by cross-attention, producing action and optionally an image.
 */
export function MixtureOfTransformersPipeline() {
  const { visionEnc, actionEnc, dit1, dit2, crossAttn } = motLayout();

  return (
    <UnifiedFrame subtypeCaption={diffusionSubtypeCaption("mixtureOfTransformers")}>
      <g className="shape shape--diffusion shape--mot">
        <PipelineBox slot={visionEnc} label={strings.pipeline.visionEncoder} />
        <PipelineBox slot={actionEnc} label={strings.pipeline.actionEncoder} />
        <PipelineBox slot={dit1} label={strings.pipeline.diffusionTransformer} />
        <PipelineBox slot={dit2} label={strings.pipeline.diffusionTransformer} />
        <CrossAttentionBox slot={crossAttn} />
        <PipelineArrow from={visionEnc} to={dit1} y={visionEnc.cy} />
        <PipelineArrow from={actionEnc} to={dit2} y={actionEnc.cy} />
        <MotOutputs dit1={dit1} dit2={dit2} />
      </g>
    </UnifiedFrame>
  );
}
