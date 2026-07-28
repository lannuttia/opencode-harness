# Track Specification: Husky Git Hooks Integration

## Overview

Integrate Husky to enforce project standards deterministically through Git hooks. This ensures code quality, commit message format, and test coverage are validated before commits and pushes, preventing non-compliant code from entering the repository.

## Functional Requirements

### 1. Husky Installation and Configuration

- Install Husky as a development dependency
- Initialize Husky in the project using `husky init`
- Configure Husky to work with Bun runtime environment
- Create `.husky/` directory with necessary hook scripts

### 2. Pre-Commit Hook

**Purpose:** Validate code quality before each commit

**Checks to perform:**
- TypeScript type checking on entire codebase (`tsc --noEmit`)
- Ensure zero type errors before allowing commit
- Fail and block commit if type errors are detected

**Execution:**
- Runs automatically before `git commit` completes
- Must pass before commit is created
- Cannot be bypassed without `--no-verify` flag

### 3. Commit-Msg Hook

**Purpose:** Enforce Conventional Commits format as defined in `conductor/workflow.md`

**Requirements:**
- Install and configure `@commitlint/cli` and `@commitlint/config-conventional`
- Validate commit messages against Conventional Commits specification
- Support types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `conductor`
- Require format: `<type>(<scope>): <subject>`
- Block commits with non-conforming messages

**Examples of valid commits:**
```
feat(hooks): Add Husky integration
fix(types): Resolve TypeScript compilation errors
conductor(husky_20260728): Complete Phase 1
```

### 4. Pre-Push Hook

**Purpose:** Run full test suite before pushing to remote

**Checks to perform:**
- Execute complete test suite using Bun's test runner
- Verify all tests pass
- Block push if any tests fail

**Execution:**
- Runs automatically before `git push` completes
- Must pass before push is allowed
- Cannot be bypassed without `--no-verify` flag

### 5. Configuration Files

**Required files:**
- `.husky/pre-commit` - Pre-commit hook script
- `.husky/commit-msg` - Commit message validation script
- `.husky/pre-push` - Pre-push test execution script
- `.commitlintrc.json` or `commitlint.config.js` - Commitlint configuration
- Updates to `package.json` with Husky prepare script

## Non-Functional Requirements

### Performance

- Pre-commit TypeScript check should complete in <10 seconds for typical changes
- Pre-push tests should complete in reasonable time (target <30 seconds for current test suite)
- Hooks should provide clear, actionable feedback when they fail

### Developer Experience

- Clear error messages indicating which check failed and why
- Instructions on how to fix common failures
- Hooks should integrate seamlessly with existing Git workflow
- Documentation should be added to README or separate HOOKS.md file

### Compatibility

- Must work with Bun runtime (not just Node.js)
- Must be compatible with existing Git worktree-based Conductor workflow
- Should work across Linux, macOS, and Windows (WSL2)

## Acceptance Criteria

1. **Installation Success:**
   - `bun install` successfully installs Husky and commitlint dependencies
   - `.husky/` directory is created with executable hook scripts
   - `package.json` includes `prepare` script that runs `husky`

2. **Pre-Commit Validation:**
   - Attempting to commit with TypeScript errors is blocked
   - Clear error message shows which files/lines have type errors
   - Commit succeeds when no type errors exist

3. **Commit Message Validation:**
   - Invalid commit messages (e.g., "fixed bug") are rejected
   - Valid Conventional Commits format is accepted
   - Error message explains the required format with examples

4. **Pre-Push Validation:**
   - Push is blocked if any tests fail
   - Clear output shows which tests failed
   - Push succeeds when all tests pass

5. **Bypass Capability:**
   - `git commit --no-verify` bypasses pre-commit and commit-msg hooks
   - `git push --no-verify` bypasses pre-push hook
   - Bypass should be documented but discouraged

6. **Documentation:**
   - README or HOOKS.md explains what each hook does
   - Instructions for fixing common hook failures
   - How to bypass hooks in emergency situations

## Out of Scope

- ESLint or Prettier integration (only TypeScript type checking for now)
- Lint-staged for checking only staged files
- Post-merge or other Git hooks beyond pre-commit, commit-msg, and pre-push
- Custom commit message templates
- Integration with CI/CD pipelines (that's separate)
- Team-wide enforcement mechanisms (this is for local development)

## Dependencies

**New Dependencies:**
- `husky` (latest stable version)
- `@commitlint/cli` (latest stable version)
- `@commitlint/config-conventional` (latest stable version)

**Existing Dependencies:**
- TypeScript (already installed)
- Bun test runner (built-in)
- Git (system requirement)
