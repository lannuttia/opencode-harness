/**
 * End-to-End Integration Tests for Architecture Review
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { ArchitectureReviewer } from '../../src/architecture-review/ArchitectureReviewer';
import { ContextLoader } from '../../src/architecture-review/ContextLoader';
import { ReportGenerator } from '../../src/architecture-review/ReportGenerator';
import { ProductAlignmentReviewer } from '../../src/reviewers/ProductAlignmentReviewer';
import type { 
  ReviewContext,
  ReviewFindings,
  SpecializedReviewer,
} from '../../src/architecture-review/types';

describe('Architecture Review Integration', () => {
  let architectureReviewer: ArchitectureReviewer;
  let contextLoader: ContextLoader;
  let reportGenerator: ReportGenerator;

  beforeEach(() => {
    architectureReviewer = new ArchitectureReviewer();
    contextLoader = new ContextLoader(process.cwd());
    reportGenerator = new ReportGenerator();
  });

  describe('Full Review Workflow', () => {
    it('should execute complete review with real project context', async () => {
      // Register Product Alignment Reviewer
      const productAlignmentReviewer = new ProductAlignmentReviewer();
      architectureReviewer.registerReviewer(productAlignmentReviewer);

      // Load real project context
      const projectContext = await contextLoader.load();

      // Verify context loaded successfully
      expect(projectContext.product).toBeDefined();
      expect(projectContext.product.vision).toBeTruthy();
      expect(projectContext.techStack).toBeDefined();
      expect(projectContext.workflow).toBeDefined();

      // Create review context with mock changes
      const context: ReviewContext = {
        scope: { type: 'current' },
        projectContext,
        changes: {
          diff: `
+++ b/src/test-feature.ts
@@ -0,0 +1,10 @@
+// Test feature that aligns with product
+export class IndividualDeveloperFeature {
+  // Supports individual developer workflows
+}
          `,
          files: ['src/test-feature.ts'],
          stats: { additions: 10, deletions: 0, total: 10 },
        },
      };

      // Execute review
      const result = await architectureReviewer.executeReview(context);

      // Verify result structure
      expect(result).toBeDefined();
      expect(result.allFindings).toBeDefined();
      expect(result.hasBlockingIssues).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.summary.critical).toBeGreaterThanOrEqual(0);
      expect(result.summary.high).toBeGreaterThanOrEqual(0);
      expect(result.summary.medium).toBeGreaterThanOrEqual(0);
      expect(result.summary.low).toBeGreaterThanOrEqual(0);
      expect(result.summary.info).toBeGreaterThanOrEqual(0);
    });

    it('should detect critical issues in misaligned implementation', async () => {
      // Register Product Alignment Reviewer
      architectureReviewer.registerReviewer(new ProductAlignmentReviewer());

      // Load real project context
      const projectContext = await contextLoader.load();

      // Create review context with non-goal violation
      const context: ReviewContext = {
        scope: { type: 'current' },
        projectContext,
        changes: {
          diff: `
+++ b/src/team-collaboration.ts
@@ -0,0 +1,20 @@
+// Team collaboration features (non-goal violation)
+export class TeamCollaborationManager {
+  // This violates the "no team collaboration" non-goal
+}
          `,
          files: ['src/team-collaboration.ts'],
          stats: { additions: 20, deletions: 0, total: 20 },
        },
      };

      // Execute review
      const result = await architectureReviewer.executeReview(context);

      // Should have blocking issues due to non-goal violation
      expect(result.hasBlockingIssues).toBe(true);
      expect(result.summary.critical).toBeGreaterThan(0);

      // Verify findings include non-goal violation
      const allFindings = result.allFindings.flatMap(rf => rf.findings);
      const criticalFindings = allFindings.filter(f => f.severity === 'critical');
      expect(criticalFindings.length).toBeGreaterThan(0);
    });

    it('should not block for non-critical issues', async () => {
      // Register Product Alignment Reviewer
      architectureReviewer.registerReviewer(new ProductAlignmentReviewer());

      // Load real project context
      const projectContext = await contextLoader.load();

      // Create review context with aligned implementation
      const context: ReviewContext = {
        scope: { type: 'current' },
        projectContext,
        changes: {
          diff: `
+++ b/src/wrapper.ts
@@ -0,0 +1,5 @@
+// Simple wrapper following minimal wrapper vision
+export { SomeFeature } from "opencode-conductor-plugin";
          `,
          files: ['src/wrapper.ts'],
          stats: { additions: 5, deletions: 0, total: 5 },
        },
      };

      // Execute review
      const result = await architectureReviewer.executeReview(context);

      // Should not have blocking issues
      expect(result.hasBlockingIssues).toBe(false);
    });
  });

  describe('Report Generation', () => {
    it('should generate properly formatted report', async () => {
      // Register reviewer
      architectureReviewer.registerReviewer(new ProductAlignmentReviewer());

      // Load context
      const projectContext = await contextLoader.load();

      // Create review context
      const context: ReviewContext = {
        scope: { type: 'current' },
        projectContext,
        changes: {
          diff: '',
          files: [],
          stats: { additions: 0, deletions: 0, total: 0 },
        },
      };

      // Execute review
      const result = await architectureReviewer.executeReview(context);

      // Generate report
      const report = reportGenerator.generate(result, 'Architecture Review');

      // Verify report structure
      expect(report).toContain('# Architecture Review');
      expect(report).toContain('## Summary');
      expect(report).toContain('## Findings');
    });

    it('should include blocking warning in report', async () => {
      // Register reviewer
      architectureReviewer.registerReviewer(new ProductAlignmentReviewer());

      // Load context
      const projectContext = await contextLoader.load();

      // Create context with violation
      const context: ReviewContext = {
        scope: { type: 'current' },
        projectContext,
        changes: {
          diff: `
+++ b/src/team-feature.ts
@@ -0,0 +1,10 @@
+export class TeamFeature {
+}
          `,
          files: ['src/team-feature.ts'],
          stats: { additions: 10, deletions: 0, total: 10 },
        },
      };

      // Execute review
      const result = await architectureReviewer.executeReview(context);

      // Generate report
      const report = reportGenerator.generate(result, 'Architecture Review');

      // If there are critical issues, report should mention them
      if (result.hasBlockingIssues) {
        expect(report).toContain('Critical');
      }
    });
  });

  describe('Performance', () => {
    it('should complete review in under 2 seconds', async () => {
      // Register reviewer
      architectureReviewer.registerReviewer(new ProductAlignmentReviewer());

      // Load context
      const projectContext = await contextLoader.load();

      // Create review context
      const context: ReviewContext = {
        scope: { type: 'current' },
        projectContext,
        changes: {
          diff: '',
          files: [],
          stats: { additions: 0, deletions: 0, total: 0 },
        },
      };

      // Measure execution time
      const startTime = Date.now();
      await architectureReviewer.executeReview(context);
      const endTime = Date.now();

      const executionTime = endTime - startTime;

      // Should complete in under 2 seconds (2000ms)
      expect(executionTime).toBeLessThan(2000);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing context files gracefully', async () => {
      // Create context loader with invalid directory
      const invalidLoader = new ContextLoader('/nonexistent/directory');

      // Should throw error for missing context
      await expect(invalidLoader.load()).rejects.toThrow();
    });

    it('should continue review if one reviewer fails', async () => {
      // Create a failing reviewer
      const failingReviewer = {
        name: 'Failing Reviewer',
        description: 'Always fails',
        async review(): Promise<ReviewFindings> {
          throw new Error('Reviewer failed');
        },
      };

      // Register both failing and working reviewers
      architectureReviewer.registerReviewer(failingReviewer as SpecializedReviewer);
      architectureReviewer.registerReviewer(new ProductAlignmentReviewer());

      // Load context
      const projectContext = await contextLoader.load();

      // Create review context
      const context: ReviewContext = {
        scope: { type: 'current' },
        projectContext,
        changes: {
          diff: '',
          files: [],
          stats: { additions: 0, deletions: 0, total: 0 },
        },
      };

      // Execute review - should not throw
      const result = await architectureReviewer.executeReview(context);

      // Should have results from working reviewer
      expect(result.allFindings).toHaveLength(2);
      
      // Failing reviewer should return empty findings
      const failingResults = result.allFindings.find(r => r.reviewer === 'Failing Reviewer');
      expect(failingResults?.findings).toHaveLength(0);
    });
  });
});
