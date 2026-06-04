/**
 * Shared geometry and layout constants for the SVG diagram.
 *
 * The diagram uses a single SVG coordinate system (the viewBox) so layout is
 * resolution independent. Tweaking these values rescales the whole scene.
 */
export const STAGE = {
  width: 1400,
} as const;

/**
 * The main model box. This is the "Robotics Foundation Model" rectangle and
 * also the surface that previews the selected/hovered architecture. It is
 * centered with side gutters that hold the generic I/O ports.
 */
export const FOUNDATION_RECT = {
  x: 240,
  y: 50,
  width: 920,
  height: 420,
  rx: 24,
} as const;

/**
 * Generic input/output port geometry, drawn in the stage gutters around the box
 * (the same for every architecture): video + language inputs on the left, a
 * robot output on the right.
 */
export const IO = {
  inputX: FOUNDATION_RECT.x / 2,
  outputX: (STAGE.width + FOUNDATION_RECT.x + FOUNDATION_RECT.width) / 2,
  videoY: FOUNDATION_RECT.y + FOUNDATION_RECT.height * 0.32,
  languageY: FOUNDATION_RECT.y + FOUNDATION_RECT.height * 0.68,
  robotY: FOUNDATION_RECT.y + FOUNDATION_RECT.height / 2,
  boxLeft: FOUNDATION_RECT.x,
  boxRight: FOUNDATION_RECT.x + FOUNDATION_RECT.width,
} as const;

/**
 * Y positions for `n` input ports along the box's left side. Ports are spaced a
 * fixed distance apart (enough for the emoji plus its label) and the whole stack
 * is centered on the box, so emoji/labels never overlap regardless of count.
 */
export function inputPortYs(n: number): number[] {
  const spacing = 120;
  const start = IO.robotY - ((n - 1) * spacing) / 2;
  return Array.from({ length: n }, (_, i) => start + i * spacing);
}

/** Bottom edge of the main model box; everything else stacks below it. */
export const BOX_BOTTOM = FOUNDATION_RECT.y + FOUNDATION_RECT.height;

/* No outer padding: the cascaded sub-boxes fill the full model footprint so
 * their outer bounds line up with the general model box (and its I/O arrows). */
const CASCADE_PADDING = 0;
/** Horizontal gap between the two cascaded sub-boxes (leaves room for the arrow). */
const CASCADE_GAP = 120;

const subWidth = (FOUNDATION_RECT.width - CASCADE_PADDING * 2 - CASCADE_GAP) / 2;
const subHeight = FOUNDATION_RECT.height - CASCADE_PADDING * 2;
const subY = FOUNDATION_RECT.y + CASCADE_PADDING;
const leftX = FOUNDATION_RECT.x + CASCADE_PADDING;
const rightX = leftX + subWidth + CASCADE_GAP;

/**
 * Cascaded layout: the single box is split into a left (world model) and right
 * (action model) sub-box of the same overall footprint, joined by an arrow.
 */
export const CASCADE = {
  left: { x: leftX, y: subY, width: subWidth, height: subHeight, rx: 18 },
  right: { x: rightX, y: subY, width: subWidth, height: subHeight, rx: 18 },
  arrow: {
    y: FOUNDATION_RECT.y + FOUNDATION_RECT.height / 2,
    x1: leftX + subWidth,
    x2: rightX,
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Breadcrumb chips (stacked locked choices below the main box)               */
/* -------------------------------------------------------------------------- */

export const CHIP = {
  width: 420,
  height: 56,
  vGap: 16,
  /** Vertical gap between the box bottom and the first chip. */
  topGap: 28,
} as const;

/** Y position of the chip at the given stack index (0 = closest to the box). */
export function chipY(index: number): number {
  return BOX_BOTTOM + CHIP.topGap + index * (CHIP.height + CHIP.vGap);
}

/* -------------------------------------------------------------------------- */
/* Hover-revealed choice buttons                                              */
/* -------------------------------------------------------------------------- */

export const CHOICE_BUTTON = {
  width: 240,
  height: 64,
  gap: 40,
  /** Vertical gap between the chip stack (or box) and the choice row. */
  topGap: 30,
} as const;

/**
 * Bottom edge of the chip stack. The stack always shows the root chip plus one
 * chip per committed selection, so there are `depth + 1` chips (indices 0..depth).
 */
function stackBottomForDepth(depth: number): number {
  return chipY(depth) + CHIP.height;
}

/**
 * Y position of the choice button row. Choices sit just below the chip stack,
 * whose height depends on how many selections are committed.
 */
export function choicesYForDepth(depth: number): number {
  return stackBottomForDepth(depth) + CHOICE_BUTTON.topGap;
}

/**
 * Total stage height for the current committed depth. Reserves room for the
 * choice row when the current node still has choices, so the layout does not
 * jump when choices appear on hover.
 */
export function stageHeightForDepth(depth: number, hasChoices: boolean): number {
  const bottomMargin = 32;
  const bottom = hasChoices
    ? choicesYForDepth(depth) + CHOICE_BUTTON.height
    : stackBottomForDepth(depth);
  return bottom + bottomMargin;
}

/* -------------------------------------------------------------------------- */
/* Horizontal pipeline layout (detailed views with N stages in a row)         */
/* -------------------------------------------------------------------------- */

export interface PipelineSlot {
  x: number;
  y: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
}

export interface PipelineLayout {
  slots: PipelineSlot[];
  /** Center Y line where connector arrows are drawn. */
  arrowY: number;
}

export interface PipelineOptions {
  /** Outer horizontal padding inside the box footprint. */
  padding?: number;
  /** Gap between stages (also where connector arrows are drawn). */
  gap?: number;
  /** Stage box height. */
  height?: number;
}

/**
 * Evenly spaces `count` stages horizontally inside the main box footprint,
 * leaving gaps between them for connector arrows. `relativeWidths` optionally
 * scales individual slots (e.g. small image thumbnails vs wide model boxes).
 * Longer pipelines can pass a smaller gap/padding via `options`.
 */
export function pipelineLayout(
  count: number,
  relativeWidths?: number[],
  options?: PipelineOptions,
): PipelineLayout {
  const padding = options?.padding ?? 40;
  const gap = options?.gap ?? 56;
  const height = options?.height ?? 300;
  const innerWidth = FOUNDATION_RECT.width - padding * 2 - gap * (count - 1);
  const weights = relativeWidths ?? Array(count).fill(1);
  const weightSum = weights.reduce((a, b) => a + b, 0);

  const cy = FOUNDATION_RECT.y + FOUNDATION_RECT.height / 2 + 8;
  const y = cy - height / 2;

  const slots: PipelineSlot[] = [];
  let cursor = FOUNDATION_RECT.x + padding;
  for (let i = 0; i < count; i++) {
    const width = (innerWidth * weights[i]) / weightSum;
    slots.push({
      x: cursor,
      y,
      width,
      height,
      cx: cursor + width / 2,
      cy,
    });
    cursor += width + gap;
  }

  return { slots, arrowY: cy };
}
