# Track Specification: Automated Releases and CHANGELOG Management

## Overview

Implement automated release management and CHANGELOG generation for the OpenCode Harness project, following the proven approach from the opencode-git-trailers repository. The system will use semantic-release to automatically version packages based on conventional commits, generate comprehensive CHANGELOGs, and publish to NPM using GitHub Actions with provenance and trusted publishing.

## Functional Requirements

### FR1: Manual Pre-release Setup

**Description:** Enable manual publishing of an initial pre-release version to configure NPM trusted publisher authentication.

**Requirements:**
- Update package.json with semantic-release script (reference: opencode-git-trailers)
- Provide clear documentation for manual pre-release process:
  - Run `bun version prerelease` to bump version to pre-release
  - Run `bun publish` to publish package to NPM
- No build step required (Bun handles TypeScript natively)
- Establish initial NPM package presence for trusted publishing configuration

### FR2: GitHub Actions Workflow for Automated Releases

**Description:** Create GitHub Actions workflow that automatically releases new versions when commits are merged to the main branch.

**Requirements:**
- Trigger on push to main branch
- Use semantic-release to determine version based on conventional commits:
  - `feat:` commits → minor version bump
  - `fix:` commits → patch version bump
  - `BREAKING CHANGE:` or commits with `!` → major version bump
- Generate git tags for each release
- Create GitHub Releases with auto-generated release notes
- Publish package to NPM registry

### FR3: NPM Provenance and Trusted Publishing

**Description:** Configure secure NPM publishing using GitHub OIDC and provenance attestations.

**Requirements:**
- Set up GitHub Actions with `id-token: write` permission
- Configure NPM provenance using `--provenance` flag during publish
- Use GitHub OIDC authentication (no NPM_TOKEN required)
- Generate signed attestations linking package to source code and build
- Reference implementation: opencode-git-trailers/.github/workflows/

### FR4: Automated CHANGELOG Generation

**Description:** Automatically generate and maintain CHANGELOG.md based on conventional commits.

**Requirements:**
- Use conventional-changelog or semantic-release plugins
- Generate CHANGELOG entries from commit messages:
  - Group by type (Features, Bug Fixes, Breaking Changes, etc.)
  - Include commit scope and description
  - Link to commits and GitHub issues/PRs
- Update CHANGELOG.md file in repository on each release
- Commit CHANGELOG updates back to main branch after release
- Format: Conventional Commits standard (matching opencode-git-trailers)

### FR5: Package.json Scripts and Configuration

**Description:** Configure package.json with necessary scripts and semantic-release configuration.

**Requirements:**
- Add `release` script pointing to semantic-release
- Configure semantic-release plugins (reference opencode-git-trailers):
  - @semantic-release/commit-analyzer
  - @semantic-release/release-notes-generator
  - @semantic-release/changelog
  - @semantic-release/npm
  - @semantic-release/github
  - @semantic-release/git
- Support custom commit type: `conductor` (as defined in commitlint config)
- Ensure compatibility with Bun runtime

## Non-Functional Requirements

### NFR1: Security
- Use GitHub OIDC for authentication (no long-lived tokens)
- Verify provenance attestations are generated for all releases
- Ensure workflow has minimal required permissions

### NFR2: Reliability
- Releases should be idempotent (safe to re-run)
- Failed releases should not leave repository in broken state
- Version conflicts should be detected and reported

### NFR3: Maintainability
- Workflow configuration should mirror opencode-git-trailers for consistency
- Clear documentation for troubleshooting release failures
- Minimal dependencies (prefer semantic-release plugins over custom scripts)

### NFR4: Developer Experience
- Zero manual intervention required for standard releases
- Clear feedback in GitHub Actions logs for release process
- Easy to verify release success through GitHub Releases page

## Acceptance Criteria

1. **Manual Pre-release Complete:**
   - User successfully runs `bun version prerelease` and `bun publish`
   - Package appears on NPM with pre-release version
   - Trusted publisher is configured on NPM

2. **Automated Release Workflow:**
   - Merging a commit with `feat:` prefix to main triggers minor version bump
   - Merging a commit with `fix:` prefix to main triggers patch version bump
   - New version is published to NPM with provenance
   - Git tag is created and pushed
   - GitHub Release is created with generated notes

3. **CHANGELOG Generation:**
   - CHANGELOG.md is created/updated on each release
   - Entries are grouped by commit type
   - Links to commits and issues are included
   - File is committed back to main branch

4. **Provenance Verification:**
   - NPM package page shows provenance badge
   - Attestations can be verified using `npm audit signatures`
   - Package links to source repository and specific commit

5. **Integration:**
   - Workflow matches structure from opencode-git-trailers
   - All semantic-release plugins are configured correctly
   - Custom `conductor` commit type is recognized
   - Process works with existing husky/commitlint setup

## Out of Scope

- Pre-release automation for development branches (only stable releases)
- Traditional NPM token authentication (provenance-only)
- Manual version specification overrides
- Release notes customization beyond conventional commits
- Deployment or distribution beyond NPM registry
- Rollback or version revert automation
- Multi-package monorepo support (single package only)
