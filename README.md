# OpenCode Harness

An opinionated wrapper around `opencode-workspace` and `opencode-conductor-plugin` for context-driven development with Git workspace isolation.

## Overview

OpenCode Harness is a minimal wrapper plugin that brings together two powerful OpenCode plugins:

- **opencode-workspace**: Git workspace (worktree) management for isolated development tracks
- **opencode-conductor-plugin**: Conductor methodology implementation for structured, phased development

This plugin provides no custom functionality - it simply wraps and exposes the functionality of both underlying plugins through a single installation point.

## Installation

### Prerequisites

- OpenCode environment
- Node.js 18.x or later
- Git 2.25+ (for worktree support)
- Bun (recommended package manager)

### Install the plugin

1. Add the harness to your OpenCode plugin dependencies:

```bash
cd .opencode
bun add @lannuttia/opencode-harness
```

2. Update your `.opencode/opencode.json` to register the plugin:

```json
{
  "plugins": [
    "@lannuttia/opencode-harness"
  ]
}
```

3. Restart OpenCode or reload plugins to activate the harness.

## Usage

Once installed, all commands from the wrapped plugins are available:

### From opencode-workspace

(Commands will be documented by the opencode-workspace plugin)

### From opencode-conductor-plugin

(Commands will be documented by the opencode-conductor-plugin plugin)

## Verification

To verify the plugin is installed correctly:

1. Check that the plugin appears in OpenCode's plugin list
2. Ensure there are no errors in the OpenCode console
3. Test basic commands from either wrapped plugin

## What This Plugin Does

- Initializes `opencode-workspace` during activation
- Initializes `opencode-conductor-plugin` during activation
- Forwards all plugin lifecycle events to both wrapped plugins
- Provides a single installation point for both plugins

## What This Plugin Does NOT Do

- Add custom commands or functionality
- Modify the behavior of wrapped plugins
- Provide configuration options beyond what the wrapped plugins offer

## Wrapped Plugin Versions

This harness wraps the following plugins:

- `opencode-workspace`: github:kdcokenny/opencode-workspace (latest from GitHub)
- `opencode-conductor-plugin`: ^1.32.0

## License

MIT
