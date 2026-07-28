/**
 * OpenCode Harness - Main Entry Point
 * 
 * An opinionated wrapper around opencode-conductor-plugin.
 * This plugin provides no custom functionality - it simply wraps and exposes
 * the functionality of the underlying conductor plugin through a single installation point.
 */

import { HarnessPlugin } from "./plugin";
export type { HarnessConfig } from "./types";

// Export the plugin as the default export (OpenCode convention)
export default HarnessPlugin;
