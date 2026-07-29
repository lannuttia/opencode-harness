# Product Alignment Reviewer Specification

## Overview

The Product Alignment Reviewer is a specialized AI-powered reviewer that validates implementation against the product vision, scope, and user needs defined in `conductor/product.md`.

## Purpose

Ensure that code changes align with:
- Product vision and goals
- Target user needs
- Defined scope (in-scope features)
- Non-goals (out-of-scope features to avoid)
- Core problems the product is solving

## Input

### Product Context (from product.md)
```typescript
interface ProductDefinition {
  vision: string;           // Product Vision section
  targetUsers: string;      // Target Users section
  coreProblems: string;     // Core Problems Solved section
  keyFeatures: string;      // Key Features section
  scope: string;            // Product Scope section
  nonGoals: string;         // Non-Goals section
}
```

### Review Scope
- Track specification (spec.md)
- Implementation plan (plan.md)
- Code changes (git diff or file list)
- Commit messages

## Review Criteria

### 1. Product Vision Alignment
**Critical Question**: Does this implementation support the product's vision?

**Checks**:
- ✅ New features align with stated product vision
- ✅ Code changes move toward vision goals
- ❌ Implementation contradicts vision
- ❌ Features drift away from core product purpose

**Examples**:
- ✅ **Aligned**: Adding Git worktree isolation to support context-driven development (matches vision)
- ❌ **Misaligned**: Adding team collaboration features when product is for individual developers

**Severity Mapping**:
- Vision contradiction → **Critical**
- Vision drift → **High**
- Vision unclear → **Medium**

### 2. Scope Validation
**Critical Question**: Is this feature within the defined product scope?

**Checks**:
- ✅ Feature is explicitly mentioned in "Product Scope" or "Key Features"
- ✅ Feature is implied by scope but not explicitly listed
- ❌ Feature is explicitly listed in "Non-Goals"
- ❌ Feature is out of scope but not listed in non-goals

**Examples**:
- ✅ **In Scope**: Implementing track-based development (key feature)
- ❌ **Out of Scope**: Adding CI/CD pipeline management (non-goal)
- ⚠️ **Unclear**: Adding GitHub integration (not mentioned either way)

**Severity Mapping**:
- Violates Non-Goals → **Critical**
- Out of scope but not in non-goals → **High**
- Scope extension without justification → **Medium**

### 3. Target User Needs Validation
**Critical Question**: Does this serve the target users?

**Checks**:
- ✅ Feature addresses a user characteristic or need
- ✅ Implementation matches user's technical level
- ❌ Feature serves different user persona
- ❌ Implementation too complex/simple for target users

**Examples**:
- ✅ **Matches Users**: CLI-first interface (users are command-line comfortable)
- ❌ **Wrong Users**: Adding GUI wizard (target users prefer CLI)

**Severity Mapping**:
- Serves wrong user persona → **High**
- Complexity mismatch → **Medium**
- Minor UX deviation → **Low**

### 4. Core Problems Validation
**Critical Question**: Does this help solve the core problems?

**Checks**:
- ✅ Feature directly addresses a core problem
- ✅ Feature indirectly supports solving core problems
- ⚠️ Feature neutral (doesn't help or hurt)
- ❌ Feature distracts from core problems

**Examples**:
- ✅ **Addresses Problem**: Context switching overhead (core problem)
- ⚠️ **Neutral**: Adding color themes (doesn't address core problems)
- ❌ **Distracts**: Adding social sharing features (not related to core problems)

**Severity Mapping**:
- Distracts from core problems → **High**
- Neutral but takes resources → **Medium**
- Minor distraction → **Low**

### 5. Implementation Consistency
**Critical Question**: Is the implementation consistent with product characteristics?

**Checks**:
- ✅ Follows product design principles
- ✅ Matches existing feature patterns
- ❌ Introduces conflicting patterns
- ❌ Violates product constraints

**Examples**:
- ✅ **Consistent**: Using Git worktrees for isolation (matches Git-first approach)
- ❌ **Inconsistent**: Requiring cloud service when product is local-first

**Severity Mapping**:
- Violates core constraints → **Critical**
- Conflicts with principles → **High**
- Inconsistent patterns → **Medium**

## Analysis Process

### Step 1: Load Product Context
```
Read conductor/product.md
Parse into structured sections:
- Product Vision
- Target Users
- Core Problems Solved
- Key Features
- Product Scope
- Non-Goals
```

### Step 2: Load Track Context
```
Read track's spec.md
Read track's plan.md
Extract:
- Feature description
- User stories
- Implementation approach
```

### Step 3: Analyze Changes
```
For each code change:
1. Identify what feature/capability it adds
2. Check against Product Vision
3. Validate against Scope/Non-Goals
4. Assess user needs alignment
5. Evaluate problem-solving relevance
6. Check implementation consistency
```

### Step 4: Generate Findings
```
For each misalignment:
1. Determine severity (Critical/High/Medium/Low/Info)
2. Identify specific product.md section violated
3. Explain why it's misaligned
4. Suggest alternative approach or removal
```

## Output Format

### Finding Structure
```typescript
interface ProductAlignmentFinding {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'Product Alignment';
  subcategory: 'Vision' | 'Scope' | 'Users' | 'Problems' | 'Consistency';
  title: string;
  description: string;
  productSection: string;  // Which section of product.md is violated
  suggestion: string;
  file?: string;           // Optional: specific file
  lines?: { start: number; end: number }; // Optional: specific lines
}
```

### Example Findings

#### Critical: Non-Goal Violation
```markdown
### Critical: Violates Non-Goals - Team Collaboration

- **Category**: Product Alignment (Scope)
- **Product Section**: Non-Goals
- **Context**: Implementation adds team collaboration features including shared workspaces and real-time editing.
- **Issue**: The product.md explicitly states: "Team collaboration features (designed for individual developers)". This implementation directly contradicts that non-goal.
- **Suggestion**: Remove team collaboration features. Focus on individual developer workflow enhancements instead.
```

#### High: Vision Drift
```markdown
### High: Deviates from Product Vision - GUI Dashboard

- **Category**: Product Alignment (Vision)
- **Product Section**: Product Vision, Target Users
- **Context**: Implementation adds a web-based GUI dashboard for track visualization.
- **Issue**: Product vision emphasizes "CLI-first interface" and targets "developers comfortable with command-line tools". A GUI dashboard shifts away from this vision.
- **Suggestion**: Consider CLI-based visualizations (ASCII art, terminal UI) or integrate with existing terminal tools rather than building a web GUI.
```

#### Medium: Unclear Scope Extension
```markdown
### Medium: Scope Extension Not Documented - External API Integration

- **Category**: Product Alignment (Scope)
- **Product Section**: Product Scope
- **Context**: Implementation adds integration with external project management APIs (Jira, Linear).
- **Issue**: This feature is not mentioned in Product Scope or Key Features. While not explicitly in Non-Goals, it's a significant scope expansion.
- **Suggestion**: Either document this integration in product.md as an official feature, or remove it to maintain focus on core Conductor methodology.
```

## Edge Cases

### Case 1: Feature Mentioned in Track Spec but Violates Product
- **Severity**: Critical
- **Action**: Block review, require spec alignment with product.md first

### Case 2: Implementation Detail Not in Product Scope
- **Severity**: Low or Info
- **Example**: Choosing a specific algorithm or data structure
- **Rationale**: Implementation details aren't product-level decisions

### Case 3: Bug Fix or Refactoring
- **Severity**: None (skip review)
- **Rationale**: Bug fixes and refactorings don't introduce new features

### Case 4: Experimental Feature
- **Check**: Is experimentation mentioned in product.md?
- **If yes**: Low severity (document experiment in spec)
- **If no**: High severity (experimentation not in scope)

### Case 5: Dependency Changes
- **Check**: Does new dependency support scope or violate constraints?
- **Example**: Adding cloud SDK violates "local-first" constraint → Critical

## Prompt Design for AI Subagent

### Context Provided
```
You are a Product Alignment Reviewer for the Conductor project.

Your task is to analyze code changes and validate they align with the product vision, scope, and user needs.

## Product Context
{product.md content}

## Track Context
Specification: {spec.md content}
Plan: {plan.md content}

## Code Changes
{git diff or file changes}

## Your Task
Analyze the changes and identify any misalignments with the product definition.

For each misalignment found, provide:
1. Severity (critical/high/medium/low/info)
2. Subcategory (Vision/Scope/Users/Problems/Consistency)
3. Title (brief description)
4. Description (detailed explanation of misalignment)
5. Product Section (which part of product.md is violated)
6. Suggestion (recommended fix or alternative)

Focus on:
- Features that violate Non-Goals → Critical
- Features outside defined Scope → High
- Features that don't serve target users → High
- Implementation that conflicts with vision → High
- Scope extensions without documentation → Medium

Ignore:
- Implementation details (algorithms, data structures)
- Bug fixes and refactorings
- Code style issues (handled by other reviewers)

Return findings as a structured JSON array.
```

### Expected Output
```json
[
  {
    "severity": "critical",
    "subcategory": "Scope",
    "title": "Violates Non-Goal: Team Collaboration Features",
    "description": "Implementation adds team collaboration including shared workspaces...",
    "productSection": "Non-Goals",
    "suggestion": "Remove team collaboration features...",
    "file": "src/collaboration/team-workspace.ts",
    "lines": { "start": 15, "end": 89 }
  }
]
```

## Success Criteria

The Product Alignment Reviewer is successful if:

1. **Accuracy**: Correctly identifies actual product misalignments
2. **No False Positives**: Doesn't flag valid implementations as misaligned
3. **Helpful Suggestions**: Provides actionable alternatives
4. **Fast**: Completes analysis in < 30 seconds for typical changes
5. **Clear**: Findings are easy to understand and fix

## Integration with Review Flow

```
/conductor:review execution
  │
  ├─> Original code review
  │   └─> Style, tests, correctness
  │
  └─> Architecture review
      ├─> Product Alignment Reviewer (this)
      │   ├─> Load product.md
      │   ├─> Analyze changes
      │   └─> Generate findings
      │
      └─> (Future: Tech Stack Reviewer, etc.)

  └─> Unified report
      ├─> If critical product issues: Block
      └─> Otherwise: Proceed with warnings
```
