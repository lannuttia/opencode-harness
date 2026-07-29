/**
 * ProductAlignmentReviewer - Validates implementation against product.md
 */

import type {
  SpecializedReviewer,
  ReviewContext,
  ReviewFindings,
  Finding,
  ProductDefinition,
} from '../architecture-review/types';

/**
 * Validates track implementations against the product definition
 * 
 * Checks:
 * - Vision Alignment: Implementation supports product vision
 * - Target Users: Implementation serves defined target users
 * - Core Problems: Implementation addresses core problems
 * - Scope: Implementation falls within product scope
 * - Non-Goals: Implementation avoids non-goal features (CRITICAL)
 */
export class ProductAlignmentReviewer implements SpecializedReviewer {
  name = 'Product Alignment';
  description = 'Validates implementation against product vision, scope, and target users';

  /**
   * Execute product alignment review
   */
  async review(context: ReviewContext): Promise<ReviewFindings> {
    const findings: Finding[] = [];

    // Extract product definition
    const product = context.projectContext.product;
    const diff = context.changes.diff || '';

    // Run all validation checks in parallel for better performance
    const checks = await Promise.all([
      this.checkVisionAlignment(product, diff),
      this.checkTargetUsers(product, diff),
      this.checkCoreProblems(product, diff),
      this.checkScope(product, diff),
      this.checkNonGoals(product, diff),
    ]);
    findings.push(...checks.flat());

    return {
      reviewer: this.name,
      findings,
    };
  }

  /**
   * Check if implementation aligns with product vision
   */
  private async checkVisionAlignment(
    product: ProductDefinition,
    diff: string
  ): Promise<Finding[]> {
    const findings: Finding[] = [];

    if (!product.vision || product.vision.trim() === '') {
      return findings; // Skip if vision not defined
    }

    // Check for patterns that contradict minimal wrapper vision
    if (product.vision.toLowerCase().includes('minimal wrapper')) {
      // Look for custom functionality that duplicates conductor
      if (diff.includes('CustomWorkflowOrchestrator') ||
          diff.includes('custom workflow orchestration') ||
          diff.match(/class\s+Custom\w+Orchestrator/)) {
        findings.push({
          severity: 'critical',
          category: 'Vision Alignment',
          title: 'Implementation Contradicts Product Vision',
          description: `The product vision states "${product.vision}", but this implementation adds custom workflow orchestration that duplicates conductor functionality.`,
          suggestion: 'Remove custom orchestration and rely on conductor plugin capabilities.',
        });
      }
    }

    return findings;
  }

  /**
   * Check if implementation serves target users
   */
  private async checkTargetUsers(
    product: ProductDefinition,
    diff: string
  ): Promise<Finding[]> {
    const findings: Finding[] = [];

    if (!product.targetUsers || product.targetUsers.trim() === '') {
      return findings; // Skip if target users not defined
    }

    // Check if target users are individual developers
    if (product.targetUsers.toLowerCase().includes('individual developer')) {
      // Look for team collaboration features
      if (diff.includes('TeamSync') ||
          diff.includes('TeamCollaboration') ||
          diff.includes('team collaboration') ||
          diff.includes('shared state management') ||
          diff.match(/class\s+Team\w+/)) {
        findings.push({
          severity: 'high',
          category: 'Target Users',
          title: 'Feature Targets Non-Target Users',
          description: `Target users are "${product.targetUsers}", but this implementation adds team collaboration features that require multi-user coordination.`,
          suggestion: 'Refocus feature on single-developer workflows, or update product.md to expand target users.',
        });
      }
    }

    return findings;
  }

  /**
   * Check if implementation addresses core problems
   */
  private async checkCoreProblems(
    product: ProductDefinition,
    diff: string
  ): Promise<Finding[]> {
    const findings: Finding[] = [];

    if (!product.coreProblems || product.coreProblems.trim() === '') {
      return findings; // Skip if core problems not defined
    }

    // Check if core problems include context switching
    if (product.coreProblems.toLowerCase().includes('context switching')) {
      // Look for manual context management that worsens the problem
      if (diff.includes('ManualContextManager') ||
          diff.includes('manual context file updates') ||
          diff.match(/class\s+Manual\w+Manager/)) {
        findings.push({
          severity: 'critical',
          category: 'Core Problems',
          title: 'Implementation Worsens Core Problem',
          description: `Core problem: "${product.coreProblems}". This implementation requires manual context file updates, increasing cognitive load during switches.`,
          suggestion: 'Automate context file updates to reduce switching overhead.',
        });
      }
    }

    return findings;
  }

  /**
   * Check if implementation falls within product scope
   */
  private async checkScope(
    product: ProductDefinition,
    diff: string
  ): Promise<Finding[]> {
    const findings: Finding[] = [];

    if (!product.scope || product.scope.trim() === '') {
      return findings; // Skip if scope not defined
    }

    // Check for out-of-scope features
    const scope = product.scope.toLowerCase();

    // Look for custom Git hosting (often out of scope)
    if (scope.includes('no custom git hosting')) {
      if (diff.includes('GitHostingService') ||
          diff.includes('custom git remote hosting') ||
          diff.match(/class\s+Git\w+Service/)) {
        findings.push({
          severity: 'critical',
          category: 'Scope Validation',
          title: 'Out of Scope: Custom Git Hosting',
          description: `Product scope explicitly states "${product.scope}", but this implementation adds a custom Git remote hosting service.`,
          suggestion: 'Remove custom hosting service. Use standard Git remotes.',
        });
      }
    }

    // Look for custom functionality when scope is minimal wrapper
    if (scope.includes('no custom functionality')) {
      if (diff.includes('Custom') && !diff.includes('CustomConfig')) {
        findings.push({
          severity: 'high',
          category: 'Scope Validation',
          title: 'Implementation Extends Scope',
          description: `Product scope states "${product.scope}", but this implementation adds custom functionality beyond the wrapper scope.`,
          suggestion: 'Consider if this feature should be contributed to conductor plugin instead, or update product scope.',
        });
      }
    }

    return findings;
  }

  /**
   * Check if implementation avoids non-goal features
   * Non-goal violations are ALWAYS critical
   */
  private async checkNonGoals(
    product: ProductDefinition,
    diff: string
  ): Promise<Finding[]> {
    const findings: Finding[] = [];

    if (!product.nonGoals || product.nonGoals.trim() === '') {
      return findings; // Skip if non-goals not defined
    }

    const nonGoals = product.nonGoals.toLowerCase();

    // Check for team collaboration features (common non-goal)
    if (nonGoals.includes('team collaboration')) {
      if (diff.includes('TeamCollaboration') ||
          diff.includes('PR approval workflows') ||
          diff.includes('team review assignments') ||
          diff.includes('TeamFeature') ||
          diff.match(/class\s+Team\w+/)) {
        findings.push({
          severity: 'critical',
          category: 'Non-Goals Validation',
          title: 'Non-Goal Implementation: Team Collaboration',
          description: `Non-goals explicitly state "${product.nonGoals}", but this implementation adds PR approval workflows and team review assignments.`,
          suggestion: 'Remove team collaboration features. Keep focus on individual developer workflows.',
        });
      }
    }

    // Check for custom Git hosting (common non-goal)
    if (nonGoals.includes('custom git hosting')) {
      if (diff.includes('GitHosting') ||
          diff.match(/class\s+Git\w+Hosting/)) {
        findings.push({
          severity: 'critical',
          category: 'Non-Goals Validation',
          title: 'Non-Goal Implementation: Custom Git Hosting',
          description: `Non-goals explicitly state "${product.nonGoals}", but this implementation adds custom Git hosting functionality.`,
          suggestion: 'Remove custom Git hosting. Use standard Git remotes.',
        });
      }
    }

    // Check for IDE-specific integrations (common non-goal)
    if (nonGoals.includes('ide-specific integrations')) {
      if (diff.includes('VSCodeIntegration') ||
          diff.includes('WebStormIntegration') ||
          diff.match(/class\s+\w+IDEIntegration/)) {
        findings.push({
          severity: 'critical',
          category: 'Non-Goals Validation',
          title: 'Non-Goal Implementation: IDE-Specific Integration',
          description: `Non-goals explicitly state "${product.nonGoals}", but this implementation adds IDE-specific integrations.`,
          suggestion: 'Remove IDE-specific code. Keep integrations generic via OpenCode.',
        });
      }
    }

    return findings;
  }
}
