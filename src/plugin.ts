/**
 * OpenCode Harness Plugin
 * 
 * A minimal wrapper around opencode-conductor-plugin.
 * This plugin simply wraps the conductor plugin and exposes its functionality.
 */

import type { Plugin } from "@opencode-ai/plugin";
import { MyPlugin as ConductorPlugin } from "opencode-conductor-plugin";

/**
 * The harness plugin function
 * This is a thin wrapper that delegates to the conductor plugin
 */
export const HarnessPlugin: Plugin = async (input, options) => {
  // Simply delegate to the conductor plugin
  return ConductorPlugin(input, options);
};
