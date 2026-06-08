import { strings } from "../content/strings";
import { PipelineArrow, PipelineBox } from "./PipelineParts";
import { FOUNDATION_RECT, pipelineLayout } from "./shapes";
import type { PipelineSlot } from "./shapes";

const TOKEN_SIZE = 28;
const TOKEN_GAP = 8;
const OUTPUT_NUM = 7;
const OUTPUT_ACTION = new Set([OUTPUT_NUM - 2, OUTPUT_NUM - 1]);

interface TokenRowProps {
  cx: number;
  y: number;
  count: number;
  actionIndices?: Set<number>;
  variant?: "default" | "image" | "language";
}

/** A horizontal row of token squares. */
function TokenRow({ cx, y, count, actionIndices, variant = "default" }: TokenRowProps) {
  const rowWidth = count * TOKEN_SIZE + (count - 1) * TOKEN_GAP;
  const startX = cx - rowWidth / 2;
  const variantClass =
    variant === "image" ? "token token--image" : variant === "language" ? "token token--language" : "token";

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <rect
          key={i}
          x={startX + i * (TOKEN_SIZE + TOKEN_GAP)}
          y={y}
          width={TOKEN_SIZE}
          height={TOKEN_SIZE}
          rx={4}
          className={actionIndices?.has(i) ? "token token--action" : variantClass}
        />
      ))}
    </>
  );
}

/** Images and instruction enter as two token rows. */
function InputTokensBlock({ slot }: { slot: PipelineSlot }) {
  const imageRowY = slot.cy - 36;
  const langRowY = slot.cy + 18;

  return (
    <g className="tokens tokens--input">
      <rect
        x={slot.x}
        y={slot.y}
        width={slot.width}
        height={slot.height}
        rx={16}
        className="model-box__rect"
      />
      <text x={slot.cx} y={slot.y + 28} className="tokens__caption">
        {strings.pipeline.inputTokens}
      </text>
      <text x={slot.cx} y={imageRowY - 16} className="tokens__row-label">
        {strings.pipeline.imageTokens}
      </text>
      <TokenRow cx={slot.cx} y={imageRowY} count={4} variant="image" />
      <text x={slot.cx} y={langRowY - 16} className="tokens__row-label">
        {strings.pipeline.languageTokens}
      </text>
      <TokenRow cx={slot.cx} y={langRowY} count={3} variant="language" />
    </g>
  );
}

/** Generated token sequence; the last two tokens are actions. */
function OutputTokensBlock({ slot }: { slot: PipelineSlot }) {
  const tokenY = slot.cy - TOKEN_SIZE / 2 + 4;
  const legendY = slot.cy + 52;

  return (
    <g className="tokens tokens--output">
      <rect
        x={slot.x}
        y={slot.y}
        width={slot.width}
        height={slot.height}
        rx={16}
        className="model-box__rect"
      />
      <text x={slot.cx} y={slot.y + 28} className="tokens__caption">
        {strings.pipeline.outputTokens}
      </text>
      <TokenRow cx={slot.cx} y={tokenY} count={OUTPUT_NUM} actionIndices={OUTPUT_ACTION} />
      <rect
        x={slot.cx - 52}
        y={legendY - 9}
        width={18}
        height={18}
        rx={4}
        className="token token--action"
      />
      <text x={slot.cx - 26} y={legendY} className="tokens__legend">
        {strings.pipeline.actionToken}
      </text>
    </g>
  );
}

/**
 * Unified autoregressive: images and instruction enter as token rows, pass
 * through a transformer, and produce an output token sequence (with action tokens).
 */
export function AutoregressivePipeline() {
  const { slots, arrowY } = pipelineLayout(3, [1.35, 1, 1.25]);
  const [input, transformer, output] = slots;
  const cx = FOUNDATION_RECT.x + FOUNDATION_RECT.width / 2;
  const captionY = FOUNDATION_RECT.y + 32;

  return (
    <g className="shape shape--autoregressive">
      <text x={cx} y={captionY} className="model-box__caption">
        {strings.nodes.autoregressive.caption}
      </text>

      <InputTokensBlock slot={input} />
      <PipelineBox slot={transformer} label={strings.pipeline.transformer} />
      <OutputTokensBlock slot={output} />

      <PipelineArrow from={input} to={transformer} y={arrowY} />
      <PipelineArrow from={transformer} to={output} y={arrowY} />
    </g>
  );
}
