/**
 * ArchitectureReviewer - Orchestrates specialized reviewers
 */

import type {
  IArchitectureReviewer,
  SpecializedReviewer,
  ReviewContext,
  ReviewResult,
  ReviewFindings,
} from './types';

/**
 * Main orchestrator for architecture reviews
 * 
 * Manages registration and execution of specialized reviewers,
 * aggregates their results, and determines blocking status.
 */
export class ArchitectureReviewer implements IArchitectureReviewer {
  private reviewers: SpecializedReviewer[] = [];

  /**
   * Register a specialized reviewer
   */
  registerReviewer(reviewer: SpecializedReviewer): void {
    this.reviewers.push(reviewer);
  }

  /**
   * Execute all registered reviewers in parallel
   * and aggregate their results
   */
  async executeReview(context: ReviewContext): Promise<ReviewResult> {
    // Execute all reviewers in parallel
    const findingsPromises = this.reviewers.map(reviewer =>
      reviewer.review(context).catch(error => {
        // If a reviewer fails, log the error but continue with other reviewers
        console.error(`Reviewer "${reviewer.name}" failed:`, error);
        return {
          reviewer: reviewer.name,
          findings: [],
        } as ReviewFindings;
      })
    );

    const allFindings = await Promise.all(findingsPromises);

    // Calculate summary statistics
    const summary = this.calculateSummary(allFindings);

    // Determine if there are blocking issues
    const hasBlockingIssues = summary.critical > 0;

    return {
      allFindings,
      hasBlockingIssues,
      summary,
    };
  }

  /**
   * Calculate summary statistics from findings
   */
  private calculateSummary(allFindings: ReviewFindings[]): {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  } {
    const summary = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    for (const reviewFindings of allFindings) {
      for (const finding of reviewFindings.findings) {
        summary[finding.severity]++;
      }
    }

    return summary;
  }

  /**
   * Get all registered reviewers
   */
  getReviewers(): SpecializedReviewer[] {
    return [...this.reviewers];
  }

  /**
   * Clear all registered reviewers
   */
  clearReviewers(): void {
    this.reviewers = [];
  }
}
