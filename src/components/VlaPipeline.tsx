import { strings } from "../content/strings";
import { PipelineArrow, PipelineBox } from "./PipelineParts";
import {
  FOUNDATION_RECT,
  inputPortYs,
  outputPortYs,
  pipelineLayout,
  type PipelineSlot,
} from "./shapes";

const VLA_TOP_MARGIN = 48;

type VlaVariant = "affordanceBased" | "sensorimotor";

function vlaLayout(): {
  first: PipelineSlot;
  actionHead: PipelineSlot;
  imageInputY: number;
  languageInputY: number;
  outputY: number;
  arrowY: number;
} {
  const imageInputY = inputPortYs(2)[0];
  const languageInputY = inputPortYs(2)[1];
  const outputY = outputPortYs(1)[0];

  const { slots, arrowY } = pipelineLayout(2, [1.45, 1], {
    bounds: {
      x: FOUNDATION_RECT.x,
      y: FOUNDATION_RECT.y + VLA_TOP_MARGIN,
      width: FOUNDATION_RECT.width,
      height: FOUNDATION_RECT.height - VLA_TOP_MARGIN - 12,
    },
    gap: 56,
  });

  const [first, actionHead] = slots;
  return { first, actionHead, imageInputY, languageInputY, outputY, arrowY };
}

/** Images and instruction feed into the first stage from the left edge. */
function InputMergeArrows({ target, imageY, languageY }: { target: PipelineSlot; imageY: number; languageY: number }) {
  return (
    <>
      <line
        x1={FOUNDATION_RECT.x}
        y1={imageY}
        x2={target.x}
        y2={target.y + target.height * 0.32}
        className="model-arrow"
        markerEnd="url(#arrowhead)"
      />
      <line
        x1={FOUNDATION_RECT.x}
        y1={languageY}
        x2={target.x}
        y2={target.y + target.height * 0.68}
        className="model-arrow"
        markerEnd="url(#arrowhead)"
      />
    </>
  );
}

function vlaSubtypeCaption(variant: VlaVariant): string {
  return `${strings.nodes.vla.caption} · ${strings.nodes[variant].caption}`;
}

function VlaPipeline({ variant }: { variant: VlaVariant }) {
  const { first, actionHead, imageInputY, languageInputY, outputY, arrowY } = vlaLayout();
  const firstLabel =
    variant === "affordanceBased"
      ? strings.pipeline.visualAffordanceExtraction
      : strings.pipeline.jointRepresentation;
  const cx = FOUNDATION_RECT.x + FOUNDATION_RECT.width / 2;

  return (
    <g className={`shape shape--vla shape--vla--${variant}`}>
      <text x={cx} y={FOUNDATION_RECT.y + 32} className="model-box__caption">
        {vlaSubtypeCaption(variant)}
      </text>

      <PipelineBox slot={first} label={firstLabel} />
      <PipelineBox slot={actionHead} label={strings.pipeline.actionHead} />
      <InputMergeArrows target={first} imageY={imageInputY} languageY={languageInputY} />
      <PipelineArrow from={first} to={actionHead} y={arrowY} />
      <line
        x1={actionHead.x + actionHead.width}
        y1={outputY}
        x2={FOUNDATION_RECT.x + FOUNDATION_RECT.width}
        y2={outputY}
        className="model-arrow"
      />
    </g>
  );
}

/** Affordance-based VLA: scene affordances feed an action head. */
export function AffordanceBasedVlaPipeline() {
  return <VlaPipeline variant="affordanceBased" />;
}

/** Sensorimotor VLA: a joint representation feeds an action head. */
export function SensorimotorVlaPipeline() {
  return <VlaPipeline variant="sensorimotor" />;
}
