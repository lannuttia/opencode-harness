# Git Hooks Documentation

This project uses [Husky](https://typicode.github.io/husky/) to enforce code quality standards through Git hooks. These hooks run automatically at specific points in your Git workflow to ensure all code meets project standards before being committed or pushed.

## Overview

Three Git hooks are configured:

1. **pre-commit** - Validates TypeScript type checking before commits
2. **commit-msg** - Enforces Conventional Commits message format
3. **pre-push** - Runs the full test suite before pushes

## Pre-Commit Hook

**Location:** `.husky/pre-commit`

**Purpose:** Ensures that all TypeScript code is type-safe before creating a commit.

**What it does:**
- Runs `bunx tsc --noEmit` to check for TypeScript type errors
- Scans the entire codebase (not just staged files)
- Blocks the commit if any type errors are found

**Example output (success):**
```
Running TypeScript type check...
✓ TypeScript type check passed
```

**Example output (failure):**
```
Running TypeScript type check...
src/index.ts(10,5): error TS2322: Type 'number' is not assignable to type 'string'.

❌ TypeScript type check failed!
Please fix the type errors before committing.
Run 'bunx tsc --noEmit' to see detailed errors.
```

**How to fix common failures:**
1. Run `bunx tsc --noEmit` to see all type errors
2. Fix each type error in your code
3. Verify with `bunx tsc --noEmit` again
4. Retry your commit

## Commit Message Hook

**Location:** `.husky/commit-msg`

**Purpose:** Enforces the Conventional Commits format defined in `conductor/workflow.md`.

**What it does:**
- Validates commit messages against the Conventional Commits specification
- Ensures consistent commit history across the project
- Supports the following commit types:
  - `feat` - New features
  - `fix` - Bug fixes
  - `docs` - Documentation changes
  - `style` - Code style changes (formatting, no logic change)
  - `refactor` - Code refactoring
  - `test` - Adding or updating tests
  - `chore` - Build process or auxiliary tool changes
  - `conductor` - Conductor-specific changes (track creation, phase completion)

**Required format:**
```
<type>(<scope>): <subject>
```

**Valid examples:**
```
feat(hooks): Add Husky integration
fix(types): Resolve TypeScript compilation errors
conductor(husky_20260728): Complete Phase 1
docs(readme): Update installation instructions
test(hooks): Add pre-commit hook tests
```

**Invalid examples:**
```
fixed bug                    ❌ Missing type and scope
feat: add feature           ⚠️  Missing scope (optional but recommended)
adding new feature          ❌ Wrong format entirely
```

**Example output (failure):**
```
Validating commit message format...
⧗   input: fixed bug
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

❌ Commit message validation failed!

Valid commit message format: <type>(<scope>): <subject>

Allowed types: feat, fix, docs, style, refactor, test, chore, conductor

Examples:
  feat(hooks): Add Husky integration
  fix(types): Resolve TypeScript compilation errors
  conductor(husky_20260728): Complete Phase 1
```

**How to fix:**
1. Review the commit message format requirements above
2. Amend your commit message: `git commit --amend`
3. Follow the `<type>(<scope>): <subject>` format
4. Save and the hook will validate again

## Pre-Push Hook

**Location:** `.husky/pre-push`

**Purpose:** Ensures all tests pass before code is pushed to the remote repository.

**What it does:**
- Runs `bun test` to execute the full test suite
- Blocks the push if any tests fail
- Provides detailed output about which tests failed

**Example output (success):**
```
Running test suite...
bun test v1.3.9

 15 pass
 0 fail

✓ All tests passed
```

**Example output (failure):**
```
Running test suite...
bun test v1.3.9

 12 pass
 3 fail

❌ Test suite failed!
Please fix failing tests before pushing.
Run 'bun test' to see detailed test results.
```

**How to fix common failures:**
1. Run `bun test` locally to see which tests are failing
2. Fix the failing tests or the code causing them to fail
3. Run `bun test` again to verify all tests pass
4. Retry your push

## Bypassing Hooks (Emergency Use Only)

In rare cases where you need to bypass the hooks (e.g., work-in-progress commits), you can use the `--no-verify` flag:

**Bypass pre-commit and commit-msg hooks:**
```bash
git commit --no-verify -m "wip: temporary work in progress"
```

**Bypass pre-push hook:**
```bash
git push --no-verify
```

**⚠️ WARNING:** Bypassing hooks should be avoided whenever possible. Use this only in exceptional circumstances:
- Creating work-in-progress commits on a feature branch
- Emergency hotfixes where hooks are temporarily failing
- Pushing non-code changes that don't affect functionality

**DO NOT** use `--no-verify` to bypass hooks when:
- Your code has type errors
- Tests are failing
- You don't want to follow commit message standards

## Performance Expectations

Based on the specification requirements:

- **Pre-commit (TypeScript check):** Should complete in <10 seconds for typical changes
- **Pre-push (Test suite):** Should complete in <30 seconds for the current test suite

If hooks are taking significantly longer:
1. Check if there are configuration issues
2. Ensure your development environment meets the minimum requirements
3. Consider if the codebase has grown significantly and adjust expectations

## Troubleshooting

### Hook not running

**Problem:** Git hooks don't seem to execute

**Solutions:**
1. Ensure hooks are installed: `bun run prepare`
2. Verify hooks are executable: `ls -la .husky/`
3. Reinstall Husky: `bun install`

### Hook script fails with "command not found"

**Problem:** Hook script can't find `bunx`, `bun`, or other commands

**Solutions:**
1. Ensure Bun is installed and in your PATH
2. Verify you're running the command from the project root
3. Check that `node_modules/.bin` is accessible

### TypeScript check finds errors in node_modules

**Problem:** Pre-commit hook reports type errors from dependencies

**Solutions:**
1. Check `tsconfig.json` excludes `node_modules`
2. Ensure `skipLibCheck: true` is set in `tsconfig.json`
3. Update TypeScript: `bun update typescript`

### Commit message validation too strict

**Problem:** Valid-looking commit messages are rejected

**Solutions:**
1. Review the format carefully: `<type>(<scope>): <subject>`
2. Ensure the type is one of the allowed types (see list above)
3. Check `commitlint.config.js` for custom rules
4. Use a scope (e.g., `feat(hooks):` not just `feat:`)

## Configuration Files

- **Husky setup:** `.husky/` directory
- **Commitlint config:** `commitlint.config.js`
- **TypeScript config:** `tsconfig.json`
- **Test script:** `package.json` (scripts.test)

## Further Reading

- [Husky Documentation](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [commitlint](https://commitlint.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Conductor Workflow](../conductor/workflow.md)
