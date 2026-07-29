/**
 * Tests for ReportGenerator
 */

import { describe, it, expect } from 'bun:test';
import { ReportGenerator } from '../../src/architecture-review/ReportGenerator';
import type { ReviewResult, Finding } from '../../src/architecture-review/types';

describe('ReportGenerator', () => {
  let generator: ReportGenerator;

  beforeEach(() => {
    generator = new ReportGenerator();
  });

  describe('generate', () => {
    it('should generate report with no issues', () => {
      const result: ReviewResult = {
        allFindings: [],
        hasBlockingIssues: false,
        summary: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          info: 0,
        },
      };

      const report = generator.generate(result);

      expect(report).toContain('# Architecture Review');
      expect(report).toContain('All checks passed. No issues found.');
      expect(report).toContain('No issues found.');
    });

    it('should generate report with findings', () => {
      const finding: Finding = {
        severity: 'high',
        category: 'Product Alignment',
        title: 'Feature outside scope',
        description: 'This feature is not in the product scope',
        suggestion: 'Remove or document in product.md',
      };

      const result: ReviewResult = {
        allFindings: [
          {
            reviewer: 'Product Alignment',
            findings: [finding],
          },
        ],
        hasBlockingIssues: false,
        summary: {
          critical: 0,
          high: 1,
          medium: 0,
          low: 0,
          info: 0,
        },
      };

      const report = generator.generate(result);

      expect(report).toContain('# Architecture Review');
      expect(report).toContain('Found 1 issue: 1 high');
      expect(report).toContain('### High: Feature outside scope');
      expect(report).toContain('**Category**: Product Alignment');
      expect(report).toContain('**Context**: This feature is not in the product scope');
      expect(report).toContain('**Suggestion**: Remove or document in product.md');
    });

    it('should include file and line information when available', () => {
      const finding: Finding = {
        severity: 'medium',
        category: 'Test',
        title: 'Test issue',
        description: 'Test description',
        file: 'src/test.ts',
        lines: { start: 10, end: 20 },
      };

      const result: ReviewResult = {
        allFindings: [{ reviewer: 'Test', findings: [finding] }],
        hasBlockingIssues: false,
        summary: {
          critical: 0,
          high: 0,
          medium: 1,
          low: 0,
          info: 0,
        },
      };

      const report = generator.generate(result);

      expect(report).toContain('**File**: `src/test.ts` (Lines 10-20)');
    });

    it('should show blocking recommendation for critical issues', () => {
      const finding: Finding = {
        severity: 'critical',
        category: 'Test',
        title: 'Critical issue',
        description: 'This is critical',
      };

      const result: ReviewResult = {
        allFindings: [{ reviewer: 'Test', findings: [finding] }],
        hasBlockingIssues: true,
        summary: {
          critical: 1,
          high: 0,
          medium: 0,
          low: 0,
          info: 0,
        },
      };

      const report = generator.generate(result);

      expect(report).toContain('Critical issues must be addressed before proceeding');
    });

    it('should show recommendation for high issues', () => {
      const finding: Finding = {
        severity: 'high',
        category: 'Test',
        title: 'High issue',
        description: 'This is high priority',
      };

      const result: ReviewResult = {
        allFindings: [{ reviewer: 'Test', findings: [finding] }],
        hasBlockingIssues: false,
        summary: {
          critical: 0,
          high: 1,
          medium: 0,
          low: 0,
          info: 0,
        },
      };

      const report = generator.generate(result);

      expect(report).toContain('High-priority issues should be addressed');
    });

    it('should order findings by severity', () => {
      const findings: Finding[] = [
        { severity: 'low', category: 'T', title: 'Low', description: 'L' },
        { severity: 'critical', category: 'T', title: 'Critical', description: 'C' },
        { severity: 'medium', category: 'T', title: 'Medium', description: 'M' },
        { severity: 'high', category: 'T', title: 'High', description: 'H' },
        { severity: 'info', category: 'T', title: 'Info', description: 'I' },
      ];

      const result: ReviewResult = {
        allFindings: [{ reviewer: 'Test', findings }],
        hasBlockingIssues: true,
        summary: {
          critical: 1,
          high: 1,
          medium: 1,
          low: 1,
          info: 1,
        },
      };

      const report = generator.generate(result);

      // Check that critical appears before high, high before medium, etc.
      const criticalIndex = report.indexOf('### Critical:');
      const highIndex = report.indexOf('### High:');
      const mediumIndex = report.indexOf('### Medium:');
      const lowIndex = report.indexOf('### Low:');
      const infoIndex = report.indexOf('### Info:');

      expect(criticalIndex).toBeLessThan(highIndex);
      expect(highIndex).toBeLessThan(mediumIndex);
      expect(mediumIndex).toBeLessThan(lowIndex);
      expect(lowIndex).toBeLessThan(infoIndex);
    });

    it('should use custom title', () => {
      const result: ReviewResult = {
        allFindings: [],
        hasBlockingIssues: false,
        summary: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          info: 0,
        },
      };

      const report = generator.generate(result, 'Custom Review Title');

      expect(report).toContain('# Custom Review Title');
    });

    it('should format multiple findings from multiple reviewers', () => {
      const result: ReviewResult = {
        allFindings: [
          {
            reviewer: 'Reviewer 1',
            findings: [
              { severity: 'high', category: 'C1', title: 'Issue 1', description: 'D1' },
            ],
          },
          {
            reviewer: 'Reviewer 2',
            findings: [
              { severity: 'medium', category: 'C2', title: 'Issue 2', description: 'D2' },
            ],
          },
        ],
        hasBlockingIssues: false,
        summary: {
          critical: 0,
          high: 1,
          medium: 1,
          low: 0,
          info: 0,
        },
      };

      const report = generator.generate(result);

      expect(report).toContain('Found 2 issues: 1 high, 1 medium');
      expect(report).toContain('### High: Issue 1');
      expect(report).toContain('### Medium: Issue 2');
    });
  });
});

// Import beforeEach after describe blocks
const { beforeEach } = await import('bun:test');
