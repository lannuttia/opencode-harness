/**
 * Tests for ProductAlignmentReviewer
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { ProductAlignmentReviewer } from '../../src/reviewers/ProductAlignmentReviewer';
import type { ReviewContext } from '../../src/architecture-review/types';

describe('ProductAlignmentReviewer', () => {
  let reviewer: ProductAlignmentReviewer;
  let mockContext: ReviewContext;

  beforeEach(() => {
    reviewer = new ProductAlignmentReviewer();
    mockContext = {
      scope: { type: 'current' },
      projectContext: {
        product: {
          vision: 'A minimal wrapper around opencode-conductor-plugin',
          targetUsers: 'Individual developers who work on multiple features simultaneously',
          coreProblems: 'Context Switching Overhead, Workflow Inconsistency',
          keyFeatures: 'Conductor Methodology Integration, Comprehensive Framework Capabilities',
          scope: 'Simple wrapper around opencode-conductor-plugin, No custom functionality',
          nonGoals: 'Team collaboration features, Custom Git hosting, IDE-specific integrations',
        },
        techStack: { content: 'TypeScript, Bun, OpenCode Plugin System' },
        workflow: { content: 'Test workflow' },
        codeStyleGuides: {},
        tracksRegistry: { content: 'Test tracks' },
      },
      changes: {
        diff: 'mock diff',
        files: [],
        stats: { additions: 0, deletions: 0, total: 0 },
      },
    };
  });

  describe('Reviewer Metadata', () => {
    it('should have correct name', () => {
      expect(reviewer.name).toBe('Product Alignment');
    });

    it('should have a description', () => {
      expect(reviewer.description).toBeTruthy();
      expect(reviewer.description.length).toBeGreaterThan(0);
    });
  });

  describe('Vision Alignment', () => {
    it('should flag critical issues for contradictory implementations', async () => {
      // Mock context with spec that contradicts vision
      const contextWithContradiction = {
        ...mockContext,
        changes: {
          ...mockContext.changes,
          diff: `
+++ b/src/custom-workflow.ts
@@ -0,0 +1,50 @@
+// Custom workflow orchestration that duplicates conductor functionality
+export class CustomWorkflowOrchestrator {
+  // This contradicts the "minimal wrapper" vision
+}
          `,
        },
      };

      const result = await reviewer.review(contextWithContradiction);

      expect(result.reviewer).toBe('Product Alignment');
      // Should find at least one finding about vision contradiction
      const visionFindings = result.findings.filter(
        f => f.category === 'Vision Alignment' || f.description.toLowerCase().includes('vision')
      );
      expect(visionFindings.length).toBeGreaterThan(0);
      
      // Check if any findings are critical
      const criticalFindings = visionFindings.filter(f => f.severity === 'critical');
      expect(criticalFindings.length).toBeGreaterThan(0);
    });

    it('should return no findings for aligned implementations', async () => {
      // Mock context with implementation that aligns with vision
      const contextWithAlignment = {
        ...mockContext,
        changes: {
          ...mockContext.changes,
          diff: `
+++ b/src/plugin.ts
@@ -1,5 +1,8 @@
 // Minimal wrapper that simply re-exports conductor plugin
-export { MyPlugin } from "opencode-conductor-plugin";
+export { MyPlugin as HarnessPlugin } from "opencode-conductor-plugin";
          `,
        },
      };

      const result = await reviewer.review(contextWithAlignment);

      expect(result.reviewer).toBe('Product Alignment');
      // Should have no critical or high findings about vision
      const severeFindingsAboutVision = result.findings.filter(
        f => (f.severity === 'critical' || f.severity === 'high') &&
             (f.category === 'Vision Alignment' || f.description.toLowerCase().includes('vision'))
      );
      expect(severeFindingsAboutVision.length).toBe(0);
    });
  });

  describe('Target User Validation', () => {
    it('should flag features targeting non-target users', async () => {
      // Mock context with team collaboration feature
      const contextWithTeamFeature = {
        ...mockContext,
        changes: {
          ...mockContext.changes,
          diff: `
+++ b/src/team-sync.ts
@@ -0,0 +1,30 @@
+// Team collaboration and shared state management
+export class TeamSyncManager {
+  // This targets teams, not individual developers
+}
          `,
        },
      };

      const result = await reviewer.review(contextWithTeamFeature);

      expect(result.reviewer).toBe('Product Alignment');
      // Should find findings about target users
      const userFindings = result.findings.filter(
        f => f.category === 'Target Users' || f.description.toLowerCase().includes('target user')
      );
      expect(userFindings.length).toBeGreaterThan(0);
      
      // Should be high or critical severity
      const severeUserFindings = userFindings.filter(
        f => f.severity === 'critical' || f.severity === 'high'
      );
      expect(severeUserFindings.length).toBeGreaterThan(0);
    });
  });

  describe('Scope Validation', () => {
    it('should flag out-of-scope implementations', async () => {
      // Mock context with custom Git hosting (out of scope)
      const contextWithOutOfScope = {
        ...mockContext,
        changes: {
          ...mockContext.changes,
          diff: `
+++ b/src/git-hosting.ts
@@ -0,0 +1,100 @@
+// Custom Git remote hosting service
+export class GitHostingService {
+  // This is explicitly out of scope
+}
          `,
        },
      };

      const result = await reviewer.review(contextWithOutOfScope);

      expect(result.reviewer).toBe('Product Alignment');
      // Should find scope violations
      const scopeFindings = result.findings.filter(
        f => f.category === 'Scope Validation' || f.description.toLowerCase().includes('scope')
      );
      expect(scopeFindings.length).toBeGreaterThan(0);
      
      // Should be critical or high severity
      const severeScopeFindings = scopeFindings.filter(
        f => f.severity === 'critical' || f.severity === 'high'
      );
      expect(severeScopeFindings.length).toBeGreaterThan(0);
    });
  });

  describe('Non-Goals Validation', () => {
    it('should flag critical issues for non-goal implementations', async () => {
      // Mock context implementing team collaboration (non-goal)
      const contextWithNonGoal = {
        ...mockContext,
        changes: {
          ...mockContext.changes,
          diff: `
+++ b/src/collaboration.ts
@@ -0,0 +1,50 @@
+// Team collaboration features - PR approval workflows
+export class TeamCollaborationFeatures {
+  // Non-goal: Team collaboration features
+}
          `,
        },
      };

      const result = await reviewer.review(contextWithNonGoal);

      expect(result.reviewer).toBe('Product Alignment');
      // Should find non-goal violations
      const nonGoalFindings = result.findings.filter(
        f => f.category === 'Non-Goals Validation' || f.description.toLowerCase().includes('non-goal')
      );
      expect(nonGoalFindings.length).toBeGreaterThan(0);
      
      // Non-goal violations MUST be critical
      const criticalNonGoalFindings = nonGoalFindings.filter(f => f.severity === 'critical');
      expect(criticalNonGoalFindings.length).toBeGreaterThan(0);
    });

    it('should not flag issues when non-goals are avoided', async () => {
      // Mock context that correctly avoids non-goals
      const contextAvoidingNonGoals = {
        ...mockContext,
        changes: {
          ...mockContext.changes,
          diff: `
+++ b/src/individual-workflow.ts
@@ -0,0 +1,30 @@
+// Individual developer workflow features
+export class IndividualWorkflowManager {
+  // Focuses on individual developers, not teams
+}
          `,
        },
      };

      const result = await reviewer.review(contextAvoidingNonGoals);

      expect(result.reviewer).toBe('Product Alignment');
      // Should have no critical findings about non-goals
      const criticalNonGoalFindings = result.findings.filter(
        f => f.severity === 'critical' &&
             (f.category === 'Non-Goals Validation' || f.description.toLowerCase().includes('non-goal'))
      );
      expect(criticalNonGoalFindings.length).toBe(0);
    });
  });

  describe('Core Problems Validation', () => {
    it('should flag implementations that worsen core problems', async () => {
      // Mock context that increases context switching overhead
      const contextWorseningProblem = {
        ...mockContext,
        changes: {
          ...mockContext.changes,
          diff: `
+++ b/src/manual-context.ts
@@ -0,0 +1,30 @@
+// Requires manual context file updates on every switch
+export class ManualContextManager {
+  // This worsens "Context Switching Overhead"
+}
          `,
        },
      };

      const result = await reviewer.review(contextWorseningProblem);

      expect(result.reviewer).toBe('Product Alignment');
      // Should find issues about core problems
      const problemFindings = result.findings.filter(
        f => f.category === 'Core Problems' || f.description.toLowerCase().includes('core problem')
      );
      expect(problemFindings.length).toBeGreaterThan(0);
      
      // Should be critical severity when worsening core problems
      const criticalProblemFindings = problemFindings.filter(f => f.severity === 'critical');
      expect(criticalProblemFindings.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing product.md sections gracefully', async () => {
      // Mock context with incomplete product definition
      const contextWithMissingSections = {
        ...mockContext,
        projectContext: {
          ...mockContext.projectContext,
          product: {
            vision: 'Test vision',
            targetUsers: '',  // Empty section
            coreProblems: '',  // Empty section
            keyFeatures: '',
            scope: '',
            nonGoals: '',
          },
        },
      };

      // Should not throw error
      const result = await reviewer.review(contextWithMissingSections);
      
      expect(result.reviewer).toBe('Product Alignment');
      // May have informational findings about missing sections, but should not crash
      expect(result.findings).toBeDefined();
    });

    it('should handle empty diff gracefully', async () => {
      // Mock context with no changes
      const contextWithNoChanges = {
        ...mockContext,
        changes: {
          diff: '',
          files: [],
          stats: { additions: 0, deletions: 0, total: 0 },
        },
      };

      // Should not throw error
      const result = await reviewer.review(contextWithNoChanges);
      
      expect(result.reviewer).toBe('Product Alignment');
      expect(result.findings).toBeDefined();
    });
  });

  describe('Finding Quality', () => {
    it('should include actionable suggestions in findings', async () => {
      const contextWithIssue = {
        ...mockContext,
        changes: {
          ...mockContext.changes,
          diff: `
+++ b/src/team-feature.ts
@@ -0,0 +1,20 @@
+// Team collaboration feature
+export class TeamFeature {
+}
          `,
        },
      };

      const result = await reviewer.review(contextWithIssue);

      // All findings should have suggestions
      const findingsWithoutSuggestions = result.findings.filter(f => !f.suggestion);
      expect(findingsWithoutSuggestions.length).toBe(0);
    });

    it('should include context in all findings', async () => {
      const contextWithIssue = {
        ...mockContext,
        changes: {
          ...mockContext.changes,
          diff: `
+++ b/src/custom-feature.ts
@@ -0,0 +1,20 @@
+export class CustomFeature {
+}
          `,
        },
      };

      const result = await reviewer.review(contextWithIssue);

      // All findings should have descriptions
      const findingsWithoutDescription = result.findings.filter(
        f => !f.description || f.description.length === 0
      );
      expect(findingsWithoutDescription.length).toBe(0);
    });
  });
});
