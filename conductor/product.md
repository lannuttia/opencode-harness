# Product Guide: OpenCode Harness

## Initial Concept
An opinionated wrapper around opencode-conductor-plugin, providing a harness to enable context-driven development.

## Product Vision

OpenCode Harness is a minimal plugin wrapper designed to provide easy access to the Conductor methodology for individual developers using OpenCode. By wrapping opencode-conductor-plugin, it simplifies installation and provides a single entry point for context-driven development workflows.

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

### Architecture Review Integration
- Automated architectural analysis integrated into /conductor:review
- Product alignment validation against product.md specifications
- Critical issue detection for scope violations and non-goal implementations
- Extensible framework supporting multiple specialized reviewers
- Performance-optimized parallel execution

### Developer Experience
- Simple installation as a local plugin
- Access to all Conductor methodology features
- Context-driven development workflow
- Track-based planning and implementation

## Product Scope

The OpenCode Harness is a **minimal plugin wrapper** that includes:

- Simple wrapper around opencode-conductor-plugin
- Extends conductor plugin with architecture review capabilities while maintaining minimal wrapper philosophy
- Single installation point for Conductor methodology
- All Conductor commands available (/conductor:setup, /conductor:newTrack, /conductor:implement, etc.)
- Architecture review system with Product Alignment validator
- Local plugin support for easy development and testing

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
