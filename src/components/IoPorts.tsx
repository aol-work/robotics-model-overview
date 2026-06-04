import type { IoPort, PortId } from "../architecture/tree";
import { strings } from "../content/strings";
import { IO, inputPortYs } from "./shapes";

interface PortProps {
  x: number;
  y: number;
  id: PortId;
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
  output: PortId;
}

/**
 * The model's input and output ports, drawn in the stage gutters around the main
 * box: inputs feed in from the left, the output comes out on the right. Which
 * ports are shown (and which are optional/greyed) depends on the selected or
 * previewed model type (see the tree).
 */
export function IoPorts({ inputs, output }: IoPortsProps) {
  const ys = inputPortYs(inputs.length);

  return (
    <g className="io">
      {inputs.map((input, i) => (
        <g key={input.id}>
          <Port x={IO.inputX} y={ys[i]} id={input.id} optional={input.optional} />
          <line
            x1={IO.inputX + 60}
            y1={ys[i]}
            x2={IO.boxLeft}
            y2={ys[i]}
            className={input.optional ? "io-arrow io-arrow--optional" : "io-arrow"}
            markerEnd={input.optional ? "url(#arrowhead-muted)" : "url(#arrowhead)"}
          />
        </g>
      ))}

      <Port x={IO.outputX} y={IO.robotY} id={output} />
      <line
        x1={IO.boxRight}
        y1={IO.robotY}
        x2={IO.outputX - 60}
        y2={IO.robotY}
        className="io-arrow"
        markerEnd="url(#arrowhead)"
      />
    </g>
  );
}
