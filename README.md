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
   npm version prerelease --preid=alpha
   ```
   This will update `package.json` to a pre-release version (e.g., `0.1.0` → `0.1.1-alpha.0`)

2. **Publish to NPM:**
   ```bash
   npm publish
   ```
   Follow the prompts to authenticate with NPM (you'll need an NPM account and login credentials)

3. **Configure NPM Trusted Publisher:**
   - Visit your package page on npmjs.com
   - Navigate to Settings → Publishing Access
   - Add GitHub Actions as a trusted publisher
   - Configure: `owner/repo: lannuttia/opencode-harness`, `workflow: release.yml`

After this initial setup, all future releases will be automated via GitHub Actions and semantic-release.

### Automated Releases

Once the manual pre-release is complete, all future releases are fully automated via GitHub Actions (see `.github/workflows/ci.yml` and `.github/workflows/release.yml`):

**Runtime Requirements:**
- The release workflow uses **Node.js 24** for semantic-release compatibility
- While Bun is the primary runtime for the package, semantic-release runs in Node.js during the automated release process
- Local testing with `bunx semantic-release --dry-run` requires Node.js 24.10.0 or later (or 22.14.0+)
- **No build step is required** - Bun handles TypeScript natively, so the package is published with source TypeScript files

**How it works:**
1. Commits are merged to the `main` branch
2. CI workflow runs (lint, typecheck, tests)
3. If CI passes, the Release workflow triggers automatically
4. semantic-release analyzes conventional commits since the last release
5. Version is bumped based on commit types:
   - `feat:` → minor version (e.g., 1.0.0 → 1.1.0)
   - `fix:` → patch version (e.g., 1.0.0 → 1.0.1)
   - `BREAKING CHANGE:` or `!` → major version (e.g., 1.0.0 → 2.0.0)
6. CHANGELOG.md is generated/updated
7. Git tag and GitHub Release are created
8. Package is published to NPM with provenance attestation
9. Version bump and CHANGELOG are committed back to main

**Commit message format:**
Follow the Conventional Commits specification:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Supported types:**
- `feat`: New feature (triggers minor release)
- `fix`: Bug fix (triggers patch release)
- `perf`: Performance improvement (triggers patch release)
- `conductor`: Conductor-specific changes (triggers patch release)
- `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore`: No release

**Examples:**
```
feat(cli): add support for custom config paths

Adds --config flag to specify a custom configuration file path.

Closes #42
```

```
fix: prevent crash when package.json is missing

Added validation to check for package.json before reading it.
```

```
feat!: remove deprecated workspace API

BREAKING CHANGE: The workspace.legacy() method has been removed.
Migrate to workspace.create() instead.
```

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

## Code Quality

This project enforces code quality standards through automated Git hooks:

### Pre-Commit Checks

Before each commit, the following checks run automatically:

1. **TypeScript Type Checking:** Validates all TypeScript code is type-safe
2. **Link Checking:** Verifies all links in markdown and HTML files are valid

If either check fails, the commit is blocked until issues are resolved.

### Link Checking

All markdown and HTML files are automatically checked for broken links before commits:

- ✓ Validates local file paths exist
- ✓ Checks external URLs return valid status codes
- ✓ Follows HTTP redirects
- ✓ Retries on transient failures

**Manual link checking:**
```bash
# Check a single file
bunx markdown-link-check --config .markdown-link-check.json README.md

# Check all markdown and HTML files
find . \( -name "*.md" -o -name "*.html" \) -not -path "*/node_modules/*" \
  -exec bunx markdown-link-check --config .markdown-link-check.json {} \;
```

**Configuration:** `.markdown-link-check.json`

For detailed documentation, see [docs/link-checking.md](./docs/link-checking.md).

### Bypassing Hooks

**Emergency use only:**
```bash
git commit --no-verify -m "message"
```

Only use `--no-verify` for work-in-progress commits or when hooks are temporarily failing. See [docs/hooks.md](./docs/hooks.md) for details.

## Wrapped Plugin Version

This harness wraps:

- `opencode-conductor-plugin`: ^1.32.0

Note: `opencode-workspace` is not included as it's a profile/bundle rather than a single plugin.

## License

MIT
