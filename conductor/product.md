# Product Guide: OpenCode Harness

## Initial Concept
An opinionated wrapper around opencode-conductor-plugin and opencode-workspace, providing a harness to enable context-driven development leveraging Git workspaces for workstream isolation.

## Product Vision

OpenCode Harness is a comprehensive framework designed to streamline context-driven development workflows for individual developers using OpenCode. By integrating the Conductor methodology with Git workspace isolation, it provides a powerful development environment that maintains clear separation of concerns across multiple workstreams while preserving full project context.

## Target Users

**Primary Audience:** Individual developers who:
- Work on multiple features or bug fixes simultaneously
- Need to maintain context across different workstreams
- Value structured, methodical development approaches
- Want to leverage Git's branching capabilities with enhanced workflow automation

**User Characteristics:**
- Comfortable with Git and command-line tools
- Appreciate opinionated workflows that enforce best practices
- Work on projects requiring clear separation between concurrent development tracks
- Value automated task management and context preservation

## Core Problems Solved

1. **Context Switching Overhead:** Eliminates the mental load of switching between different features or bug fixes by maintaining isolated workspaces
2. **Workflow Inconsistency:** Provides an opinionated framework that enforces consistent development practices across all workstreams
3. **Lost Context:** Preserves project context, requirements, and implementation details within each workspace
4. **Manual Task Tracking:** Automates task breakdown, planning, and progress tracking through Conductor integration

## Key Features

### Git Workspace Integration
- Automatic creation and management of Git worktrees for each development track
- Isolated file systems per workspace preventing cross-contamination
- Seamless switching between workstreams without losing uncommitted work

### Conductor Methodology Integration
- Opinionated workflow enforcement via opencode-conductor-plugin
- Automatic generation of implementation plans with phased task breakdowns
- Built-in verification protocols and checkpointing
- Context-aware task management

### Comprehensive Framework Capabilities
- Project initialization with guided setup
- Template-based code style guide management
- Technology stack documentation and enforcement
- Automated workflow configuration
- Track-based development with detailed specifications

### Developer Experience
- Single command to create new isolated workstreams
- Automatic context loading when switching workspaces
- Built-in best practices and guardrails
- Clear visibility into all active tracks and their status

## Product Scope

The OpenCode Harness is a **comprehensive framework** that includes:

- Complete project scaffolding and initialization
- Multiple pre-configured code style guides for common languages
- Workflow templates with customization options
- Git workspace lifecycle management
- Integration with OpenCode's native plugin ecosystem
- Documentation generation and maintenance
- State management and recovery mechanisms

## Success Criteria

1. **Developer Productivity:** Developers can create and switch between workstreams in under 30 seconds
2. **Context Preservation:** 100% of project context (specs, plans, guidelines) is automatically available in each workspace
3. **Workflow Compliance:** All development tracks follow the same structured methodology without manual enforcement
4. **Zero Conflicts:** Git workspace isolation prevents merge conflicts from concurrent development
5. **Adoption:** Individual developers can onboard and become productive within one development session

## Non-Goals

- Team collaboration features (designed for individual developers)
- Custom Git hosting or repository management
- IDE-specific integrations beyond OpenCode
- Deployment or CI/CD pipeline management
- Code review or approval workflows
