# Implementation Plan: Automated Releases and CHANGELOG Management

## Phase 1: Manual Pre-release Setup and Package Preparation

- [ ] Task: Review current package.json configuration
    - [ ] Verify repository, homepage, and bugs URLs are set correctly
    - [ ] Ensure publishConfig is configured for public access
    - [ ] Validate package.json has all required fields for NPM publishing
    - [ ] Check that files array includes only dist/ folder

- [ ] Task: Research opencode-git-trailers configuration
    - [ ] Review .releaserc.json semantic-release configuration
    - [ ] Document dependencies and plugin versions used
    - [ ] Note the workflow_run trigger pattern for CI/Release separation
    - [ ] Understand the Node.js + Bun hybrid approach

- [ ] Task: Create manual pre-release documentation
    - [ ] Write step-by-step guide in README or docs/
    - [ ] Document `bun version prerelease` command usage
    - [ ] Document `bun publish` command usage
    - [ ] Include NPM trusted publisher setup instructions
    - [ ] Add troubleshooting section for common issues

- [ ] Task: Execute manual pre-release
    - [ ] Run `bun version prerelease` to bump version to pre-release
    - [ ] Verify version in package.json is updated correctly
    - [ ] Run `bun publish` to publish package to NPM
    - [ ] Verify package appears on NPM registry
    - [ ] Configure NPM trusted publisher settings for the package

- [ ] Task: Conductor - User Manual Verification 'Phase 1: Manual Pre-release Setup and Package Preparation' (Protocol in workflow.md)

## Phase 2: Semantic-release Configuration

- [ ] Task: Install semantic-release dependencies
    - [ ] Install @semantic-release/commit-analyzer
    - [ ] Install @semantic-release/release-notes-generator
    - [ ] Install @semantic-release/changelog
    - [ ] Install @semantic-release/npm (with provenance support)
    - [ ] Install @semantic-release/github
    - [ ] Install @semantic-release/git
    - [ ] Install semantic-release as dev dependency

- [ ] Task: Create .releaserc.json configuration file
    - [ ] Set branches array to ["main"]
    - [ ] Configure plugins array in the correct order
    - [ ] Add @semantic-release/commit-analyzer plugin
    - [ ] Add @semantic-release/release-notes-generator plugin
    - [ ] Add @semantic-release/changelog plugin
    - [ ] Configure @semantic-release/npm with npmPublish: true and provenance: true
    - [ ] Configure @semantic-release/git to commit package.json, bun.lock, and CHANGELOG.md
    - [ ] Set git plugin commit message format with [skip ci]
    - [ ] Add @semantic-release/github plugin for release creation

- [ ] Task: Update package.json scripts
    - [ ] Add "release": "semantic-release" script
    - [ ] Verify "prepublishOnly": "bun run build" exists
    - [ ] Ensure "build": "tsc" script is present
    - [ ] Note: Lint script was upgraded from placeholder to full ESLint implementation during this phase

- [ ] Task: Test semantic-release locally (dry-run)
    - [ ] Run `bunx semantic-release --dry-run` to test configuration
    - [ ] Verify version calculation works correctly
    - [ ] Check CHANGELOG preview output format
    - [ ] Validate git tag would be created correctly
    - [ ] Ensure no errors in plugin configuration

- [ ] Task: Conductor - User Manual Verification 'Phase 2: Semantic-release Configuration' (Protocol in workflow.md)

## Phase 3: GitHub Actions Setup - Composite Action

- [ ] Task: Create setup-bun composite action
    - [ ] Create .github/actions/setup-bun/ directory
    - [ ] Create action.yml file
    - [ ] Define inputs (bun-version with default '1.x')
    - [ ] Add step to use oven-sh/setup-bun@v2
    - [ ] Add step to run bun install --frozen-lockfile
    - [ ] Match structure from opencode-git-trailers reference

- [ ] Task: Conductor - User Manual Verification 'Phase 3: GitHub Actions Setup - Composite Action' (Protocol in workflow.md)

## Phase 4: CI Workflow Implementation

- [ ] Task: Create CI workflow file
    - [ ] Create .github/workflows/ci.yml
    - [ ] Configure triggers: push and pull_request on main branch
    - [ ] Add concurrency group for canceling in-progress runs
    - [ ] Set runs-on: ubuntu-latest

- [ ] Task: Configure CI workflow steps
    - [ ] Add checkout step using actions/checkout@v7
    - [ ] Add setup-bun step using local composite action
    - [ ] Add lint step: bun run lint
    - [ ] Add build step: bun run build
    - [ ] Add test step: bun run test:coverage

- [ ] Task: Add coverage upload (optional)
    - [ ] Add Codecov upload step (conditional on push to main)
    - [ ] Configure with codecov/codecov-action@v7
    - [ ] Set fail_ci_if_error: false
    - [ ] Use CODECOV_TOKEN secret if coverage reporting is desired

- [ ] Task: Test CI workflow
    - [ ] Create a test commit on a branch
    - [ ] Open pull request to trigger CI
    - [ ] Verify all steps pass (lint, build, test)
    - [ ] Check that workflow completes successfully

- [ ] Task: Conductor - User Manual Verification 'Phase 4: CI Workflow Implementation' (Protocol in workflow.md)

## Phase 5: Release Workflow Implementation

- [ ] Task: Create release workflow file
    - [ ] Create .github/workflows/release.yml
    - [ ] Configure workflow_run trigger on CI workflow completion
    - [ ] Filter for completed workflows on main branch
    - [ ] Add conditional: only run if CI succeeded and event was push (not PR)

- [ ] Task: Configure release workflow permissions
    - [ ] Set contents: write for creating tags and releases
    - [ ] Set issues: write for semantic-release issue management
    - [ ] Set pull-requests: write for PR updates
    - [ ] Set id-token: write for NPM provenance (OIDC)

- [ ] Task: Configure release workflow steps
    - [ ] Add checkout with fetch-depth: 0 for full git history
    - [ ] Use ref: github.event.workflow_run.head_sha for correct commit
    - [ ] Add setup-node step with Node.js 24 and npm cache
    - [ ] Add setup-bun step using local composite action
    - [ ] Add build step: bun run build
    - [ ] Add release step: bunx semantic-release with GITHUB_TOKEN

- [ ] Task: Test release workflow
    - [ ] Create test commit with conventional format (e.g., feat: test release)
    - [ ] Merge to main branch
    - [ ] Verify CI workflow runs and succeeds
    - [ ] Verify release workflow triggers after CI
    - [ ] Check that semantic-release runs successfully

- [ ] Task: Conductor - User Manual Verification 'Phase 5: Release Workflow Implementation' (Protocol in workflow.md)

## Phase 6: Validation and Integration Testing

- [ ] Task: Verify first automated release
    - [ ] Check that git tag was created (e.g., v1.0.0)
    - [ ] Verify GitHub Release was created with release notes
    - [ ] Confirm package was published to NPM
    - [ ] Check CHANGELOG.md was created and committed
    - [ ] Validate commit message includes [skip ci]

- [ ] Task: Verify NPM provenance
    - [ ] Visit NPM package page and check for provenance badge
    - [ ] Run `npm audit signatures` on the published package
    - [ ] Verify attestation links to correct GitHub commit
    - [ ] Validate provenance metadata is complete

- [ ] Task: Test different commit types
    - [ ] Test feat: commit (should trigger minor version bump)
    - [ ] Test fix: commit (should trigger patch version bump)
    - [ ] Verify CHANGELOG.md groups entries correctly (Features, Bug Fixes)
    - [ ] Check that each commit type generates appropriate release notes

- [ ] Task: Integration with existing husky/commitlint
    - [ ] Verify commitlint validates conventional commit format
    - [ ] Test that pre-commit hooks still function correctly
    - [ ] Ensure semantic-release commits pass commitlint validation
    - [ ] Confirm no conflicts with existing git hooks

- [ ] Task: Update documentation
    - [ ] Document the automated release process in README
    - [ ] Add section explaining conventional commit requirements
    - [ ] Document how releases are triggered (merge to main)
    - [ ] Include troubleshooting guide for release failures
    - [ ] Add examples of commit messages and their version bump effects
    - [ ] Document the two-workflow approach (CI + Release)

- [ ] Task: Conductor - User Manual Verification 'Phase 6: Validation and Integration Testing' (Protocol in workflow.md)

## Phase 7: Cleanup and Final Validation

- [ ] Task: Clean up test artifacts
    - [ ] Review git tags and remove any test tags if necessary
    - [ ] Clean up test branches
    - [ ] Remove any debug code or console.log statements
    - [ ] Verify no unused dependencies remain

- [ ] Task: Final validation checklist
    - [ ] Verify all acceptance criteria from spec.md are met
    - [ ] Run complete release flow one final time
    - [ ] Check CHANGELOG.md is properly formatted
    - [ ] Validate NPM provenance is working correctly
    - [ ] Ensure GitHub releases are created with correct notes
    - [ ] Confirm documentation is complete and accurate
    - [ ] Test that [skip ci] prevents infinite release loops

- [ ] Task: Create handoff documentation
    - [ ] Document all configuration decisions made
    - [ ] List all dependencies added and their purposes
    - [ ] Provide maintenance guide for semantic-release updates
    - [ ] Include links to opencode-git-trailers reference
    - [ ] Note the Node.js + Bun hybrid approach rationale

- [ ] Task: Conductor - User Manual Verification 'Phase 7: Cleanup and Final Validation' (Protocol in workflow.md)

## Phase: Review Fixes

- [x] Task: Apply review suggestions bdf451e
