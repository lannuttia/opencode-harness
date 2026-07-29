/**
 * Tests for ArchitectureReviewer
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { ArchitectureReviewer } from '../../src/architecture-review/ArchitectureReviewer';
import type {
  SpecializedReviewer,
  ReviewContext,
  ReviewFindings,
  Finding,
} from '../../src/architecture-review/types';

// Mock specialized reviewer for testing
class MockReviewer implements SpecializedReviewer {
  name: string;
  description: string;
  mockFindings: Finding[];

  constructor(name: string, findings: Finding[] = []) {
    this.name = name;
    this.description = `Mock reviewer: ${name}`;
    this.mockFindings = findings;
  }

  async review(_context: ReviewContext): Promise<ReviewFindings> {
    return {
      reviewer: this.name,
      findings: this.mockFindings,
    };
  }
}

describe('ArchitectureReviewer', () => {
  let reviewer: ArchitectureReviewer;
  let mockContext: ReviewContext;

  beforeEach(() => {
    reviewer = new ArchitectureReviewer();
    mockContext = {
      scope: { type: 'current' },
      projectContext: {
        product: {
          vision: 'Test vision',
          targetUsers: 'Test users',
          coreProblems: 'Test problems',
          keyFeatures: 'Test features',
          scope: 'Test scope',
          nonGoals: 'Test non-goals',
        },
        techStack: { content: 'Test tech stack' },
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

  describe('registerReviewer', () => {
    it('should register a specialized reviewer', () => {
      const mockReviewer = new MockReviewer('Test Reviewer');
      reviewer.registerReviewer(mockReviewer);
      
      const reviewers = reviewer.getReviewers();
      expect(reviewers).toHaveLength(1);
      expect(reviewers[0].name).toBe('Test Reviewer');
    });

    it('should register multiple reviewers', () => {
      reviewer.registerReviewer(new MockReviewer('Reviewer 1'));
      reviewer.registerReviewer(new MockReviewer('Reviewer 2'));
      
      const reviewers = reviewer.getReviewers();
      expect(reviewers).toHaveLength(2);
    });
  });

  describe('executeReview', () => {
    it('should execute all registered reviewers', async () => {
      const mockReviewer1 = new MockReviewer('Reviewer 1', [
        {
          severity: 'high',
          category: 'Test',
          title: 'Issue 1',
          description: 'Test issue 1',
        },
      ]);
      const mockReviewer2 = new MockReviewer('Reviewer 2', [
        {
          severity: 'medium',
          category: 'Test',
          title: 'Issue 2',
          description: 'Test issue 2',
        },
      ]);

      reviewer.registerReviewer(mockReviewer1);
      reviewer.registerReviewer(mockReviewer2);

      const result = await reviewer.executeReview(mockContext);

      expect(result.allFindings).toHaveLength(2);
      expect(result.allFindings[0].reviewer).toBe('Reviewer 1');
      expect(result.allFindings[1].reviewer).toBe('Reviewer 2');
    });

    it('should return empty results with no reviewers', async () => {
      const result = await reviewer.executeReview(mockContext);

      expect(result.allFindings).toHaveLength(0);
      expect(result.hasBlockingIssues).toBe(false);
      expect(result.summary.critical).toBe(0);
    });

    it('should calculate summary correctly', async () => {
      const mockReviewer = new MockReviewer('Test', [
        { severity: 'critical', category: 'Test', title: 'C1', description: 'Critical 1' },
        { severity: 'critical', category: 'Test', title: 'C2', description: 'Critical 2' },
        { severity: 'high', category: 'Test', title: 'H1', description: 'High 1' },
        { severity: 'medium', category: 'Test', title: 'M1', description: 'Medium 1' },
        { severity: 'low', category: 'Test', title: 'L1', description: 'Low 1' },
        { severity: 'info', category: 'Test', title: 'I1', description: 'Info 1' },
      ]);

      reviewer.registerReviewer(mockReviewer);
      const result = await reviewer.executeReview(mockContext);

      expect(result.summary.critical).toBe(2);
      expect(result.summary.high).toBe(1);
      expect(result.summary.medium).toBe(1);
      expect(result.summary.low).toBe(1);
      expect(result.summary.info).toBe(1);
    });

    it('should detect blocking issues when critical findings exist', async () => {
      const mockReviewer = new MockReviewer('Test', [
        { severity: 'critical', category: 'Test', title: 'Critical', description: 'Critical issue' },
      ]);

      reviewer.registerReviewer(mockReviewer);
      const result = await reviewer.executeReview(mockContext);

      expect(result.hasBlockingIssues).toBe(true);
    });

    it('should not block when only non-critical findings exist', async () => {
      const mockReviewer = new MockReviewer('Test', [
        { severity: 'high', category: 'Test', title: 'High', description: 'High issue' },
        { severity: 'medium', category: 'Test', title: 'Medium', description: 'Medium issue' },
      ]);

      reviewer.registerReviewer(mockReviewer);
      const result = await reviewer.executeReview(mockContext);

      expect(result.hasBlockingIssues).toBe(false);
    });

    it('should handle reviewer failures gracefully', async () => {
      class FailingReviewer implements SpecializedReviewer {
        name = 'Failing Reviewer';
        description = 'Always fails';
        
        async review(_context: ReviewContext): Promise<ReviewFindings> {
          throw new Error('Reviewer failed');
        }
      }

      const workingReviewer = new MockReviewer('Working', [
        { severity: 'high', category: 'Test', title: 'Issue', description: 'Test issue' },
      ]);

      reviewer.registerReviewer(new FailingReviewer());
      reviewer.registerReviewer(workingReviewer);

      const result = await reviewer.executeReview(mockContext);

      // Should still return results from working reviewer
      expect(result.allFindings).toHaveLength(2);
      expect(result.allFindings[0].findings).toHaveLength(0); // Failed reviewer
      expect(result.allFindings[1].findings).toHaveLength(1); // Working reviewer
    });
  });

  describe('clearReviewers', () => {
    it('should remove all registered reviewers', () => {
      reviewer.registerReviewer(new MockReviewer('Test 1'));
      reviewer.registerReviewer(new MockReviewer('Test 2'));
      
      expect(reviewer.getReviewers()).toHaveLength(2);
      
      reviewer.clearReviewers();
      
      expect(reviewer.getReviewers()).toHaveLength(0);
    });
  });
});
