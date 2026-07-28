# Architecture Reviewer Design Document

## Executive Summary

This document outlines the design for integrating a specialized Architecture Reviewer into the OpenCode Harness `/conductor:review` command. The architecture reviewer will supplement the existing review functionality by providing comprehensive architectural analysis through multiple specialized subagents.

## Current State Analysis

### Existing `/conductor:review` Implementation

The conductor plugin implements review functionality through:
- **Directive-Based Approach**: Uses `review.json` containing a comprehensive system prompt
- **Tool Registration**: Exported via `createReviewTool()` function
- **Workflow**: AI-driven review following the directive's protocol
- **Report Format**: Structured markdown with findings categorized by severity

### Existing Architecture Review Framework

The harness already includes a partial architecture review framework:
- `src/architecture-review/ArchitectureReviewer.ts` - Orchestrator for specialized reviewers
- `src/architecture-review/ContextLoader.ts` - Loads Conductor context files
- `src/architecture-review/ReportGenerator.ts` - Generates unified reports
- `src/architecture-review/types.ts` - Complete type definitions

**Status**: Framework exists but is not integrated with the review command.

## Integration Strategy

### Chosen Approach: Plugin Extension

We will extend the OpenCode Harness plugin to:
1. Register a custom review tool that wraps the conductor's review command
2. Execute the architecture reviewer automatically when `/conductor:review` is invoked
3. Aggregate results from both the conductor review and architecture review
4. Present a unified report to the user

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  /conductor:review Command                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              HarnessPlugin.createReviewTool()                │
│                  (Custom Wrapper)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌────────────────────────────┐  ┌──────────────────────────┐
│  Conductor Review          │  │  Architecture Reviewer   │
│  (Original Directive)      │  │  (New Framework)         │
└────────────────────────────┘  └──────────────────────────┘
                │                           │
                │                           ▼
                │             ┌──────────────────────────┐
                │             │  Specialized Reviewers   │
                │             │  - Product Alignment     │
                │             │  - (Future: Design, etc) │
                │             └──────────────────────────┘
                │                           │
                └───────────┬───────────────┘
                            ▼
                ┌────────────────────────┐
                │   Unified Report       │
                │   (Aggregated Results) │
                └────────────────────────┘
```

## Component Design

### 1. Extended Review Tool

**File**: `src/review/ExtendedReviewTool.ts`

**Purpose**: Wraps the conductor's review tool and adds architecture review execution.

**Interface**:
```typescript
export class ExtendedReviewTool {
  constructor(
    conductorReviewTool: ToolDefinition,
    architectureReviewer: ArchitectureReviewer
  );
  
  createTool(ctx: PluginInput): ToolDefinition;
}
```

**Workflow**:
1. Receive review request (track name or "current")
2. Parse scope from arguments
3. Load project context via ContextLoader
4. Execute architecture reviewer
5. Invoke original conductor review directive
6. Aggregate results
7. Return unified report

### 2. Product Alignment Reviewer

**File**: `src/reviewers/ProductAlignmentReviewer.ts`

**Purpose**: Specialized reviewer that validates implementation against `product.md`.

**Interface**:
```typescript
export class ProductAlignmentReviewer implements SpecializedReviewer {
  name: string = "Product Alignment";
  description: string = "Validates implementation against product vision, scope, and user needs";
  
  review(context: ReviewContext): Promise<ReviewFindings>;
}
```

**Review Criteria**:
- **Product Vision Alignment**: Does the implementation support the product vision?
- **Target Users**: Does it serve the defined target users?
- **Core Problems**: Does it solve the core problems outlined?
- **Product Scope**: Is it within the defined scope?
- **Non-Goals**: Does it avoid non-goal features?

### 3. Review Orchestration

**File**: `src/review/ReviewOrchestrator.ts`

**Purpose**: Coordinates execution of both conductor review and architecture review.

**Responsibilities**:
- Parse review scope (track name or "current")
- Load context files
- Execute specialized reviewers in parallel
- Wait for conductor review to complete
- Aggregate all results
- Generate unified report

## Data Flow

### Input
```typescript
interface ReviewInput {
  scope: 'track' | 'current';
  trackId?: string;
  files?: string[];
}
```

### Context Loading
```typescript
interface ReviewContext {
  scope: ReviewScope;
  projectContext: ProjectContext;  // product.md, tech-stack.md, workflow.md
  changes: CodeChanges;             // git diff output
}
```

### Review Execution
```
1. ContextLoader.load()
   ↓
2. Extract code changes (git diff)
   ↓
3. Parallel Execution:
   ├─ ArchitectureReviewer.executeReview()
   │  ├─ ProductAlignmentReviewer.review()
   │  └─ (Future reviewers...)
   │
   └─ Conductor Review (original directive)
   ↓
4. Aggregate Results
   ↓
5. ReportGenerator.generate()
```

### Output
```typescript
interface UnifiedReviewReport {
  conductorFindings: string;        // Original review report
  architectureResult: ReviewResult; // Architecture review findings
  hasBlockingIssues: boolean;       // true if critical issues found
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}
```

## Severity Categorization

| Severity | Description | Blocking? |
|----------|-------------|-----------|
| `critical` | Violates product scope/non-goals, introduces security risks | Yes |
| `high` | Misaligns with product vision or target users | No |
| `medium` | Partially misaligned with product guidelines | No |
| `low` | Minor suggestions for improvement | No |
| `info` | Informational observations | No |

## Report Format

The unified report will follow this structure:

```markdown
# Review Report: [Track Name]

## Summary
[Overall assessment from both reviews]

## Conductor Review
[Original conductor review findings]

---

## Architecture Review

### Summary
Found X issues: Y critical, Z high, etc.

**Recommendation**: [Action based on findings]

### Findings

#### Critical: [Issue Title]
**Category**: Product Alignment
**File**: `path/to/file` (Lines L10-L20)
**Context**: [Description of issue]
**Suggestion**: [How to fix]

[Additional findings...]
```

## Implementation Phases

### Phase 1: Core Framework (Current)
- [x] Type definitions
- [x] ArchitectureReviewer orchestrator
- [x] ContextLoader
- [x] ReportGenerator
- [ ] Product Alignment Reviewer
- [ ] Review Orchestrator
- [ ] Extended Review Tool
- [ ] Plugin Integration

### Phase 2: Specialized Reviewers (Future)
- [ ] Design Patterns Reviewer
- [ ] Component Boundaries Reviewer
- [ ] Tech Stack Compliance Reviewer

## Configuration

### Plugin Configuration

**File**: `.opencode/opencode.json`

```json
{
  "plugins": [
    {
      "name": "@lannuttia/opencode-harness",
      "config": {
        "enableArchitectureReview": true,
        "reviewers": {
          "productAlignment": {
            "enabled": true,
            "severity": "critical"
          }
        }
      }
    }
  ]
}
```

## Error Handling

### Missing Context Files
- **Issue**: Required context files (product.md, tech-stack.md) are missing
- **Action**: Gracefully degrade - skip architecture review and log warning
- **User Message**: "Architecture review skipped: Missing context files. Run `/conductor:setup` to initialize."

### Reviewer Execution Failure
- **Issue**: A specialized reviewer throws an error
- **Action**: Log error, continue with other reviewers
- **User Message**: Include error summary in report

### Git Command Failures
- **Issue**: Unable to execute git commands for diff extraction
- **Action**: Fall back to conductor review only
- **User Message**: "Unable to analyze code changes. Review limited to manual inspection."

## Testing Strategy

### Unit Tests
- Test each specialized reviewer independently
- Test ContextLoader with various file structures
- Test ReportGenerator with different finding sets
- Test ArchitectureReviewer orchestration

### Integration Tests
- Test full review workflow end-to-end
- Test with real conductor context files
- Test with various track types (features, bugs, chores)
- Test error handling paths

### Manual Testing
- Test with intentional product misalignments
- Test with missing context files
- Test with large diffs (>300 lines)
- Verify report formatting

## Performance Considerations

### Parallel Execution
- Execute all specialized reviewers in parallel using `Promise.all()`
- Execute conductor review and architecture review in parallel
- Target: < 2 minutes for typical tracks

### Caching
- ContextLoader caches loaded context files
- Avoid re-reading files for multiple reviewers
- Cache clearable via `ContextLoader.clearCache()`

### Resource Limits
- Limit parallel subagent execution to avoid overwhelming OpenCode
- Implement timeout for individual reviewers (60 seconds)
- Fall back gracefully if timeouts occur

## Backward Compatibility

### Conductor Review
- Original conductor review functionality remains unchanged
- Architecture review is additive - does not modify existing behavior
- Users can disable architecture review via configuration

### OpenCode Plugin API
- Uses standard OpenCode plugin SDK (`@opencode-ai/plugin`)
- No breaking changes to plugin interface
- Maintains compatibility with OpenCode updates

## Future Enhancements

### Phase 2 Features
1. **Additional Reviewers**:
   - Design Patterns Reviewer (SOLID, DDD)
   - Component Boundaries Reviewer (coupling, cohesion)
   - Tech Stack Compliance Reviewer

2. **Configuration Options**:
   - Enable/disable specific reviewers
   - Adjust severity levels
   - Custom review criteria

3. **Advanced Features**:
   - Historical trend analysis
   - Integration with static analysis tools
   - Custom reviewer plugins
   - Review templates

## Open Questions

1. **Subagent Execution**: How should we invoke specialized reviewers?
   - Option A: Use OpenCode's task/subagent system
   - Option B: Direct function calls within the review tool
   - **Decision**: Start with direct function calls (simpler), migrate to subagents if needed

2. **Report Presentation**: How should we present the unified report?
   - Option A: Markdown in the chat
   - Option B: Separate file in conductor/
   - Option C: Both
   - **Decision**: Markdown in chat for immediate feedback, optionally save to file

3. **Configuration Location**: Where should architecture review config live?
   - Option A: `.opencode/opencode.json`
   - Option B: `conductor/review-config.json`
   - **Decision**: `.opencode/opencode.json` (plugin configuration)

## Conclusion

This design provides a comprehensive framework for integrating specialized architecture review into the OpenCode Harness. The modular architecture supports:
- Easy addition of new specialized reviewers
- Parallel execution for performance
- Graceful error handling
- Backward compatibility with existing functionality
- Clear, actionable reporting

The implementation will be phased, starting with the Product Alignment Reviewer and expanding to additional reviewers in future phases.
