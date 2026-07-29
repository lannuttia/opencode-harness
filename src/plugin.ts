/**
 * OpenCode Harness Plugin
 * 
 * Extends opencode-conductor-plugin with architecture review capabilities.
 * The architecture reviewer runs automatically as part of /conductor:review.
 */

import type { Plugin, PluginInput } from "@opencode-ai/plugin";
import { MyPlugin as ConductorPlugin } from "opencode-conductor-plugin";

/**
 * OpenCode Harness Plugin
 * 
 * Wraps the conductor plugin and adds architecture review integration.
 * Architecture review runs automatically after conductor review completes.
 */
export const HarnessPlugin: Plugin = async (input: PluginInput) => {
  // Get the original conductor plugin hooks
  const conductorHooks = await ConductorPlugin(input);

  // Import architecture review components dynamically to avoid circular dependencies
  const { ArchitectureReviewer } = await import('./architecture-review/ArchitectureReviewer');
  const { ContextLoader } = await import('./architecture-review/ContextLoader');
  const { ReportGenerator } = await import('./architecture-review/ReportGenerator');
  const { ProductAlignmentReviewer } = await import('./reviewers/ProductAlignmentReviewer');

  // Initialize architecture review components
  const architectureReviewer = new ArchitectureReviewer();
  const contextLoader = new ContextLoader(input.directory);
  const reportGenerator = new ReportGenerator();

  // Register specialized reviewers
  architectureReviewer.registerReviewer(new ProductAlignmentReviewer());

  // Return hooks with architecture review integration
  return {
    ...conductorHooks,

    // Intercept tool execution to add architecture review
    "tool.execute.after": async (hookInput, hookOutput) => {
      // Call conductor's original hook if it exists
      if (conductorHooks["tool.execute.after"]) {
        await conductorHooks["tool.execute.after"](hookInput, hookOutput);
      }

      // Check if this is the review command
      const isReviewCommand = hookInput.tool === 'conductor_review';

      if (isReviewCommand) {
        try {
          // TODO: Use OpenCode plugin logger instead of console for --quiet/--json mode support
          console.log('\n🔍 Running architecture review...');

          // Load project context
          const projectContext = await contextLoader.load();

          // Extract git diff for the review scope
          const { execSync } = await import('child_process');
          let diff = '';
          let files: string[] = [];

          try {
            // Review uncommitted changes (default behavior)
            // TODO: Extract specific scope from conductor review context when available
            diff = execSync('git diff HEAD', { encoding: 'utf-8', cwd: input.directory });
            const filesOutput = execSync('git diff --name-only HEAD', { encoding: 'utf-8', cwd: input.directory });
            files = filesOutput.split('\n').filter(Boolean);
          } catch (error) {
            console.warn('⚠️  Failed to extract git diff, reviewing with empty diff:', error);
          }

          // Create review context
          const context = {
            scope: { type: 'current' as const },
            projectContext,
            changes: {
              diff,
              files,
              stats: { additions: 0, deletions: 0, total: files.length },
            },
          };

          // Execute architecture review
          const reviewResult = await architectureReviewer.executeReview(context);

          // Generate report
          const report = reportGenerator.generate(reviewResult, 'Architecture Review');

          // Append to output
          hookOutput.output = `${hookOutput.output}\n\n---\n\n${report}`;

          // Update title if critical issues found
          if (reviewResult.hasBlockingIssues) {
            hookOutput.title = `${hookOutput.title} ⚠️`;
          }

          console.log('✅ Architecture review complete');
        } catch (error) {
          console.error('⚠️  Architecture review failed:', error);
          const errorMsg = error instanceof Error ? error.message : String(error);
          hookOutput.output = `${hookOutput.output}\n\n---\n\n## Architecture Review\n\n⚠️ Architecture review encountered an error: ${errorMsg}`;
        }
      }
    },
  };
};
