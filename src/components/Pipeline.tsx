import { strings } from "../content/strings";
import { PipelineArrow, PipelineBox } from "./PipelineParts";
import {
  FlowThumbnail,
  LatentThumbnail,
  NoisyRgbThumbnail,
  RgbThumbnail,
} from "./Thumbnail";
import {
  FOUNDATION_RECT,
  pipelineLayout,
  type PipelineOptions,
  type PipelineSlot,
} from "./shapes";

type ThumbVariant = "rgb" | "latent" | "flow" | "noisyRgb";

/** A single stage in a horizontal pipeline: a model box or a thumbnail. */
type Stage =
  | { kind: "box"; label: string; weight?: number }
  | { kind: "thumb"; variant: ThumbVariant; label?: string; weight?: number };

const THUMBNAILS = {
  rgb: RgbThumbnail,
  latent: LatentThumbnail,
  flow: FlowThumbnail,
  noisyRgb: NoisyRgbThumbnail,
} as const;

/** Build a square slot (for a thumbnail) centered in a wider pipeline slot. */
function squareSlot(slot: PipelineSlot, size: number): PipelineSlot {
  return {
    x: slot.cx - size / 2,
    y: slot.cy - size / 2,
    width: size,
    height: size,
    cx: slot.cx,
    cy: slot.cy,
  };
}

interface PipelineProps {
  caption: string;
  stages: Stage[];
}

/**
 * Generic, data-driven detailed view: lays out N stages (model boxes and image
 * thumbnails) in a row inside the main box and connects them with arrows.
 * Every concrete pipeline below is just a list of stages.
 */
function Pipeline({ caption, stages }: PipelineProps) {
  const count = stages.length;
  const weights = stages.map((s) => s.weight ?? (s.kind === "thumb" ? 0.8 : 1.2));
  const options: PipelineOptions = count >= 5 ? { gap: 30 } : {};
  const { slots, arrowY } = pipelineLayout(count, weights, options);

  // Arrows connect to thumbnail square bounds, not the wider layout slot.
  const connectors = slots.map((slot, i) => {
    const stage = stages[i];
    if (stage.kind === "thumb") {
      const size = Math.min(slot.width * 0.96, slot.height * 0.66);
      return { slot: squareSlot(slot, size), size };
    }
    return { slot, size: 0 };
  });

  const cx = FOUNDATION_RECT.x + FOUNDATION_RECT.width / 2;
  const captionY = FOUNDATION_RECT.y + 32;

  return (
    <g className="shape shape--pipeline">
      <text x={cx} y={captionY} className="model-box__caption">
        {caption}
      </text>

      {stages.map((stage, i) => {
        if (stage.kind === "thumb") {
          const Thumb = THUMBNAILS[stage.variant];
          return (
            <Thumb
              key={i}
              cx={slots[i].cx}
              cy={slots[i].cy}
              size={connectors[i].size}
              {...(stage.label ? { label: stage.label } : {})}
            />
          );
        }
        return <PipelineBox key={i} slot={slots[i]} label={stage.label} />;
      })}

      {slots.slice(0, -1).map((_, i) => (
        <PipelineArrow
          key={`arrow-${i}`}
          from={connectors[i].slot}
          to={connectors[i + 1].slot}
          y={arrowY}
        />
      ))}

      {stages[count - 1].kind === "thumb" && (
        // Connect a thumbnail-ending pipeline to the footprint edge so it meets
        // the generic output arrow that leads to the Action port.
        <line
          x1={connectors[count - 1].slot.x + connectors[count - 1].slot.width}
          y1={arrowY}
          x2={FOUNDATION_RECT.x + FOUNDATION_RECT.width}
          y2={arrowY}
          className="model-arrow"
        />
      )}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Concrete pipelines (each is just a stage list)                             */
/* -------------------------------------------------------------------------- */

/** Explicit generation: World Model -> RGB Image -> Action Expert. */
export function ExplicitPipeline() {
  return (
    <Pipeline
      caption={strings.nodes.explicit.caption}
      stages={[
        { kind: "box", label: strings.pipeline.worldModel },
        { kind: "thumb", variant: "rgb" },
        { kind: "box", label: strings.pipeline.actionExpert },
      ]}
    />
  );
}

/** Implicit generation: the Action box is omitted; the generic output arrow
 * already leads to the Action port.
 * World Model -> Latent Image -> IDM -> (Action). */
export function ImplicitPipeline() {
  return (
    <Pipeline
      caption={strings.nodes.implicit.caption}
      stages={[
        { kind: "box", label: strings.pipeline.worldModel },
        { kind: "thumb", variant: "latent" },
        { kind: "box", label: strings.pipeline.idm },
      ]}
    />
  );
}

/** Unified diffusion: the model denoises an RGB image, from which the action is
 * read. World Model -> Noised Image -> (Action). */
export function DiffusionPipeline() {
  return (
    <Pipeline
      caption={strings.nodes.diffusion.caption}
      stages={[
        { kind: "box", label: strings.pipeline.worldModel },
        { kind: "thumb", variant: "noisyRgb" },
      ]}
    />
  );
}

/** Extract by IDM: the extractor becomes a learned IDM. The Action box is
 * omitted: the generic output arrow already leads to the Action port.
 * World Model -> RGB Image -> Learned IDM -> (Action). */
export function IdmExtractPipeline() {
  return (
    <Pipeline
      caption={strings.nodes.idmExtract.caption}
      stages={[
        { kind: "box", label: strings.pipeline.worldModel },
        { kind: "thumb", variant: "rgb" },
        { kind: "box", label: strings.pipeline.learnedIdm },
      ]}
    />
  );
}

/** Analytical extraction (parent view). The Action box is omitted: the generic
 * output arrow already leads to the Action port.
 * World Model -> RGB Image -> Analytical Extractor -> (Action). */
export function AnalyticalPipeline() {
  return (
    <Pipeline
      caption={strings.nodes.analytical.caption}
      stages={[
        { kind: "box", label: strings.pipeline.worldModel },
        { kind: "thumb", variant: "rgb" },
        { kind: "box", label: strings.pipeline.analyticalExtractor },
      ]}
    />
  );
}

/** Object poses: World Model -> RGB Image -> Object Poses -> Inverse Kinematics -> (Action). */
export function ObjectPosesPipeline() {
  return (
    <Pipeline
      caption={strings.nodes.objectPoses.caption}
      stages={[
        { kind: "box", label: strings.pipeline.worldModel },
        { kind: "thumb", variant: "rgb" },
        { kind: "box", label: strings.pipeline.objectPoses },
        { kind: "box", label: strings.pipeline.inverseKinematics },
      ]}
    />
  );
}

/** Optical flow: World Model -> RGB Image -> Optical Flow ->
 * End-Effector Position Extractor -> Inverse Kinematics -> (Action). */
export function OpticalFlowPipeline() {
  return (
    <Pipeline
      caption={strings.nodes.opticalFlow.caption}
      stages={[
        { kind: "box", label: strings.pipeline.worldModel },
        { kind: "thumb", variant: "rgb" },
        { kind: "thumb", variant: "flow" },
        { kind: "box", label: strings.pipeline.eePositionExtractor },
        { kind: "box", label: strings.pipeline.inverseKinematics },
      ]}
    />
  );
}
