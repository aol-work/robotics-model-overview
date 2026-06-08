import type { IoPort } from "../architecture/tree";
import { strings } from "../content/strings";
import { IO, inputPortYs, outputPortYs } from "./shapes";

interface PortProps {
  x: number;
  y: number;
  id: IoPort["id"];
  optional?: boolean;
}

/**
 * A stack of image frames, conveying "the last n frames" rather than a whole
 * video: three offset squares with a small picture glyph on the front one.
 */
function StackedFrames({ cx, cy }: { cx: number; cy: number }) {
  const fs = 46;
  const off = 10;
  return (
    <g className="frames">
      {[-1, 0, 1].map((m) => {
        const fx = cx - fs / 2 + m * off;
        const fy = cy - fs / 2 + m * off;
        const isFront = m === 1;
        return (
          <g key={m}>
            <rect
              x={fx}
              y={fy}
              width={fs}
              height={fs}
              rx={6}
              className={isFront ? "frame__rect frame__rect--front" : "frame__rect"}
            />
            {isFront && (
              <>
                <circle cx={fx + fs * 0.3} cy={fy + fs * 0.3} r={fs * 0.12} className="frame__sun" />
                <path
                  d={`M${fx + fs * 0.12},${fy + fs * 0.8} L${fx + fs * 0.42},${fy + fs * 0.45} L${fx + fs * 0.62},${fy + fs * 0.66} L${fx + fs * 0.82},${fy + fs * 0.4} L${fx + fs * 0.9},${fy + fs * 0.8} Z`}
                  className="frame__mountains"
                />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

/** A single port (emoji, or stacked frames for video) with a label beneath it. */
function Port({ x, y, id, optional }: PortProps) {
  const port = strings.io.ports[id];
  return (
    <g className={optional ? "io-port io-port--optional" : "io-port"}>
      {id === "video" ? (
        <StackedFrames cx={x} cy={y} />
      ) : (
        <text x={x} y={y} className="io-port__emoji">
          {port.emoji}
        </text>
      )}
      <text x={x} y={y + 52} className="io-port__label">
        {port.label}
      </text>
    </g>
  );
}

interface IoPortsProps {
  inputs: IoPort[];
  outputs: IoPort[];
}

/**
 * The model's input and output ports, drawn in the stage gutters around the main
 * box: inputs feed in from the left, outputs leave on the right. Optional ports
 * are greyed out (may or may not be active).
 */
export function IoPorts({ inputs, outputs }: IoPortsProps) {
  const inputYs = inputPortYs(inputs.length);
  const outputYs = outputPortYs(outputs.length);

  return (
    <g className="io">
      {inputs.map((input, i) => (
        <g key={`in-${input.id}-${i}`}>
          <Port x={IO.inputX} y={inputYs[i]} id={input.id} optional={input.optional} />
          <line
            x1={IO.inputX + 60}
            y1={inputYs[i]}
            x2={IO.boxLeft}
            y2={inputYs[i]}
            className={input.optional ? "io-arrow io-arrow--optional" : "io-arrow"}
            markerEnd={input.optional ? "url(#arrowhead-muted)" : "url(#arrowhead)"}
          />
        </g>
      ))}

      {outputs.map((output, i) => (
        <g key={`out-${output.id}-${i}`}>
          <Port x={IO.outputX} y={outputYs[i]} id={output.id} optional={output.optional} />
          <line
            x1={IO.boxRight}
            y1={outputYs[i]}
            x2={IO.outputX - 60}
            y2={outputYs[i]}
            className={output.optional ? "io-arrow io-arrow--optional" : "io-arrow"}
            markerEnd={output.optional ? "url(#arrowhead-muted)" : "url(#arrowhead)"}
          />
        </g>
      ))}
    </g>
  );
}
