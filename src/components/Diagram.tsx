import { useState } from "react";
import { childrenAtPath, referencesForPath } from "../architecture/tree";
import { strings } from "../content/strings";
import { ModelCanvas } from "./ModelCanvas";
import { ReferencesPanel } from "./ReferencesPanel";
import { STAGE, stageHeightForDepth } from "./shapes";

/**
 * Top-level interactive stage. Owns the committed selection `path` (node ids
 * from the root down); the live preview-on-hover behavior lives in ModelCanvas.
 * The viewBox height grows with the committed depth so the breadcrumb stack and
 * the next-level choices always have room.
 */
export function Diagram() {
  const [path, setPath] = useState<string[]>([]);

  const depth = path.length;
  const hasChoices = childrenAtPath(path).length > 0;
  const stageHeight = stageHeightForDepth(depth, hasChoices);
  const referenceIds = referencesForPath(path);

  const selectChild = (id: string) => setPath((prev) => [...prev, id]);
  // Breadcrumb index 0 is the root chip, index i (>0) is committed selection
  // i-1. Jumping to an entry keeps it and clears everything deeper, so the new
  // path length equals the clicked index. Clicking the deepest entry is a no-op.
  const navigate = (index: number) => setPath((prev) => prev.slice(0, index));
  const reset = () => setPath([]);

  return (
    <div className="diagram">
      <svg
        className="diagram__stage"
        viewBox={`0 0 ${STAGE.width} ${stageHeight}`}
        role="img"
        aria-label={strings.app.title}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth={22}
            markerHeight={16}
            refX={18}
            refY={8}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L22,8 L0,16 Z" className="arrowhead" />
          </marker>
          <marker
            id="arrowhead-muted"
            markerWidth={22}
            markerHeight={16}
            refX={18}
            refY={8}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L22,8 L0,16 Z" className="arrowhead-muted" />
          </marker>
        </defs>

        <ModelCanvas path={path} onSelectChild={selectChild} onNavigate={navigate} />
      </svg>

      {depth > 0 && (
        <button
          type="button"
          className="reset-button"
          title={strings.controls.resetHint}
          onClick={reset}
        >
          {strings.controls.reset}
        </button>
      )}

      <ReferencesPanel ids={referenceIds} />
    </div>
  );
}
