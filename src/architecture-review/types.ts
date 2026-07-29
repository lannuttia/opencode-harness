/**
 * Type definitions for the Architecture Review system
 */

/**
 * Severity levels for review findings
 */
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

/**
 * A single finding from a review
 */
export interface Finding {
  /** Severity level of the finding */
  severity: Severity;
  
  /** Category of the finding (e.g., "Product Alignment", "Tech Stack") */
  category: string;
  
  /** Brief title describing the finding */
  title: string;
  
  /** Detailed description of the issue */
  description: string;
  
  /** Optional file path where the issue was found */
  file?: string;
  
  /** Optional line range where the issue was found */
  lines?: {
    start: number;
    end: number;
  };
  
  /** Optional suggestion for fixing the issue */
  suggestion?: string;
}

/**
 * Results from a specialized reviewer
 */
export interface ReviewFindings {
  /** Name of the reviewer that generated these findings */
  reviewer: string;
  
  /** List of findings from this reviewer */
  findings: Finding[];
}

/**
 * Scope of the review (what's being reviewed)
 */
export interface ReviewScope {
  /** Type of scope: track name, "current" for uncommitted, or specific files */
  type: 'track' | 'current' | 'files';
  
  /** Track ID if reviewing a track */
  trackId?: string;
  
  /** List of file paths if reviewing specific files */
  files?: string[];
  
  /** Git revision range for diff comparison */
  revisionRange?: string;
}

/**
 * Product definition from product.md
 */
export interface ProductDefinition {
  readonly vision: string;
  readonly targetUsers: string;
  readonly coreProblems: string;
  readonly keyFeatures: string;
  readonly scope: string;
  readonly nonGoals: string;
}

/**
 * Tech stack definition from tech-stack.md
 */
export interface TechStackDefinition {
  content: string; // Full content of tech-stack.md
}

/**
 * Workflow definition from workflow.md
 */
export interface WorkflowDefinition {
  content: string; // Full content of workflow.md
}

/**
 * Tracks registry information
 */
export interface TracksRegistry {
  content: string; // Full content of tracks.md
}

/**
 * Complete project context loaded from conductor files
 */
export interface ProjectContext {
  product: ProductDefinition;
  techStack: TechStackDefinition;
  workflow: WorkflowDefinition;
  codeStyleGuides: Record<string, string>; // language -> content
  tracksRegistry: TracksRegistry;
}

/**
 * Code changes being reviewed
 */
export interface CodeChanges {
  /** Git diff output */
  diff?: string;
  
  /** List of changed files */
  files?: string[];
  
  /** Summary statistics (lines added/removed) */
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}

/**
 * Context for a review operation
 */
export interface ReviewContext {
  /** What's being reviewed */
  scope: ReviewScope;
  
  /** Project context from conductor files */
  projectContext: ProjectContext;
  
  /** Code changes to review */
  changes: CodeChanges;
}

/**
 * Result of a complete architecture review
 */
export interface ReviewResult {
  /** All findings from all reviewers */
  allFindings: ReviewFindings[];
  
  /** Whether the review has critical issues that block completion */
  hasBlockingIssues: boolean;
  
  /** Summary of findings by severity */
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

/**
 * Interface for specialized reviewers
 */
export interface SpecializedReviewer {
  /** Name of the reviewer */
  name: string;
  
  /** Description of what this reviewer checks */
  description: string;
  
  /** Execute the review and return findings */
  review(context: ReviewContext): Promise<ReviewFindings>;
}

/**
 * Interface for the architecture reviewer orchestrator
 */
export interface IArchitectureReviewer {
  /** Register a specialized reviewer */
  registerReviewer(reviewer: SpecializedReviewer): void;
  
  /** Execute all registered reviewers and return aggregated results */
  executeReview(context: ReviewContext): Promise<ReviewResult>;
}
