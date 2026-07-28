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

## Publishing (For Maintainers)

### Manual Pre-release Setup

Before automated releases can work, an initial pre-release must be published manually to configure NPM trusted publisher authentication:

1. **Bump to pre-release version:**
   ```bash
   bun version prerelease
   ```
   This will update `package.json` to a pre-release version (e.g., `0.1.0` → `0.1.1-0`)

2. **Publish to NPM:**
   ```bash
   bun publish
   ```
   Follow the prompts to authenticate with NPM (you'll need an NPM account and login credentials)

3. **Configure NPM Trusted Publisher:**
   - Visit your package page on npmjs.com
   - Navigate to Settings → Publishing Access
   - Add GitHub Actions as a trusted publisher
   - Configure: `owner/repo: lannuttia/opencode-harness`, `workflow: release.yml`

After this initial setup, all future releases will be automated via GitHub Actions and semantic-release.

### Troubleshooting Pre-release

**Authentication fails:**
- Ensure you're logged into NPM: `npm login`
- Check that you have publish permissions for `@lannuttia` scope
- Verify your NPM account has 2FA configured if required

**Package already exists:**
- The package name `@lannuttia/opencode-harness` must be unique
- If taken, update `name` in `package.json` before publishing

**Build errors:**
- This package has no build step (Bun handles TypeScript natively)
- Ensure `src/` directory exists and contains `index.ts`

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
