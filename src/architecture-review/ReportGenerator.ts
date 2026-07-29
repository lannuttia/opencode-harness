/**
 * ReportGenerator - Generates unified review reports
 */

import type { ReviewResult, Finding } from './types';

/**
 * Generates formatted review reports from findings
 * 
 * Matches the existing /conductor:review format for consistency.
 */
export class ReportGenerator {
  /**
   * Generate a complete review report
   */
  generate(result: ReviewResult, title: string = 'Architecture Review'): string {
    const sections: string[] = [];

    // Header
    sections.push(`# ${title}\n`);

    // Summary
    sections.push(this.generateSummary(result));
    sections.push('');

    // Findings section (only if there are findings)
    if (this.hasFindingsToShow(result)) {
      sections.push('## Findings\n');
      sections.push(this.generateFindings(result));
    } else {
      sections.push('## Findings\n');
      sections.push('No issues found.\n');
    }

    return sections.join('\n');
  }

  /**
   * Generate summary section
   */
  private generateSummary(result: ReviewResult): string {
    const { summary } = result;
    const total = summary.critical + summary.high + summary.medium + summary.low + summary.info;

    if (total === 0) {
      return '## Summary\n\nAll checks passed. No issues found.';
    }

    const parts: string[] = [];
    if (summary.critical > 0) {
      parts.push(`${summary.critical} critical`);
    }
    if (summary.high > 0) {
      parts.push(`${summary.high} high`);
    }
    if (summary.medium > 0) {
      parts.push(`${summary.medium} medium`);
    }
    if (summary.low > 0) {
      parts.push(`${summary.low} low`);
    }
    if (summary.info > 0) {
      parts.push(`${summary.info} info`);
    }

    const summaryText = `Found ${total} issue${total === 1 ? '' : 's'}: ${parts.join(', ')}.`;
    
    let recommendation = '';
    if (result.hasBlockingIssues) {
      recommendation = '\n\n**Recommendation**: Critical issues must be addressed before proceeding.';
    } else if (summary.high > 0) {
      recommendation = '\n\n**Recommendation**: High-priority issues should be addressed.';
    } else if (summary.medium > 0 || summary.low > 0) {
      recommendation = '\n\n**Recommendation**: Consider addressing these suggestions to improve quality.';
    }

    return `## Summary\n\n${summaryText}${recommendation}`;
  }

  /**
   * Generate findings section
   */
  private generateFindings(result: ReviewResult): string {
    // Group findings by severity
    const findingsBySeverity = this.groupBySeverity(result);
    const sections: string[] = [];

    // Output in severity order
    const severityOrder = ['critical', 'high', 'medium', 'low', 'info'] as const;
    
    for (const severity of severityOrder) {
      const findings = findingsBySeverity[severity];
      if (!findings || findings.length === 0) continue;

      for (const finding of findings) {
        sections.push(this.formatFinding(finding));
      }
    }

    return sections.join('\n');
  }

  /**
   * Format a single finding
   */
  private formatFinding(finding: Finding): string {
    const parts: string[] = [];

    // Title with severity
    const severityLabel = finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1);
    parts.push(`### ${severityLabel}: ${finding.title}`);
    parts.push('');

    // Category
    parts.push(`**Category**: ${finding.category}`);
    parts.push('');

    // File and lines if available
    if (finding.file) {
      let location = `**File**: \`${finding.file}\``;
      if (finding.lines) {
        location += ` (Lines ${finding.lines.start}-${finding.lines.end})`;
      }
      parts.push(location);
      parts.push('');
    }

    // Description
    parts.push(`**Context**: ${finding.description}`);
    parts.push('');

    // Suggestion if available
    if (finding.suggestion) {
      parts.push(`**Suggestion**: ${finding.suggestion}`);
      parts.push('');
    }

    return parts.join('\n');
  }

  /**
   * Group findings by severity
   */
  private groupBySeverity(result: ReviewResult): Record<string, Finding[]> {
    const groups: Record<string, Finding[]> = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      info: [],
    };

    for (const reviewFindings of result.allFindings) {
      for (const finding of reviewFindings.findings) {
        const group = groups[finding.severity];
        if (group) {
          group.push(finding);
        }
      }
    }

    return groups;
  }

  /**
   * Check if there are any findings to show
   */
  private hasFindingsToShow(result: ReviewResult): boolean {
    return result.allFindings.some(rf => rf.findings.length > 0);
  }
}
