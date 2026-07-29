# Architecture Reviewer Framework Design

## Overview

The Architecture Reviewer is a specialized reviewing system that supplements the existing `/conductor:review` command with automated architecture and design validation using AI subagents.

## Architecture

### Component Structure

```
HarnessPlugin (OpenCode Plugin)
├── Wrapped: opencode-conductor-plugin
│   └── /conductor:review command (existing)
└── Extension: Architecture Review System
    ├── ArchitectureReviewer (orchestrator)
    ├── SpecializedReviewers (interface)
    │   └── ProductAlignmentReviewer (implementation)
    ├── ContextLoader (reads conductor files)
    ├── SubagentExecutor (manages AI subagents)
    └── ReportGenerator (unified output)
```

### Key Components

#### 1. ArchitectureReviewer (Orchestrator)
**Purpose**: Central coordinator for the architecture review process

**Responsibilities**:
- Register and manage specialized reviewers
- Load project context from conductor files
- Execute registered reviewers in parallel
- Aggregate results from all reviewers
- Generate unified report
- Determine blocking status based on severity

**Interface**:
```typescript
interface ArchitectureReviewer {
  registerReviewer(reviewer: SpecializedReviewer): void;
  loadContext(): Promise<ProjectContext>;
  executeReview(scope: ReviewScope): Promise<ReviewResult>;
  generateReport(results: ReviewResult[]): string;
}
```

#### 2. SpecializedReviewer (Interface)
**Purpose**: Base interface for all specialized reviewers

**Responsibilities**:
- Define review criteria
- Analyze code/design against criteria
- Return categorized findings

**Interface**:
```typescript
interface SpecializedReviewer {
  name: string;
  description: string;
  
  // Execute the review and return findings
  review(context: ReviewContext): Promise<ReviewFindings>;
}

interface ReviewContext {
  scope: ReviewScope;           // What's being reviewed
  projectContext: ProjectContext; // conductor/ files
  changes: CodeChanges;         // git diff or file list
}

interface ReviewFindings {
  reviewer: string;             // Name of reviewer
  findings: Finding[];          // List of issues found
}

interface Finding {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;             // e.g., "Product Alignment", "Tech Stack"
  title: string;                // Brief description
  description: string;          // Detailed explanation
  file?: string;                // Optional file path
  lines?: { start: number; end: number }; // Optional line range
  suggestion?: string;          // Optional fix recommendation
}
```

#### 3. ProductAlignmentReviewer (Specialized Reviewer)
**Purpose**: Validate implementation against product vision and scope

**Criteria**:
- Product vision alignment
- Scope adherence (in-scope vs out-of-scope)
- Target user needs alignment
- Core problems validation
- Non-goals violations

**Execution**: Uses OpenCode Task/Subagent system to analyze code

#### 4. ContextLoader
**Purpose**: Load and cache conductor context files

**Responsibilities**:
- Resolve file paths using Universal File Resolution Protocol
- Read and parse context files (product.md, tech-stack.md, workflow.md, code style guides)
- Cache loaded content to avoid redundant reads
- Handle missing or invalid files gracefully

**Interface**:
```typescript
interface ContextLoader {
  load(): Promise<ProjectContext>;
  getCached(): ProjectContext | null;
}

interface ProjectContext {
  product: ProductDefinition;
  techStack: TechStackDefinition;
  workflow: WorkflowDefinition;
  codeStyleGuides: Record<string, string>; // language -> content
  tracksRegistry: TracksRegistry;
}
```

#### 5. SubagentExecutor
**Purpose**: Execute specialized reviewers as AI subagents

**Responsibilities**:
- Invoke reviewers using OpenCode's Task/Subagent system
- Execute multiple reviewers in parallel
- Handle timeouts and errors
- Collect results from completed subagents

**Interface**:
```typescript
interface SubagentExecutor {
  execute(reviewers: SpecializedReviewer[], context: ReviewContext): Promise<ReviewFindings[]>;
}
```

#### 6. ReportGenerator
**Purpose**: Generate unified review report in consistent format

**Responsibilities**:
- Format findings by severity and category
- Include file references and line numbers
- Provide actionable recommendations
- Match existing `/conductor:review` format for consistency

**Interface**:
```typescript
interface ReportGenerator {
  generate(results: ReviewFindings[]): string;
}
```

### Integration Points

#### Extension of /conductor:review

The architecture reviewer will be integrated into the existing review command in one of these ways:

**Option A: Override Review Command** (Preferred)
- Replace the conductor plugin's review command with a custom implementation
- Call original review logic first
- Then execute architecture review
- Combine results into unified report

**Option B: Extend Review TOML**
- Modify the review.toml directives to include architecture review steps
- Less invasive but harder to maintain

**Option C: Post-Review Hook**
- Add a separate command that runs after /conductor:review
- Simpler but less integrated user experience

**Decision**: Option A - Override Review Command
- Provides best user experience (single command)
- Full control over review flow
- Can show unified progress indicators

### Result Aggregation

```
Original Review Results
  ├── Plan Compliance findings
  ├── Style Compliance findings
  └── Test Coverage findings
    +
Architecture Review Results
  ├── Product Alignment findings
  └── (Future reviewers' findings)
    =
Unified Review Report
  ├── Summary (combined)
  ├── Verification Checks (combined)
  └── Findings (merged and sorted by severity)
```

### Severity System

| Severity | Blocks Review | Description |
|----------|--------------|-------------|
| Critical | YES | Must fix before proceeding. Violates core requirements. |
| High | NO (warning) | Should fix. Significant deviation from standards. |
| Medium | NO | Recommended to fix. Minor deviation from best practices. |
| Low | NO | Optional improvement. Stylistic or minor suggestions. |
| Info | NO | Informational only. No action required. |

### Execution Flow

```
1. User runs /conductor:review
   │
   ├─> Original Review Process (existing)
   │   ├─> Scope Identification
   │   ├─> Context Retrieval
   │   ├─> Code Analysis
   │   └─> Test Execution
   │
   ├─> Architecture Review Process (new)
   │   ├─> Load Project Context
   │   │   └─> ContextLoader.load()
   │   ├─> Execute Specialized Reviewers (parallel)
   │   │   ├─> ProductAlignmentReviewer
   │   │   └─> (Future reviewers)
   │   └─> Aggregate Results
   │       └─> ReportGenerator.generate()
   │
   └─> Unified Report Generation
       ├─> Combine original + architecture results
       ├─> Sort findings by severity
       └─> Present to user

2. Decision Phase
   ├─> If critical issues: Block completion
   └─> Otherwise: Proceed with standard review flow
```

## Data Flow

```
conductor/
├── product.md ────────┐
├── tech-stack.md ─────┤
├── workflow.md ───────├──> ContextLoader ──> ProjectContext
└── code_styleguides/ ─┘                              │
                                                       │
git diff / changes ────────────────────────────────────┼──> ReviewContext
                                                       │
                                                       ├──> ProductAlignmentReviewer
                                                       │    └──> AI Subagent Analysis
                                                       │         └──> ReviewFindings
                                                       │
                                                       └──> (Future Reviewers)
                                                            └──> ReviewFindings
                                                                      │
                                                                      ├─> ReportGenerator
                                                                      └─> Unified Report
```

## Implementation Strategy

### Phase 1: Research and Design ✓
- Analyze existing implementation ✓
- Design framework architecture (this document)
- Design Product Alignment Reviewer specifications

### Phase 2: Core Framework
- Implement base interfaces and types
- Implement ContextLoader with caching
- Implement ReportGenerator matching existing format

### Phase 3: Product Alignment Reviewer
- Implement ProductAlignmentReviewer with criteria
- Implement SubagentExecutor for parallel execution
- Implement blocking logic for critical issues

### Phase 4: Integration
- Override /conductor:review command
- Integrate architecture reviewer into review flow
- Add progress indicators

### Phase 5: Testing and Documentation
- End-to-end testing
- Documentation and examples
- Manual validation

## Future Extensibility

The framework is designed to easily add new specialized reviewers:

```typescript
// Example: Tech Stack Compliance Reviewer
class TechStackReviewer implements SpecializedReviewer {
  name = "Tech Stack Compliance";
  description = "Validates code adheres to tech stack standards";
  
  async review(context: ReviewContext): Promise<ReviewFindings> {
    // Check dependencies against approved list
    // Validate language versions
    // Check for deprecated APIs
    return findings;
  }
}

// Register with orchestrator
architectureReviewer.registerReviewer(new TechStackReviewer());
```

Other potential reviewers:
- Security Reviewer (check for vulnerabilities)
- Performance Reviewer (identify performance issues)
- Accessibility Reviewer (WCAG compliance)
- API Design Reviewer (REST/GraphQL best practices)
