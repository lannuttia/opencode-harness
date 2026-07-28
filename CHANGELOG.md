## 1.0.0 (2026-07-28)

# Changelog

All notable changes to the OpenCode Harness will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-28

### Added

- Initial release of OpenCode Harness
- Minimal wrapper around `opencode-conductor-plugin` (v1.32.0)
- Direct re-export of conductor plugin functionality
- TypeScript support with strict mode enabled
- Bun native TypeScript execution (no build step required)
- Basic test suite with 100% wrapper code coverage
- Comprehensive README with installation and usage instructions

### Technical Details

- Plugin structure follows OpenCode plugin conventions
- Zero custom functionality - pure pass-through wrapper
- All Conductor commands available: `/conductor:setup`, `/conductor:newTrack`, `/conductor:implement`, `/conductor:status`, `/conductor:revert`
- Tested with @opencode-ai/plugin v1.18.9

### Note

This is a minimal wrapper plugin. All functionality is provided by the wrapped `opencode-conductor-plugin`.

[0.1.0]: https://github.com/lannuttia/opencode-harness/releases/tag/v0.1.0
