import { useState } from "react";
import {
  ROOT,
  chainForPath,
  childById,
  childrenAtPath,
  ioForPath,
  nodeAtPath,
  type ArchNode,
} from "../architecture/tree";
import { Breadcrumb } from "./Breadcrumb";
import { IoPorts } from "./IoPorts";
import {
  CHOICE_BUTTON,
  FOUNDATION_RECT,
  STAGE,
  choicesYForDepth,
  stageHeightForDepth,
} from "./shapes";

interface ModelCanvasProps {
  /** Committed selection path (node ids from the root down). */
  path: string[];
  onSelectChild: (id: string) => void;
  onNavigate: (index: number) => void;
}

/**
 * The interactive surface: the main model box, the locked breadcrumb chips, and
 * the hover-revealed choices for the next level. The box content is driven by an
 * effective node = the hovered child (live preview) falling back to the deepest
 * committed node. All hover handling lives in one group so moving across the
 * chips between the box and the choices never drops the hover.
 */
export function ModelCanvas({ path, onSelectChild, onNavigate }: ModelCanvasProps) {
  const [hovered, setHovered] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const depth = path.length;
  const chain = chainForPath(path);
  const children = childrenAtPath(path);
  const hasChoices = children.length > 0;

  const committedNode = nodeAtPath(path);
  const previewedNode = childById(path, preview);
  const effectiveNode: ArchNode = previewedNode ?? committedNode;
  const Visualization = effectiveNode.Visualization;

  const effectivePath = previewedNode ? [...path, previewedNode.id] : path;
  const io = ioForPath(effectivePath);

  const choicesY = choicesYForDepth(depth);
  const totalWidth = children.length * CHOICE_BUTTON.width + (children.length - 1) * CHOICE_BUTTON.gap;
  const firstX = STAGE.width / 2 - totalWidth / 2;

  const hoverZone = {
    x: FOUNDATION_RECT.x - 20,
    y: FOUNDATION_RECT.y - 6,
    width: FOUNDATION_RECT.width + 40,
    height: stageHeightForDepth(depth, hasChoices) - (FOUNDATION_RECT.y - 6) - 8,
  };

  const clearHover = () => {
    setHovered(false);
    setPreview(null);
  };

  return (
    <>
      {io && <IoPorts inputs={io.inputs} output={io.output} />}

      <g className="model" onMouseEnter={() => setHovered(true)} onMouseLeave={clearHover}>
      <rect
        x={hoverZone.x}
        y={hoverZone.y}
        width={hoverZone.width}
        height={hoverZone.height}
        className="hover-zone"
      />

      <Visualization />

      <Breadcrumb nodes={[ROOT, ...chain]} onNavigate={onNavigate} />

      {hovered && hasChoices && (
        <g className="choices">
          {children.map((child, index) => {
            const x = firstX + index * (CHOICE_BUTTON.width + CHOICE_BUTTON.gap);
            return (
              <ChoiceButton
                key={child.id}
                x={x}
                y={choicesY}
                label={child.label}
                hint={child.hint}
                active={effectiveNode.id === child.id}
                onPreview={() => setPreview(child.id)}
                onClick={() => onSelectChild(child.id)}
              />
            );
          })}
        </g>
      )}
      </g>
    </>
  );
}

interface ChoiceButtonProps {
  x: number;
  y: number;
  label: string;
  hint: string;
  active: boolean;
  onPreview: () => void;
  onClick: () => void;
}

function ChoiceButton({ x, y, label, hint, active, onPreview, onClick }: ChoiceButtonProps) {
  const cx = x + CHOICE_BUTTON.width / 2;
  return (
    <g
      className={active ? "choice choice--active" : "choice"}
      onMouseEnter={onPreview}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <title>{hint}</title>
      <rect
        x={x}
        y={y}
        width={CHOICE_BUTTON.width}
        height={CHOICE_BUTTON.height}
        rx={10}
        className="choice__rect"
      />
      <text x={cx} y={y + CHOICE_BUTTON.height / 2} className="choice__label">
        {label}
      </text>
    </g>
  );
}
