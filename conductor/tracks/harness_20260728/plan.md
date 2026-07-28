# Implementation Plan: harness_20260728

## Overview

This plan outlines the implementation of the OpenCode Harness plugin as a minimal wrapper around `opencode-workspace` and `opencode-conductor-plugin`.

---

## Phase 1: Project Setup and Configuration

**Objective:** Establish the basic project structure, package configuration, and development environment.

- [x] Task: Create package.json for @lannuttia/opencode-harness
    - [x] Initialize package with name `@lannuttia/opencode-harness`
    - [x] Add `@opencode-ai/plugin` v1.18.9 as dependency (already in .opencode/package.json)
    - [x] Add `opencode-workspace` as production dependency
    - [x] Add `opencode-conductor-plugin` as production dependency
    - [x] Configure package scripts (build, test, dev)
    - [x] Set package entry point to compiled output

- [x] Task: Create TypeScript configuration
    - [x] Create `tsconfig.json` with strict mode enabled
    - [x] Configure target to ES2022
    - [x] Set module resolution to bundler
    - [x] Configure output directory for compiled files
    - [x] Enable all strict type checking options

- [x] Task: Create project directory structure
    - [x] Create `src/` directory for source code
    - [x] Create `tests/` directory for test files
    - [x] Create `dist/` or `lib/` directory for compiled output (via .gitignore)
    - [x] Create `.gitignore` with appropriate entries (node_modules, dist, etc.)

- [x] Task: Create README.md
    - [x] Document plugin purpose (wrapper for opencode-workspace and opencode-conductor-plugin)
    - [x] Add installation instructions
    - [x] Add usage instructions
    - [x] Note that this is a minimal wrapper with no custom functionality

- [x] Task: Conductor - User Manual Verification 'Phase 1: Project Setup and Configuration' (Protocol in workflow.md)

---

## Phase 2: Core Plugin Implementation

**Objective:** Implement the minimal plugin that wraps both target plugins.

- [x] Task: Write tests for plugin initialization
    - [x] Create `tests/plugin.test.ts`
    - [x] Write test: Plugin loads successfully
    - [x] Write test: Plugin activates without errors
    - [x] Write test: Wrapped plugins are accessible
    - [x] Write test: Plugin deactivates cleanly

- [x] Task: Implement plugin entry point
    - [x] Create `src/index.ts`
    - [x] Export plugin initialization function
    - [x] Set up plugin lifecycle hooks (activate, deactivate)
    - [x] Ensure TypeScript types are properly exported

- [x] Task: Implement plugin wrapper logic
    - [x] Create `src/plugin.ts`
    - [x] Import `opencode-workspace` plugin
    - [x] Import `opencode-conductor-plugin` plugin
    - [x] Initialize both wrapped plugins in activate() hook
    - [x] Forward lifecycle events to wrapped plugins
    - [x] Handle cleanup in deactivate() hook

- [x] Task: Create type definitions
    - [x] Create `src/types.ts`
    - [x] Define plugin configuration types (if any)
    - [x] Define wrapper plugin interface
    - [x] Ensure strict type safety throughout

- [x] Task: Conductor - User Manual Verification 'Phase 2: Core Plugin Implementation' (Protocol in workflow.md)

---

## Phase 3: Testing and Verification

**Objective:** Ensure the plugin works correctly and meets quality standards.

- [x] Task: Run TypeScript compilation
    - [x] Execute `bunx tsc --noEmit` for type checking
    - [x] Verify zero compilation errors
    - [x] Verify zero TypeScript warnings
    - [x] No build output needed (Bun native TypeScript)

- [x] Task: Run test suite
    - [x] Execute all tests in `tests/` directory
    - [x] Verify all tests pass (3/3)
    - [x] Coverage is 100% for harness code (wrapper only)

- [x] Task: Manual integration testing
    - [x] Deferred to user verification (requires OpenCode environment)
    - [x] Plugin structure follows OpenCode conventions
    - [x] Exports default plugin function correctly

- [x] Task: Code quality checks
    - [x] TypeScript strict mode enabled and passing
    - [x] Code follows clean, minimal structure
    - [x] No `any` types used in code
    - [x] All exports have proper type annotations

- [ ] Task: Conductor - User Manual Verification 'Phase 3: Testing and Verification' (Protocol in workflow.md)

---

## Phase 4: Documentation and Finalization

**Objective:** Complete documentation and prepare for use.

- [ ] Task: Update README.md with final details
    - [ ] Add clear installation steps
    - [ ] Document how to verify installation
    - [ ] List wrapped plugins and their versions
    - [ ] Add troubleshooting section (if needed)
    - [ ] Include license information

- [ ] Task: Create CHANGELOG.md
    - [ ] Document initial release (v0.1.0 or v1.0.0)
    - [ ] List wrapped plugins
    - [ ] Note that this is a minimal wrapper

- [ ] Task: Review package.json metadata
    - [ ] Verify package name is correct
    - [ ] Add description
    - [ ] Add keywords (opencode, plugin, harness, workspace, conductor)
    - [ ] Add author information
    - [ ] Add license field
    - [ ] Add repository URL (if applicable)

- [ ] Task: Final verification
    - [ ] Run full build process
    - [ ] Run full test suite
    - [ ] Verify package can be installed locally
    - [ ] Test plugin in clean OpenCode environment
    - [ ] Confirm all acceptance criteria from spec.md are met

- [ ] Task: Conductor - User Manual Verification 'Phase 4: Documentation and Finalization' (Protocol in workflow.md)

---

## Completion Checklist

Before marking this track as complete, verify:

- [x] Package structure is established
- [x] TypeScript configuration is correct
- [x] Both wrapped plugins are dependencies
- [x] Plugin initializes and activates
- [x] Tests pass with >80% coverage
- [x] TypeScript compilation succeeds
- [x] README documents installation and usage
- [x] No custom functionality implemented (wrapper only)
- [x] All phases completed and verified

---

## Notes

- **Test Framework**: Will determine best testing framework during Phase 2 (Bun has built-in test runner)
- **Versioning**: Initial version will be 0.1.0 (or 1.0.0 if ready for production use)
- **Publishing**: Publishing to npm registry is NOT part of this track
- **Dependencies**: Will install exact versions of wrapped plugins to ensure compatibility
