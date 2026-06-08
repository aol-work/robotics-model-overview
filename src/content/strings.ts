/**
 * Single source of truth for all user-facing copy.
 *
 * Keep every label, hint, and sentence here so wording can change without
 * touching component logic. Components import `strings` and reference keys.
 */
export const strings = {
  app: {
    title: "Robotics Foundation Models",
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
      label: "World Model (WM)",
      hint: "Predicts future video from current video and action.",
      caption: "World Model",
      subtitle:
        "Predict the next state of the world in terms of imagined observations (usually expressed as images) based on the last observations of the world, and optionally actions taken or a goal description. Used for simulation, policy training, and long-term planning.",
    },
    worldActionModel: {
      label: "World-Action Model (WAM)",
      hint: "Maps video and language to robot actions. Sometimes also called 'world models for policy'.",
      caption: "World-Action Model",
      subtitle:
        "Used as policies. Produce the next action, given the last state of the world in terms of imagined observations and a goal description. Uses a next world-state prediction internally to do this (which can sometimes optionally be rendered).",
   
    },
    vla: {
      label: "VLA",
      hint: "Vision-Language-Action model: maps video and language to robot actions.",
      caption: "VLA",
      subtitle:
        "Used as policies. Produce the next action, taking the last state of the world in terms of imagined observations and a goal description.",
    },
    inverseKinematics: {
      label: "Inverse Kinematics Model",
      hint: "Maps video to robot actions via inverse kinematics.",
      caption: "Inverse Kinematics Model",
      subtitle:
        "Predict the action that would have effected the change of observation in the input.",
    },
    unified: {
      label: "Unified World Action-Model",
      hint: "A single model handles perception and action together.",
      caption: "Unified",
      subtitle:
        "A single model handles perception and action together.",
    },
    autoregressive: {
      label: "Autoregressive",
      hint: "Generate a token sequence; some of the tokens are actions.",
      caption: "Autoregressive",
    },
    diffusion: {
      label: "Diffusion Based",
      hint: "Denoise actions (and optionally images) with a diffusion transformer.",
      caption: "Diffusion Based",
    },
    unifiedStream: {
      label: "Unified Stream",
      hint: "Vision and action encoders feed a single diffusion transformer.",
      caption: "Unified Stream",
    },
    mixtureOfTransformers: {
      label: "Mixture of Transformers (MoT)",
      hint: "Two diffusion transformers exchange information via cross-attention.",
      caption: "MoT",
    },
    cascaded: {
      label: "Cascaded",
      hint: "Separate world model and action model, side by side.",
      caption: "Cascaded",
      subtitle:
        "A world model part produces the next observation, and a separate action head extracts the action.",
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
      label: "Inverse Dynamics Model (IDM)",
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
    actionModel: "Action Expert",
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
    noisedImage: "Action (denoising)",
    inputTokens: "Input tokens",
    imageTokens: "Image tokens",
    languageTokens: "Language tokens",
    transformer: "Transformer",
    visionEncoder: "Vision Encoder",
    actionEncoder: "Action Encoder",
    diffusionTransformer: "Diffusion Transformer",
    crossAttention: "Cross-Attention",
    outputTokens: "Output",
    actionToken: "action",
  },
  /**
   * Reusable model input/output ports. Which ports a node shows is defined in
   * the architecture tree. Emojis are placeholders for now.
   */
  io: {
    ports: {
      video: { emoji: "\u{1F3A5}", label: "Images" },
      language: { emoji: "\u{1F4AC}", label: "Instruction" },
      action: { emoji: "\u{1F3AE}", label: "Action" },
      robot: { emoji: "\u{1F916}", label: "Action" },
    },
  },
  controls: {
    reset: "Reset",
    resetHint: "Go back and pick a different architecture",
    chipHint: "Click to jump to this selection (clears deeper choices)",
  },
  references: {
    title: "References",
    arxivLabel: "arXiv",
  },
} as const;

export type Strings = typeof strings;
