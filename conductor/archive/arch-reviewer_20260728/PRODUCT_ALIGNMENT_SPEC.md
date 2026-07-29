# Product Alignment Reviewer Specification

## Overview

The Product Alignment Reviewer is a specialized reviewer that validates track implementations against the product definition documented in `conductor/product.md`. It ensures that all code changes align with the product vision, target users, scope, and explicitly avoid non-goal features.

## Purpose

Prevent scope creep, feature bloat, and misaligned implementations by automatically reviewing code changes against the product definition. This reviewer acts as a guardian of product focus and ensures every change serves the defined product vision.

## Review Criteria

### 1. Product Vision Alignment

**Objective**: Verify that the implementation supports and advances the product vision.

**Analysis Process**:
1. Extract the "Product Vision" section from `product.md`
2. Analyze the track's specification (`spec.md`) for alignment with vision
3. Review code changes to ensure they implement the vision, not diverge from it

**Severity Mapping**:
- **Critical**: Implementation contradicts or undermines the product vision
- **High**: Implementation doesn't clearly support the product vision
- **Medium**: Implementation is tangentially related but unclear value
- **Low**: Implementation could better emphasize vision alignment
- **Info**: Positive observation about vision alignment

**Example Critical Finding**:
```
Title: "Implementation Contradicts Product Vision"
Context: "The product vision states 'minimal wrapper around opencode-conductor-plugin', 
but this implementation adds custom workflow orchestration that duplicates conductor functionality."
Suggestion: "Remove custom orchestration and rely on conductor plugin capabilities."
```

### 2. Target User Validation

**Objective**: Ensure the implementation serves the defined target users.

**Analysis Process**:
1. Extract the "Target Users" section from `product.md`
2. Identify who would use the implemented feature
3. Validate that the implementation meets target user needs and characteristics

**Severity Mapping**:
- **Critical**: Implementation serves users outside the target audience exclusively
- **High**: Implementation primarily benefits non-target users
- **Medium**: Implementation has mixed value for target/non-target users
- **Low**: Implementation could be better tailored to target users
- **Info**: Implementation excellently serves target users

**Example High Finding**:
```
Title: "Feature Targets Non-Target Users"
Context: "Target users are 'individual developers', but this team collaboration 
feature requires multi-user coordination and shared state management."
Suggestion: "Refocus feature on single-developer workflows, or document expansion of target users."
```

### 3. Core Problems Validation

**Objective**: Confirm that the implementation addresses the core problems the product is meant to solve.

**Analysis Process**:
1. Extract the "Core Problems Solved" section from `product.md`
2. Map the implementation to specific core problems
3. Verify that the implementation effectively addresses these problems

**Severity Mapping**:
- **Critical**: Implementation introduces new problems or worsens existing core problems
- **High**: Implementation doesn't address any core problems
- **Medium**: Implementation addresses core problems ineffectively
- **Low**: Implementation could better address core problems
- **Info**: Implementation effectively solves a core problem

**Example Critical Finding**:
```
Title: "Implementation Worsens Core Problem"
Context: "Core problem: 'Context Switching Overhead'. This implementation requires 
manual context file updates, increasing cognitive load during switches."
Suggestion: "Automate context file updates to reduce switching overhead."
```

### 4. Product Scope Validation

**Objective**: Ensure the implementation falls within the defined product scope.

**Analysis Process**:
1. Extract the "Product Scope" section from `product.md`
2. Compare the implementation against explicitly included scope items
3. Identify any out-of-scope features or functionality

**Severity Mapping**:
- **Critical**: Implementation is entirely out of scope
- **High**: Significant portions of implementation are out of scope
- **Medium**: Implementation extends scope without clear justification
- **Low**: Minor scope extension that could be reconsidered
- **Info**: Implementation is perfectly within scope

**Example Critical Finding**:
```
Title: "Out of Scope: Custom Git Hosting"
Context: "Product scope explicitly states 'No custom Git hosting or repository management',
but this implementation adds a custom Git remote hosting service."
Suggestion: "Remove custom hosting service. Use standard Git remotes."
```

### 5. Non-Goals Validation

**Objective**: Ensure the implementation does NOT implement features listed as non-goals.

**Analysis Process**:
1. Extract the "Non-Goals" section from `product.md`
2. Scan implementation for any non-goal features
3. Flag any violations with critical severity

**Severity Mapping**:
- **Critical**: Implementation includes features explicitly listed as non-goals
- **Info**: Implementation correctly avoids non-goals

**Example Critical Finding**:
```
Title: "Non-Goal Implementation: Team Collaboration"
Context: "Non-goals explicitly state 'Team collaboration features (designed for individual developers)',
but this implementation adds PR approval workflows and team review assignments."
Suggestion: "Remove team collaboration features. Keep focus on individual developer workflows."
```

### 6. Key Features Alignment (Optional Check)

**Objective**: Verify that the implementation aligns with or extends the key features.

**Analysis Process**:
1. Extract the "Key Features" section from `product.md`
2. Determine if the implementation relates to existing key features
3. Flag if implementation adds features not listed (potential scope expansion)

**Severity Mapping**:
- **High**: Implementation adds major features not in key features list
- **Medium**: Implementation extends key features beyond documented capabilities
- **Low**: Implementation adds minor features not explicitly listed
- **Info**: Implementation perfectly aligns with key features

**Example High Finding**:
```
Title: "Undocumented Major Feature"
Context: "Key features don't mention 'AI-powered code generation', but this implementation 
adds a full AI code generator that significantly changes the product offering."
Suggestion: "Either remove AI generation, or update product.md to document this major feature."
```

## Analysis Workflow

```
┌─────────────────────────────────────────────────┐
│  1. Load Product Definition (product.md)       │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  2. Parse Sections:                             │
│     - Product Vision                            │
│     - Target Users                              │
│     - Core Problems Solved                      │
│     - Product Scope                             │
│     - Non-Goals                                 │
│     - Key Features                              │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  3. Load Track Context:                         │
│     - spec.md (track specification)             │
│     - plan.md (implementation plan)             │
│     - Code changes (git diff)                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  4. Execute Alignment Checks (Parallel):        │
│     ├─ Vision Alignment                         │
│     ├─ Target User Validation                   │
│     ├─ Core Problems Validation                 │
│     ├─ Scope Validation                         │
│     ├─ Non-Goals Validation (CRITICAL)          │
│     └─ Key Features Alignment                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  5. Aggregate Findings:                         │
│     - Group by severity                         │
│     - Sort by impact                            │
│     - Generate suggestions                      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  6. Return ReviewFindings                       │
└─────────────────────────────────────────────────┘
```

## Implementation Approach

### Direct Analysis Method

For the initial implementation, we'll use **direct analysis** rather than spawning subagents:

1. **Load Context**: Use ContextLoader to load `product.md`
2. **Extract Sections**: Parse each relevant section using markdown parsing
3. **Analyze Code**: Review track spec, plan, and code changes
4. **Apply Criteria**: Run each validation check
5. **Generate Findings**: Create Finding objects for issues
6. **Return Results**: Aggregate into ReviewFindings

**Rationale**:
- Simpler to implement and test
- Faster execution (no subagent overhead)
- Deterministic results
- Can migrate to AI-powered analysis later if needed

### AI-Powered Analysis Method (Future)

In future iterations, we could use AI/LLM to perform nuanced analysis:

1. **Prompt Construction**: Build prompts with product.md sections
2. **Code Context**: Include track spec and code changes
3. **LLM Analysis**: Ask LLM to identify misalignments
4. **Parse Response**: Extract findings from LLM output
5. **Validate**: Verify findings against criteria

**Advantages**:
- Nuanced semantic understanding
- Can detect subtle misalignments
- Natural language explanations

**Disadvantages**:
- Non-deterministic
- Slower execution
- Requires LLM integration

## Output Format

### ReviewFindings Structure

```typescript
{
  reviewer: "Product Alignment",
  findings: [
    {
      severity: "critical",
      category: "Product Alignment",
      title: "Non-Goal Implementation: Team Collaboration",
      description: "The implementation adds team collaboration features...",
      file: "src/collaboration/TeamSync.ts",
      lines: { start: 45, end: 120 },
      suggestion: "Remove team collaboration features..."
    },
    // More findings...
  ]
}
```

### Report Presentation

When integrated into the review report:

```markdown
## Architecture Review

### Product Alignment

#### Critical: Non-Goal Implementation: Team Collaboration

**Category**: Product Alignment
**File**: `src/collaboration/TeamSync.ts` (Lines 45-120)
**Context**: The implementation adds team collaboration features (PR approval workflows, 
team assignments), but the product's non-goals explicitly state "Team collaboration features 
(designed for individual developers)".
**Suggestion**: Remove team collaboration features. Keep focus on individual developer workflows.
```

## Edge Cases and Error Handling

### Missing Product Definition Sections

**Scenario**: `product.md` is missing a required section (e.g., "Non-Goals")

**Handling**:
- Log warning: "Product definition missing 'Non-Goals' section. Skipping non-goals validation."
- Continue with other checks
- Include informational finding in report about missing section

### Empty Sections

**Scenario**: A section exists but has no content

**Handling**:
- Skip validation for that criterion
- Log informational message
- Don't flag as an error

### Ambiguous Implementation

**Scenario**: Implementation could be interpreted multiple ways

**Handling**:
- Apply principle of charity: assume best interpretation
- Flag with "Medium" severity if clarification would help
- Suggest documentation improvements

### Track Without Specification

**Scenario**: Reviewing "current" changes without a track context

**Handling**:
- Perform general alignment check against product.md
- Cannot validate against spec.md (doesn't exist)
- Focus on code-level alignment checks

## Testing Strategy

### Unit Tests

```typescript
describe('ProductAlignmentReviewer', () => {
  describe('Vision Alignment', () => {
    it('flags critical issues for contradictory implementations', async () => {
      // Test with implementation that contradicts vision
    });
    
    it('returns no findings for aligned implementations', async () => {
      // Test with well-aligned implementation
    });
  });
  
  describe('Non-Goals Validation', () => {
    it('flags critical issues for non-goal implementations', async () => {
      // Test with implementation of non-goal feature
    });
    
    it('handles missing non-goals section gracefully', async () => {
      // Test with product.md missing non-goals
    });
  });
  
  // More test cases...
});
```

### Integration Tests

```typescript
describe('ProductAlignmentReviewer Integration', () => {
  it('performs full review with real product.md', async () => {
    // Load actual project's product.md
    // Review a real track
    // Verify findings are accurate
  });
  
  it('handles missing context files gracefully', async () => {
    // Test with missing product.md
    // Verify graceful degradation
  });
});
```

### Manual Test Cases

1. **Test Case: Non-Goal Violation**
   - Create a test track that implements a non-goal feature
   - Run product alignment review
   - Verify critical finding is generated

2. **Test Case: Scope Creep**
   - Create a test track that extends scope without justification
   - Run product alignment review
   - Verify high/medium finding is generated

3. **Test Case: Perfect Alignment**
   - Create a test track that perfectly aligns with product.md
   - Run product alignment review
   - Verify no issues found or only informational findings

## Configuration Options

### Enable/Disable Checks

```json
{
  "architectureReview": {
    "productAlignment": {
      "enabled": true,
      "checks": {
        "visionAlignment": true,
        "targetUsers": true,
        "coreProblems": true,
        "scope": true,
        "nonGoals": true,
        "keyFeatures": false  // Optional check, disabled by default
      }
    }
  }
}
```

### Severity Thresholds

```json
{
  "architectureReview": {
    "productAlignment": {
      "severityThresholds": {
        "nonGoalViolation": "critical",
        "scopeViolation": "high",
        "visionMisalignment": "medium"
      }
    }
  }
}
```

## Performance Targets

- **Execution Time**: < 5 seconds for typical track
- **Memory Usage**: < 50MB for context loading and analysis
- **Findings Generation**: < 1 second per check

## Success Metrics

- **Accuracy**: 90%+ of flagged issues are genuine misalignments
- **Coverage**: 100% of non-goal violations are detected
- **Performance**: Reviews complete in < 2 minutes (as part of full architecture review)
- **False Positives**: < 10% of findings are incorrect

## Future Enhancements

1. **AI-Powered Semantic Analysis**:
   - Use LLM to detect subtle misalignments
   - Provide more nuanced explanations
   - Suggest alternative approaches

2. **Historical Trend Analysis**:
   - Track product alignment over time
   - Identify patterns of scope creep
   - Generate alignment metrics

3. **Automated Remediation**:
   - Suggest code changes to improve alignment
   - Generate updated product.md sections if needed
   - Auto-fix minor alignment issues

4. **Custom Criteria**:
   - Allow projects to define custom alignment criteria
   - Support domain-specific validation rules
   - Extensible validation framework

## Conclusion

The Product Alignment Reviewer provides automated validation of track implementations against the product definition. By systematically checking vision, users, problems, scope, and non-goals, it acts as a guardian against scope creep and misaligned implementations. The direct analysis approach ensures fast, deterministic reviews with clear, actionable findings.
