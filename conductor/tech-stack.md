# Technology Stack: OpenCode Harness

## Core Language

### TypeScript

**Purpose:** Primary development language for the entire project

**Rationale:**
- Strong static typing improves code quality and maintainability
- Excellent IDE support with IntelliSense and refactoring tools
- Seamless integration with Node.js ecosystem
- Type safety reduces runtime errors in CLI tooling
- First-class support in the OpenCode plugin system

**Version:** Latest stable (managed via package.json)

**Configuration:**
- Strict mode enabled for maximum type safety
- ES modules for modern JavaScript compatibility
- Target ES2022 or later for Node.js compatibility

## Runtime Environment

### Bun

**Purpose:** JavaScript runtime for executing the plugin with native TypeScript support

**Rationale:**
- Native TypeScript execution without compilation
- Significantly faster than Node.js
- Compatible with OpenCode plugin architecture
- Excellent performance for plugin operations
- Built-in test runner

**Version:** Bun 1.0.0 or later

## Package Management

### Bun

**Purpose:** Package manager and fast JavaScript runtime

**Rationale:**
- Significantly faster than npm/yarn for package installation
- Built-in TypeScript support without additional configuration
- Compatible with npm registry and package.json format
- Modern tooling with improved developer experience
- Excellent performance for monorepo and workspace scenarios

**Version:** Latest stable

**Usage:**
- `bun install` for dependency management
- `bun run` for executing scripts
- Compatible with existing npm ecosystem

## Core Framework

### OpenCode Plugin System

**Purpose:** Integration platform for extending OpenCode functionality

**Components:**
- `@opencode-ai/plugin` (v1.0.223) - Core plugin SDK
- `opencode-conductor-plugin` - Conductor methodology implementation
- `opencode-workspace` - Workspace management capabilities

**Rationale:**
- Native integration with OpenCode development environment
- Access to OpenCode's context management and AI capabilities
- Plugin architecture enables modular, composable features
- Strong TypeScript support with comprehensive type definitions

## Key Dependencies

### Production Dependencies

1. **@opencode-ai/plugin (1.0.223)**
   - Core plugin SDK for OpenCode integration
   - Pinned to version 1.0.223 for exact type compatibility with opencode-conductor-plugin
   - This specific version is required due to type system incompatibilities between versions
   - Provides plugin lifecycle hooks and API access
   - Note: Version appears lower than expected due to OpenCode SDK versioning scheme

2. **opencode-conductor-plugin (^1.32.0)**
   - Implements the Conductor methodology
   - Provides track management and workflow orchestration
   - Only wrapped plugin in current implementation

Note: **opencode-workspace** was considered but not included in the initial implementation. It is a profile/bundle rather than a single plugin and was excluded from the wrapper scope.

### Development Dependencies (Recommended)

- **TypeScript** - Language compiler and type checker
- **@types/node** - Node.js type definitions
- **tsx** or **ts-node** - TypeScript execution for development
- **prettier** - Code formatting (if following style guides)
- **eslint** - Linting (if following style guides)

### Code Quality and Git Hooks

1. **husky (^9.1.7)**
   - Git hooks manager for enforcing code quality standards
   - Enables pre-commit, commit-msg, and pre-push hooks
   - Configured to work with Bun runtime

2. **@commitlint/cli (^21.2.1)**
   - Commit message linter
   - Enforces Conventional Commits specification
   - Integrated with commit-msg hook

3. **@commitlint/config-conventional (^21.2.0)**
   - Conventional Commits ruleset for commitlint
   - Supports standard commit types plus custom 'conductor' type
   - Ensures consistent commit history

**Purpose:** These tools enforce code quality standards automatically through Git hooks:
- Pre-commit: Validates TypeScript type checking
- Commit-msg: Ensures Conventional Commits format
- Pre-push: Runs full test suite before pushing

## Git Integration

### Git (System Requirement)

**Purpose:** Version control and worktree management

**Rationale:**
- Core requirement for workspace isolation via Git worktrees
- Branching strategy enables parallel track development
- Native support on all development platforms

**Minimum Version:** Git 2.25+ (for improved worktree support)

**Required Features:**
- `git worktree` command for workspace isolation
- `git notes` for metadata storage (if used per workflow)
- Branch management and checkout operations

## Architecture Patterns

### Plugin-Based Architecture

The OpenCode Harness wraps and orchestrates existing OpenCode plugins:

```
OpenCode Harness (This Project)
├── Wraps: opencode-conductor-plugin (^1.32.0)
└── Uses: @opencode-ai/plugin SDK (1.0.223)
```

**Design Principles:**
- Thin wrapper layer over existing plugins
- Opinionated defaults with configuration override
- CLI-first interface with programmatic access
- State management via JSON files in `conductor/` directory

### File System Organization

```
project/
├── .opencode/              # OpenCode configuration
│   ├── opencode.json       # Plugin registration
│   └── package.json        # Plugin dependencies
├── conductor/              # Conductor context files
│   ├── product.md
│   ├── tech-stack.md
│   ├── workflow.md
│   └── tracks/             # Track-specific workspaces
└── src/                    # Application source code
```

## Development Tools

### Recommended Toolchain

1. **Editor:** Any editor with TypeScript support (VS Code, WebStorm, etc.)
2. **Terminal:** Modern terminal with ANSI color support
3. **Git Client:** Command-line Git (GUI clients may not support all worktree features)
4. **Node Version Manager:** nvm or volta for Node.js version management

## External Services & APIs

None required. The OpenCode Harness operates entirely locally:
- No cloud services or external APIs
- No telemetry or analytics
- All data stored in local Git repository
- OpenCode AI features managed by parent OpenCode installation

## Platform Support

### Supported Platforms

- **Linux:** Full support (primary development platform)
- **macOS:** Full support
- **Windows:** Full support via WSL2 or native Git Bash

### Platform-Specific Considerations

- **Git Worktrees:** Require filesystem support for symlinks and hard links
- **Path Handling:** Use cross-platform path utilities (Node.js `path` module)
- **Line Endings:** Configure Git to handle CRLF/LF appropriately

## Future Considerations

### Potential Additions (Not Currently Planned)

- GitHub CLI (`gh`) integration for PR workflows
- Docker for containerized development environments
- CI/CD integration libraries (if automation workflows added)
- Testing frameworks (Jest, Vitest) for comprehensive test coverage
