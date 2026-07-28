# Conductor Workflow

## Overview

This document defines the standard development workflow for the OpenCode Harness project. All development work is organized into **tracks** (high-level units of work) that follow a structured, phased approach from specification to implementation.

## Core Principles

1. **Context-Driven Development:** Every track maintains complete context including specifications, plans, and guidelines
2. **Git Workspace Isolation:** Each track operates in an isolated Git worktree to prevent cross-contamination
3. **Phased Implementation:** Work is broken down into logical phases with clear verification points
4. **Test-First Approach:** Tests are written before implementation to ensure quality
5. **Continuous Verification:** Each phase includes verification steps before proceeding

## Track Lifecycle

### 1. Track Creation

When a new track is created:

1. **Generate Track ID:** Format `shortname_YYYYMMDD` (e.g., `auth_20260728`)
2. **Create Track Directory:** `conductor/tracks/<track_id>/`
3. **Initialize Artifacts:**
   - `metadata.json` - Track metadata (ID, type, status, timestamps)
   - `spec.md` - Detailed specification
   - `plan.md` - Phased implementation plan
   - `index.md` - Track context index
4. **Create Git Workspace:** Isolated worktree for this track
5. **Update Registry:** Add entry to `conductor/tracks.md`

### 2. Track Implementation

Tracks follow a structured phased approach:

#### Phase Structure

Each track is divided into phases, and each phase contains:

- **Tasks:** Specific implementation steps
- **Sub-tasks:** Granular work items (e.g., "Write tests", "Implement feature")
- **Verification:** Manual or automated checks to confirm phase completion

#### Task Execution

For each task in the plan:

1. **Mark Task In Progress:** Update `plan.md` status markers
2. **Execute Sub-tasks:** Follow the defined sub-tasks in order
3. **Verify Completion:** Run tests, checks, or manual verification
4. **Commit Changes:** Commit after completing the task
5. **Mark Task Complete:** Update `plan.md` status markers

### 3. Phase Completion Verification and Checkpointing Protocol

At the end of each phase, the following protocol is executed:

#### Verification Steps

1. **Automated Checks:**
   - Run all relevant tests for the phase
   - Verify code coverage meets minimum threshold (>80%)
   - Run linter and type checker (for TypeScript)
   - Verify build succeeds

2. **Manual Review (User-Driven):**
   - User manually reviews the implemented functionality
   - User verifies the phase objectives are met
   - User confirms readiness to proceed

3. **User Confirmation:**
   - The system prompts: "Phase '<Phase Name>' verification complete. Proceed to next phase? (yes/no)"
   - If yes: Continue to next phase
   - If no: Address issues and re-run verification

#### Checkpointing

After phase verification is confirmed:

1. **Create Commit:** All changes in the phase are committed
2. **Commit Message Format:**
   ```
   conductor(<track_id>): Complete <Phase Name>
   
   - Task 1 summary
   - Task 2 summary
   - Task 3 summary
   
   Phase: <Phase Name>
   Coverage: <percentage>%
   Tests: <passed>/<total>
   ```
3. **Update Metadata:** Update `conductor/tracks/<track_id>/metadata.json` with completion timestamp
4. **Update Plan:** Mark all tasks in the phase as complete in `plan.md`

### 4. Track Completion

When all phases are complete:

1. **Final Verification:**
   - Run full test suite
   - Verify coverage >80%
   - Manual review of all implemented functionality

2. **Merge to Main:**
   - Create final commit with all changes
   - Merge track branch to main branch
   - Delete Git worktree (optional, preserve if needed for reference)

3. **Update Registry:**
   - Mark track as "completed" in `conductor/tracks.md`
   - Update metadata.json status to "completed"

## Development Standards

### Test Coverage

- **Minimum Coverage:** 80% code coverage for all new code
- **Test-First:** Write tests before implementation for new features
- **Test Types:**
  - Unit tests for individual functions/classes
  - Integration tests for component interactions
  - End-to-end tests for critical user workflows

### Code Quality

- **TypeScript Strict Mode:** All code must pass strict type checking
- **Linting:** Code must pass ESLint/Prettier checks
- **No Compiler Warnings:** Zero TypeScript compiler warnings allowed
- **Style Guide Compliance:** Follow `conductor/code_styleguides/typescript.md`

### Git Commit Standards

#### Commit Frequency

- **Commit after each task:** Create a commit after completing each task in the plan
- **Atomic commits:** Each commit should represent a single, complete unit of work
- **No broken commits:** Every commit should pass tests and build successfully

#### Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `conductor`: Conductor-specific changes (track creation, phase completion)

**Examples:**
```
feat(track-manager): Add workspace isolation support

Implement Git worktree creation and management for track isolation.
Includes automatic cleanup of stale worktrees.

Tests: 15/15 passed
Coverage: 92%
```

```
conductor(auth_20260728): Complete Phase 1 - Setup and Configuration

- Created workspace structure
- Initialized Git worktree
- Added TypeScript configuration

Phase: Setup and Configuration
Coverage: 85%
Tests: 8/8 passed
```

### Branch Naming

- **Track branches:** `track/<track_id>` (e.g., `track/auth_20260728`)
- **Main branch:** `main`
- **No direct commits to main:** All work happens in track branches

### Task Summaries

Task summaries are recorded in:

1. **Git Commit Messages:** Detailed summary in the commit body
2. **Plan Updates:** Status markers updated in `plan.md` to track progress

## Error Handling

### When Tests Fail

1. **Do not proceed:** If tests fail, fix them before continuing
2. **Debug:** Investigate the root cause of the failure
3. **Fix:** Implement the fix
4. **Re-run:** Verify all tests pass
5. **Commit:** Create a fix commit if needed

### When Coverage Drops Below Threshold

1. **Identify gaps:** Use coverage report to find untested code
2. **Add tests:** Write additional tests to cover gaps
3. **Re-run:** Verify coverage meets threshold
4. **Update plan:** Add test tasks if needed for future phases

### When User Rejects Phase Verification

1. **Identify issues:** User provides feedback on what needs to be addressed
2. **Create fix tasks:** Add tasks to the current phase to address issues
3. **Implement fixes:** Execute fix tasks
4. **Re-verify:** Run verification protocol again
5. **Repeat:** Continue until user approves

## Workflow Automation

### Automated Actions

The Conductor system automates:

1. **Track creation:** Generates all artifacts and directory structure
2. **Git worktree management:** Creates and manages isolated workspaces
3. **Plan parsing:** Reads and interprets `plan.md` task structure
4. **Status tracking:** Updates task completion markers in `plan.md`
5. **Verification execution:** Runs automated tests and coverage checks
6. **Commit generation:** Creates properly formatted commits

### Manual Actions

The user is responsible for:

1. **Writing code:** Implement features and fixes
2. **Writing tests:** Create test cases
3. **Manual verification:** Review implemented functionality
4. **Phase approval:** Confirm phase completion
5. **Debugging:** Fix failing tests or issues
6. **Code review:** Review changes before merging

## Best Practices

### Planning

- **Break down work:** Divide large features into small, manageable tasks
- **Define success criteria:** Each task should have clear completion criteria
- **Estimate effort:** Consider complexity when ordering tasks

### Implementation

- **Follow the plan:** Execute tasks in the defined order
- **Update as you go:** Mark tasks complete immediately after finishing
- **Test frequently:** Run tests after each meaningful change
- **Commit regularly:** Don't accumulate too many changes before committing

### Verification

- **Run full test suite:** Don't rely on individual test runs
- **Check coverage:** Ensure new code is tested
- **Manual testing:** Test the feature as a user would
- **Review changes:** Look at the diff before committing

### Communication

- **Clear commit messages:** Future you will thank you
- **Document decisions:** Explain non-obvious choices in comments
- **Update specs:** If requirements change, update `spec.md`
- **Ask for help:** Reach out if stuck or uncertain

## Integration with OpenCode

### OpenCode Commands

The Conductor workflow integrates with OpenCode through:

1. **`/conductor:setup`** - Initialize Conductor for a project
2. **`/conductor:newTrack`** - Create a new track
3. **`/conductor:implement`** - Start implementing a track
4. **`/conductor:verify`** - Run verification for current phase
5. **`/conductor:status`** - Show current track status

### Context Awareness

OpenCode AI agents have access to:

- All Conductor context files (`conductor/`)
- Current track specification and plan
- Code style guides
- Tech stack documentation
- Product guidelines

This context enables informed code generation and suggestions.

## Customization

This workflow can be customized by editing this file. Common customizations:

- **Test coverage threshold:** Change >80% to your preferred percentage
- **Commit frequency:** Change from per-task to per-phase or other cadence
- **Verification steps:** Add or remove automated checks
- **Commit message format:** Adjust to team preferences
- **Branch naming:** Use different naming convention

After customization, ensure all team members are aware of changes.
