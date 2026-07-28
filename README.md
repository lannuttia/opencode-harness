# OpenCode Harness

An opinionated wrapper around `opencode-conductor-plugin` for context-driven development.

## Overview

OpenCode Harness is a minimal wrapper plugin that provides easy access to the Conductor methodology:

- **opencode-conductor-plugin**: Conductor methodology implementation for structured, phased development

This plugin provides no custom functionality - it simply wraps and exposes the functionality of the conductor plugin through a single installation point.

## Installation

### Prerequisites

- OpenCode environment
- Node.js 18.x or later
- Bun (recommended for development)

### Install as a local plugin

For development or local use:

1. Clone or download this repository

2. Update your `.opencode/opencode.json` to register the local plugin:

```json
{
  "plugin": [
    "/path/to/opencode-harness"
  ]
}
```

Or for a plugin in the parent directory of your `.opencode` folder:

```json
{
  "plugin": [
    ".."
  ]
}
```

3. Restart OpenCode to activate the harness.

### Verification

To verify the plugin is installed correctly:

```bash
# The conductor commands should be available
# Try: /conductor:status or /conductor:setup
```

## Usage

Once installed, all Conductor commands are available:

### Conductor Commands

- `/conductor:setup` - Initialize the conductor/ directory and project "Constitution"
- `/conductor:newTrack "desc"` - Start a new feature/bug Track with spec and plan generation
- `/conductor:implement` - Start implementing the next pending task in the current track
- `/conductor:status` - Get a high-level overview of project progress and active tracks
- `/conductor:revert` - Interactively select a task, phase, or track to undo via Git

For detailed documentation, see the [opencode-conductor-plugin documentation](https://www.npmjs.com/package/opencode-conductor-plugin).

## What This Plugin Does

- Wraps and re-exports `opencode-conductor-plugin`
- Provides a single installation point for the Conductor methodology
- No custom logic - pure pass-through wrapper

## What This Plugin Does NOT Do

- Add custom commands or functionality
- Modify the behavior of the wrapped plugin
- Provide configuration options beyond what the conductor plugin offers

## Troubleshooting

**Plugin doesn't load:**
- Check that the path in `.opencode/opencode.json` is correct
- Ensure `package.json` exists in the plugin directory
- Restart OpenCode after configuration changes

**Conductor commands not available:**
- Verify the plugin loaded without errors
- Check OpenCode console for error messages
- Ensure `opencode-conductor-plugin` is installed in dependencies

## Wrapped Plugin Version

This harness wraps:

- `opencode-conductor-plugin`: ^1.32.0

Note: `opencode-workspace` is not included as it's a profile/bundle rather than a single plugin.

## License

MIT
