# Track Specification: Specialized Architecture Reviewer

## Overview

Extend the `/conductor:review` command with a specialized architecture reviewer that provides comprehensive architectural analysis of track implementations. This reviewer supplements the existing review functionality by running multiple specialized subagents to evaluate design patterns, component boundaries, tech stack compliance, and product alignment.

## Functional Requirements

### FR1: Automatic Integration with /conductor:review

**Description:** The architecture reviewer must run automatically whenever `/conductor:review` is invoked, extending the existing review workflow without requiring separate commands or flags.

**Behavior:**
- Execute as part of the existing review process
- Run in addition to (not replacing) the current reviewer
- Maintain backward compatibility with existing review functionality

### FR2: Multiple Specialized Subagents

**Description:** Implement multiple specialized subagents, each focusing on a specific architectural concern.

**Initial Implementation:** Product Alignment Reviewer
- Verify implementation aligns with product vision in `product.md`
- Check against product scope and non-goals
- Validate feature implementation matches target user needs
- Ensure changes support core problems being solved

**Future Subagents (Out of Scope for Initial Implementation):**
- Design Patterns Reviewer: Evaluate adherence to SOLID, DDD, and other architectural patterns
- Component Boundaries Reviewer: Check separation of concerns, module boundaries, coupling/cohesion
- Tech Stack Compliance Reviewer: Verify implementation follows `tech-stack.md` specifications

### FR3: Comprehensive Context Analysis

**Description:** The architecture reviewer must analyze all relevant Conductor context files to perform thorough reviews.

**Required Context Files:**
- `conductor/product.md` - Product vision, target users, scope
- `conductor/tech-stack.md` - Technology stack specifications
- `conductor/workflow.md` - Development workflow standards
- `conductor/code_styleguides/` - Code style guides
- Track-specific files: `spec.md`, `plan.md`, implementation code

### FR4: Track-Level Review Granularity

**Description:** Perform architectural review at the track level, considering the entire implementation holistically.

**Behavior:**
- Analyze all code changes within the track
- Consider relationships between phases and tasks
- Evaluate architectural consistency across the entire feature
- Review against the track's `spec.md` and `plan.md`

### FR5: Unified Report Generation

**Description:** Aggregate results from all specialized reviewers into a single, comprehensive report.

**Report Structure:**
- Follow the existing `/conductor:review` report format for consistency
- Include sections for each specialized reviewer's findings
- Provide clear categorization of issues (critical, warning, info)
- Include actionable recommendations for addressing issues
- Reference specific files, line numbers, and context

### FR6: Critical Issue Blocking

**Description:** Prevent review completion when critical architectural issues are identified.

**Behavior:**
- Identify and categorize issues by severity (critical, warning, info)
- Block review completion if any critical issues are found
- Require user acknowledgment and resolution before proceeding
- Allow warnings and info items to be non-blocking

## Non-Functional Requirements

### NFR1: Performance

- Architecture review should complete within reasonable time (< 2 minutes for typical tracks)
- Run subagents in parallel where possible to minimize total review time
- Cache context file analysis to avoid redundant processing

### NFR2: Extensibility

- Design the architecture to easily add new specialized reviewers
- Support configuration of which reviewers to run
- Allow custom reviewer plugins in the future

### NFR3: User Experience

- Provide clear, actionable feedback
- Use consistent terminology with existing Conductor documentation
- Display progress indicators during review execution
- Format output for easy reading in terminal

## Acceptance Criteria

### AC1: Automatic Execution
✅ Running `/conductor:review` automatically triggers the architecture reviewer  
✅ Architecture review runs without requiring additional commands or flags  
✅ Existing review functionality continues to work as before  

### AC2: Product Alignment Review
✅ Product Alignment Reviewer is implemented as a specialized subagent  
✅ Reviewer analyzes implementation against `product.md`  
✅ Reviewer identifies misalignments with product vision, scope, and target users  
✅ Reviewer provides specific recommendations for alignment  

### AC3: Context Analysis
✅ Architecture reviewer reads and analyzes all required context files  
✅ Reviewer has access to track specification and plan  
✅ Reviewer evaluates implementation code against defined standards  

### AC4: Unified Reporting
✅ All reviewer results are aggregated into a single report  
✅ Report follows existing `/conductor:review` format  
✅ Issues are categorized by severity (critical, warning, info)  
✅ Report includes file references and specific recommendations  

### AC5: Issue Blocking
✅ Critical issues prevent review completion  
✅ User is notified of blocking issues with clear descriptions  
✅ Warnings and info items do not block completion  
✅ User can address issues and re-run review  

### AC6: Subagent Architecture
✅ Product Alignment Reviewer runs as a separate subagent  
✅ Subagent architecture supports easy addition of future reviewers  
✅ Multiple subagents can run in parallel  
✅ Results from all subagents are properly aggregated  

## Out of Scope

### Phase 1 Exclusions

- Design Patterns Reviewer (planned for future phases)
- Component Boundaries Reviewer (planned for future phases)
- Tech Stack Compliance Reviewer (planned for future phases)
- Custom reviewer plugin system
- Configuration UI for selecting reviewers
- Automated issue resolution
- Integration with external static analysis tools
- Historical trend analysis of architectural quality

### Permanent Exclusions

- Replacing the existing `/conductor:review` reviewer entirely (this is supplemental)
- Modifying review behavior for non-Conductor workflows
- Reviews at granularities other than track-level (e.g., file-level, function-level)

## Dependencies

- Existing `/conductor:review` command implementation
- OpenCode subagent/task execution capabilities
- Access to Conductor context files (product.md, tech-stack.md, workflow.md)
- File system access to track directories and implementation code

## Success Metrics

- Product Alignment Reviewer successfully identifies misaligned implementations
- Architecture review completes in < 2 minutes for typical tracks
- Critical issues prevent review completion 100% of the time
- Zero regressions in existing `/conductor:review` functionality
- Architecture reviewer can be extended with new specialized reviewers without modifying core logic
