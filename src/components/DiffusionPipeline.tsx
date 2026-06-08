import { strings } from "../content/strings";
import { PipelineArrow, PipelineBox } from "./PipelineParts";
import { NoisyRgbThumbnail } from "./Thumbnail";
import { UnifiedFrame } from "./UnifiedFrame";
import { FOUNDATION_RECT, pipelineLayout, UNIFIED_INNER, outputPortYs } from "./shapes";

/** Build a square slot (for a thumbnail) centered in a wider pipeline slot. */
function squareSlot(
  slot: { x: number; y: number; width: number; height: number; cx: number; cy: number },
  size: number,
) {
  return {
    x: slot.cx - size / 2,
    y: slot.cy - size / 2,
    width: size,
    height: size,
    cx: slot.cx,
    cy: slot.cy,
  };
}

/**
 * Unified diffusion: the model denoises an action image inside the unified box.
 * World Model -> Noised action -> (Action port).
 */
export function DiffusionPipeline() {
  const { slots } = pipelineLayout(2, [1.3, 0.9], { bounds: UNIFIED_INNER });
  const [worldModel, imageSlot] = slots;
  const thumbSize = Math.min(imageSlot.width * 0.96, imageSlot.height * 0.66);
  // World-action models expose two outputs (optional Images, Action); align the
  // denoising thumbnail and its outgoing arrow with the lower Action port.
  const actionArrowY = outputPortYs(2)[1];
  const image = squareSlot({ ...imageSlot, cy: actionArrowY }, thumbSize);

  return (
    <UnifiedFrame subtypeCaption={strings.nodes.diffusion.caption}>
      <g className="shape shape--diffusion">
        <PipelineBox slot={worldModel} label={strings.pipeline.worldModel} />
        <NoisyRgbThumbnail cx={imageSlot.cx} cy={actionArrowY} size={thumbSize} />

        <PipelineArrow from={worldModel} to={image} y={actionArrowY} />
        <line
          x1={image.x + image.width}
          y1={actionArrowY}
          x2={FOUNDATION_RECT.x + FOUNDATION_RECT.width}
          y2={actionArrowY}
          className="model-arrow"
        />
      </g>
    </UnifiedFrame>
  );
}
