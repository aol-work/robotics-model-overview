/**
 * Single source of truth for all user-facing copy.
 *
 * Keep every label, hint, and sentence here so wording can change without
 * touching component logic. Components import `strings` and reference keys.
 */
export const strings = {
  app: {
    title: "Robotics World-Action Models",
    subtitle: "An interactive overview",
  },
  foundationModel: {
    label: "Robotics Foundation Model",
    hoverPrompt: "Hover to choose an architecture",
  },
  /**
   * Node-keyed copy for the architecture decision tree. Each node uses `label`
   * for its choice button / breadcrumb chip, `hint` for the tooltip, and an
   * optional `caption` shown inside its visualization.
   */
  nodes: {
    worldModel: {
      label: "World Model",
      hint: "Predicts future video from current video and action.",
      caption: "World Model",
    },
    worldActionModel: {
      label: "World-Action Model",
      hint: "Maps video and language to robot actions.",
      caption: "World-Action Model",
    },
    vla: {
      label: "VLA",
      hint: "Vision-Language-Action model: maps video and language to robot actions.",
      caption: "VLA",
    },
    inverseKinematics: {
      label: "Inverse Kinematics Model",
      hint: "Maps video to robot actions via inverse kinematics.",
      caption: "Inverse Kinematics Model",
    },
    unified: {
      label: "Unified World Model",
      hint: "A single model handles perception and action together.",
      caption: "Unified",
    },
    cascaded: {
      label: "Cascaded",
      hint: "Separate world model and action model, side by side.",
      caption: "Cascaded",
    },
    explicit: {
      label: "Explicit Generation",
      hint: "The world model emits an RGB image consumed by an action expert.",
      caption: "Explicit Generation",
    },
    implicit: {
      label: "Implicit Generation",
      hint: "The world model emits a latent image; an IDM derives the action.",
      caption: "Implicit Generation",
    },
    idmExtract: {
      label: "Extract by Inverse Dynamics Model (IDM)",
      hint: "A learned IDM extracts the action from the generated image.",
      caption: "Extract by IDM",
    },
    analytical: {
      label: "Extract analytically",
      hint: "Derive the action analytically from an intermediate representation.",
      caption: "Extract Analytically",
    },
    objectPoses: {
      label: "Object poses",
      hint: "Recover object poses, then solve inverse kinematics for the action.",
      caption: "Object Poses",
    },
    opticalFlow: {
      label: "Optical flow",
      hint: "Estimate optical flow, extract end-effector positions, then solve IK.",
      caption: "Optical Flow",
    },
  },
  /** Labels for the individual boxes inside the detailed pipeline views. */
  pipeline: {
    worldModel: "World Model",
    actionModel: "Action Head",
    actionExpert: "Action Expert",
    action: "Action",
    idm: "IDM",
    learnedIdm: "Learned IDM",
    analyticalExtractor: "Analytical Extractor",
    objectPoses: "Object Poses",
    eePositionExtractor: "End-Effector Position Extractor",
    inverseKinematics: "Inverse Kinematics",
    rgbImage: "RGB Image",
    latentImage: "Latent Image",
    opticalFlow: "Optical Flow",
  },
  /**
   * Reusable model input/output ports. Which ports a node shows is defined in
   * the architecture tree. Emojis are placeholders for now.
   */
  io: {
    ports: {
      video: { emoji: "\u{1F3A5}", label: "Images" },
      language: { emoji: "\u{1F4AC}", label: "Language" },
      action: { emoji: "\u{1F3AE}", label: "Action" },
      robot: { emoji: "\u{1F916}", label: "Action" },
    },
  },
  controls: {
    reset: "Reset",
    resetHint: "Go back and pick a different architecture",
    chipHint: "Click to jump to this selection (clears deeper choices)",
  },
} as const;

export type Strings = typeof strings;
