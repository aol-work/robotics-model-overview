import { strings } from "../content/strings";
import type { ArchNode } from "../architecture/tree";
import { CHIP, STAGE, chipY } from "./shapes";

interface BreadcrumbProps {
  /** The full stack of nodes to show, starting with the root, top to bottom. */
  nodes: ArchNode[];
  /** Jump to a stack entry: keeps it and clears everything deeper. */
  onNavigate: (index: number) => void;
}

/**
 * Vertical stack of chips below the main box. The first chip is always the root
 * (Robotics Foundation Model); the rest are the committed selections. Clicking a
 * chip jumps back to it, keeping that entry and clearing everything deeper.
 */
export function Breadcrumb({ nodes, onNavigate }: BreadcrumbProps) {
  const x = STAGE.width / 2 - CHIP.width / 2;

  return (
    <g className="breadcrumb">
      {nodes.map((node, index) => {
        const y = chipY(index);
        return (
          <g
            key={node.id}
            className="chip"
            role="button"
            tabIndex={0}
            onClick={() => onNavigate(index)}
          >
            <title>{strings.controls.chipHint}</title>
            <rect
              x={x}
              y={y}
              width={CHIP.width}
              height={CHIP.height}
              rx={12}
              className="chip__rect"
            />
            <text
              x={x + CHIP.width / 2}
              y={y + CHIP.height / 2}
              className="chip__label"
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
