import type { ComponentType } from "react";
import { strings } from "../content/strings";
import { CascadedShape } from "../components/CascadedShape";
import { FoundationShape } from "../components/FoundationShape";
import {
  AnalyticalPipeline,
  ExplicitPipeline,
  IdmExtractPipeline,
  ImplicitPipeline,
  ObjectPosesPipeline,
  OpticalFlowPipeline,
} from "../components/Pipeline";
import { SimpleModelBox } from "../components/SimpleModelBox";
import { UnifiedShape } from "../components/UnifiedShape";

/** A model input/output port identifier (keys of strings.io.ports). */
export type PortId = keyof typeof strings.io.ports;

/** A single input port. Optional ports are greyed out (may or may not be active). */
export interface IoPort {
  id: PortId;
  optional?: boolean;
}

/** Which input/output ports a node exposes. Inherited by descendants. */
export interface IoConfig {
  inputs: IoPort[];
  output: PortId;
}

/**
 * A node in the architecture decision tree.
 *
 * The tree is the single source of truth for the drill-down: each node knows
 * how to render itself (`Visualization`, drawn inside the main box footprint),
 * what to call it (`label` / `hint` for choice buttons and breadcrumb chips),
 * which deeper choices it offers (`children`), and optionally which I/O ports it
 * exposes (`io`, inherited by descendants that don't define their own). Adding a
 * new level later is just a matter of adding nodes here plus their visualization
 * component - the canvas, breadcrumb, and diagram logic stay untouched.
 */
export interface ArchNode {
  id: string;
  label: string;
  hint: string;
  Visualization: ComponentType;
  children: ArchNode[];
  io?: IoConfig;
}

/** Build a simple labeled-box visualization for a high-level model-type node. */
function boxViz(label: string): ComponentType {
  return function ModelBoxViz() {
    return <SimpleModelBox label={label} />;
  };
}

/** The existing world-action model architectures (cascaded subtree included). */
const WORLD_ACTION_CHILDREN: ArchNode[] = [
  {
    id: "unified",
    label: strings.nodes.unified.label,
    hint: strings.nodes.unified.hint,
    Visualization: UnifiedShape,
    children: [],
  },
  {
    id: "cascaded",
    label: strings.nodes.cascaded.label,
    hint: strings.nodes.cascaded.hint,
    Visualization: CascadedShape,
    children: [
      {
        id: "explicit",
        label: strings.nodes.explicit.label,
        hint: strings.nodes.explicit.hint,
        Visualization: ExplicitPipeline,
        children: [
          {
            id: "idmExtract",
            label: strings.nodes.idmExtract.label,
            hint: strings.nodes.idmExtract.hint,
            Visualization: IdmExtractPipeline,
            children: [],
          },
          {
            id: "analytical",
            label: strings.nodes.analytical.label,
            hint: strings.nodes.analytical.hint,
            Visualization: AnalyticalPipeline,
            children: [
              {
                id: "objectPoses",
                label: strings.nodes.objectPoses.label,
                hint: strings.nodes.objectPoses.hint,
                Visualization: ObjectPosesPipeline,
                children: [],
              },
              {
                id: "opticalFlow",
                label: strings.nodes.opticalFlow.label,
                hint: strings.nodes.opticalFlow.hint,
                Visualization: OpticalFlowPipeline,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "implicit",
        label: strings.nodes.implicit.label,
        hint: strings.nodes.implicit.hint,
        Visualization: ImplicitPipeline,
        children: [],
      },
    ],
  },
];

/** Root of the tree. The root itself is the unselected foundation model (no I/O). */
export const ROOT: ArchNode = {
  id: "foundation",
  label: strings.foundationModel.label,
  hint: strings.foundationModel.hoverPrompt,
  Visualization: FoundationShape,
  children: [
    {
      id: "worldModel",
      label: strings.nodes.worldModel.label,
      hint: strings.nodes.worldModel.hint,
      Visualization: boxViz(strings.nodes.worldModel.label),
      io: {
        inputs: [
          { id: "video" },
          { id: "action", optional: true },
          { id: "language", optional: true },
        ],
        output: "video",
      },
      children: [],
    },
    {
      id: "worldActionModel",
      label: strings.nodes.worldActionModel.label,
      hint: strings.nodes.worldActionModel.hint,
      Visualization: boxViz(strings.nodes.worldActionModel.label),
      io: { inputs: [{ id: "video" }, { id: "language" }], output: "robot" },
      children: WORLD_ACTION_CHILDREN,
    },
    {
      id: "vla",
      label: strings.nodes.vla.label,
      hint: strings.nodes.vla.hint,
      Visualization: boxViz(strings.nodes.vla.label),
      io: { inputs: [{ id: "video" }, { id: "language" }], output: "robot" },
      children: [],
    },
    {
      id: "inverseKinematics",
      label: strings.nodes.inverseKinematics.label,
      hint: strings.nodes.inverseKinematics.hint,
      Visualization: boxViz(strings.nodes.inverseKinematics.label),
      io: { inputs: [{ id: "video" }], output: "robot" },
      children: [],
    },
  ],
};

/**
 * Resolve a path of node ids to the chain of nodes (excluding the root).
 * Stops if a segment cannot be matched, returning what resolved so far.
 */
export function chainForPath(path: string[]): ArchNode[] {
  const chain: ArchNode[] = [];
  let current = ROOT;
  for (const id of path) {
    const next = current.children.find((child) => child.id === id);
    if (!next) break;
    chain.push(next);
    current = next;
  }
  return chain;
}

/** The deepest committed node for a path (the root when the path is empty). */
export function nodeAtPath(path: string[]): ArchNode {
  const chain = chainForPath(path);
  return chain.length > 0 ? chain[chain.length - 1] : ROOT;
}

/** The choices available below the deepest committed node. */
export function childrenAtPath(path: string[]): ArchNode[] {
  return nodeAtPath(path).children;
}

/** Look up a direct child of the deepest committed node by id. */
export function childById(path: string[], id: string | null): ArchNode | null {
  if (!id) return null;
  return childrenAtPath(path).find((child) => child.id === id) ?? null;
}

/**
 * The I/O ports in effect for a path: the deepest node on the chain that defines
 * `io`, so descendants inherit their model type's ports. Null when none applies
 * (e.g. the bare foundation root).
 */
export function ioForPath(path: string[]): IoConfig | null {
  const chain = chainForPath(path);
  for (let i = chain.length - 1; i >= 0; i--) {
    if (chain[i].io) return chain[i].io!;
  }
  return ROOT.io ?? null;
}
