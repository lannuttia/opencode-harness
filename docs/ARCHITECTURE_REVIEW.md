# Architecture Review System

## Overview

The Architecture Review System is an automated code review framework integrated into the OpenCode Harness. It provides specialized architectural analysis to supplement the standard `/conductor:review` command, ensuring that all code changes align with the product vision, target users, and defined scope.

## Features

- **Automatic Integration**: Runs automatically when `/conductor:review` is executed
- **Product Alignment Validation**: Ensures implementations match product.md specifications
- **Critical Issue Blocking**: Prevents review completion when critical misalignments are found
- **Extensible Framework**: Easy to add new specialized reviewers
- **Performance Optimized**: Completes reviews in < 2 seconds for typical tracks

## How It Works

### Automatic Execution

When you run `/conductor:review`, the architecture reviewer automatically executes after the conductor review completes. The process is:

1. **Conductor Review**: Standard review runs first
2. **Architecture Review**: Architecture reviewer loads project context and analyzes changes
3. **Report Generation**: Results are aggregated and appended to the conductor review output
4. **Blocking Check**: If critical issues are found, they are flagged in the review title

### Review Process

```
/conductor:review
       ↓
Conductor Review (existing)
       ↓
Architecture Review (automatic)
   ├─ Load project context (product.md, tech-stack.md, etc.)
   ├─ Execute specialized reviewers (Product Alignment, etc.)
   ├─ Aggregate findings by severity
   └─ Generate unified report
       ↓
Combined Review Output
```

## Specialized Reviewers

### Product Alignment Reviewer

Validates that implementations align with the product definition in `conductor/product.md`.

**Checks:**

1. **Vision Alignment**: Does the implementation support the product vision?
2. **Target Users**: Does it serve the defined target users?
3. **Core Problems**: Does it address the core problems outlined?
4. **Product Scope**: Is it within the defined scope?
5. **Non-Goals**: Does it avoid non-goal features? (CRITICAL)

**Severity Levels:**

| Severity | Description | Blocking? |
|----------|-------------|-----------|
| `critical` | Violates product scope/non-goals, introduces security risks | Yes |
| `high` | Misaligns with product vision or target users | No |
| `medium` | Partially misaligned with product guidelines | No |
| `low` | Minor suggestions for improvement | No |
| `info` | Informational observations | No |

### Example Findings

#### Critical: Non-Goal Implementation

```markdown
### Critical: Non-Goal Implementation: Team Collaboration

**Category**: Product Alignment
**File**: `src/collaboration/TeamSync.ts` (Lines 45-120)

**Context**: Non-goals explicitly state "Team collaboration features (designed for 
individual developers)", but this implementation adds PR approval workflows and team 
review assignments.

**Suggestion**: Remove team collaboration features. Keep focus on individual developer 
workflows.
```

#### High: Feature Targets Non-Target Users

```markdown
### High: Feature Targets Non-Target Users

**Category**: Product Alignment
**File**: `src/team-features.ts`

**Context**: Target users are "Individual developers who work on multiple features 
simultaneously", but this implementation adds team collaboration features that require 
multi-user coordination.

**Suggestion**: Refocus feature on single-developer workflows, or update product.md 
to expand target users.
```

## Report Format

The architecture review report is appended to the conductor review output with a separator:

```markdown
# Review Report: [Track Name]

## Summary
[Conductor review summary]

## Verification Checks
- [ ] **Plan Compliance**: ...
- [ ] **Style Compliance**: ...
...

---

## Architecture Review

### Summary
Found 2 issues: 1 critical, 1 high.

**Recommendation**: Critical issues must be addressed before proceeding.

### Findings

#### Critical: Non-Goal Implementation: Team Collaboration
...

#### High: Feature Targets Non-Target Users
...
```

## Configuration

Currently, the architecture review system has minimal configuration. All reviewers are enabled by default.

### Future Configuration Options

The system is designed to support configuration via `.opencode/opencode.json`:

```json
{
  "plugins": [
    {
      "name": "@lannuttia/opencode-harness",
      "config": {
        "architectureReview": {
          "enabled": true,
          "reviewers": {
            "productAlignment": {
              "enabled": true,
              "checks": {
                "visionAlignment": true,
                "targetUsers": true,
                "coreProblems": true,
                "scope": true,
                "nonGoals": true
              }
            }
          }
        }
      }
    }
  ]
}
```

## Extending the System

### Adding a New Specialized Reviewer

To add a new specialized reviewer:

1. **Create Reviewer Class**:

```typescript
import type { SpecializedReviewer, ReviewContext, ReviewFindings } from '@lannuttia/opencode-harness';

export class MyCustomReviewer implements SpecializedReviewer {
  name = 'My Custom Reviewer';
  description = 'Checks for custom criteria';

  async review(context: ReviewContext): Promise<ReviewFindings> {
    const findings = [];

    // Analyze context and add findings
    // ...

    return {
      reviewer: this.name,
      findings,
    };
  }
}
```

2. **Register Reviewer** (in src/plugin.ts):

```typescript
import { MyCustomReviewer } from './reviewers/MyCustomReviewer';

// In HarnessPlugin function:
architectureReviewer.registerReviewer(new MyCustomReviewer());
```

3. **Add Tests**:

Create tests in `tests/reviewers/MyCustomReviewer.test.ts`.

## Architecture

### Component Overview

```
src/
├── architecture-review/
│   ├── ArchitectureReviewer.ts    # Orchestrates specialized reviewers
│   ├── ContextLoader.ts           # Loads conductor context files
│   ├── ReportGenerator.ts         # Generates unified reports
│   ├── types.ts                   # Type definitions
│   └── index.ts                   # Exports
├── reviewers/
│   ├── ProductAlignmentReviewer.ts  # Product alignment validation
│   └── index.ts                     # Exports
└── plugin.ts                       # Plugin integration
```

### Key Classes

#### ArchitectureReviewer

Orchestrates the execution of multiple specialized reviewers in parallel.

**Methods:**
- `registerReviewer(reviewer)`: Register a specialized reviewer
- `executeReview(context)`: Execute all reviewers and aggregate results
- `getReviewers()`: Get all registered reviewers
- `clearReviewers()`: Clear all registered reviewers

#### ContextLoader

Loads and caches Conductor context files from the `conductor/` directory.

**Methods:**
- `load()`: Load all context files (cached)
- `getCached()`: Get cached context without loading
- `clearCache()`: Clear the cache

#### ReportGenerator

Generates formatted review reports from findings.

**Methods:**
- `generate(result, title)`: Generate a complete review report

## Performance

- **Execution Time**: < 2 seconds for typical tracks
- **Memory Usage**: < 50MB for context loading and analysis
- **Parallel Execution**: All reviewers execute in parallel via `Promise.all()`
- **Caching**: Context files are cached to avoid redundant reads

## Error Handling

### Graceful Degradation

If the architecture review fails, the conductor review results are still displayed:

```
## Architecture Review

⚠️ Architecture review encountered an error: [error message]

The conductor review results above are still valid.
```

### Missing Context Files

If required context files are missing, the architecture review is skipped and a warning is logged.

### Reviewer Failures

If an individual reviewer fails, it logs an error and continues with other reviewers. The failed reviewer returns empty findings.

## Testing

### Unit Tests

- **ArchitectureReviewer**: 9 tests
- **ContextLoader**: Multiple tests for file loading and caching
- **ReportGenerator**: Multiple tests for report formatting
- **ProductAlignmentReviewer**: 13 tests

### Integration Tests

- **Full Review Workflow**: 8 tests
- **Error Handling**: Multiple scenarios
- **Performance**: Execution time verification

### Running Tests

```bash
# All tests
bun test

# Architecture review tests only
bun test tests/architecture-review/

# Integration tests
bun test tests/integration/

# Specific reviewer tests
bun test tests/reviewers/ProductAlignmentReviewer.test.ts
```

## Troubleshooting

### Architecture Review Not Running

**Problem**: Architecture review doesn't appear in `/conductor:review` output.

**Solution**: Ensure the plugin is properly installed and the SDK version matches:

```bash
# Check package.json
grep "@opencode-ai/plugin" package.json

# Should show: "@opencode-ai/plugin": "1.0.223"
```

### Type Errors

**Problem**: TypeScript type errors related to plugin SDK.

**Solution**: Ensure SDK versions match between harness and conductor plugin:

```bash
# Reinstall dependencies
bun install
```

### Missing Context Files

**Problem**: Architecture review fails with "Failed to read product.md".

**Solution**: Run `/conductor:setup` to initialize the conductor context files.

## Future Enhancements

### Planned Reviewers

1. **Design Patterns Reviewer**: Validates adherence to SOLID, DDD, and other patterns
2. **Component Boundaries Reviewer**: Checks separation of concerns, coupling/cohesion
3. **Tech Stack Compliance Reviewer**: Verifies implementation follows tech-stack.md

### Advanced Features

- **AI-Powered Analysis**: Use LLM for nuanced semantic analysis
- **Historical Trend Analysis**: Track product alignment over time
- **Automated Remediation**: Suggest code changes to improve alignment
- **Custom Criteria**: Allow projects to define custom alignment criteria

## Related Documentation

- [Conductor Methodology](../conductor/index.md)
- [Product Definition](../conductor/product.md)
- [Tech Stack](../conductor/tech-stack.md)
- [Workflow](../conductor/workflow.md)

## Support

For issues or questions:
- GitHub Issues: https://github.com/lannuttia/opencode-harness/issues
- Documentation: https://github.com/lannuttia/opencode-harness#readme
