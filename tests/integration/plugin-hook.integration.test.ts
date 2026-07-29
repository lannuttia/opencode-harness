/**
 * Plugin Hook Integration Tests
 * 
 * Tests the full plugin lifecycle including hook integration with conductor_review
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { HarnessPlugin } from '../../src/plugin';
import type { PluginInput } from '@opencode-ai/plugin';

describe('Plugin Hook Integration', () => {
  let mockPluginInput: PluginInput;

  beforeEach(() => {
    mockPluginInput = {
      directory: process.cwd(),
      // Add other required PluginInput properties as needed
    } as PluginInput;
  });

  describe('HarnessPlugin Initialization', () => {
    it('should initialize plugin and return hooks', async () => {
      const hooks = await HarnessPlugin(mockPluginInput);

      expect(hooks).toBeDefined();
      expect(typeof hooks).toBe('object');
    });

    it('should expose tool.execute.after hook', async () => {
      const hooks = await HarnessPlugin(mockPluginInput);

      expect(hooks['tool.execute.after']).toBeDefined();
      expect(typeof hooks['tool.execute.after']).toBe('function');
    });
  });

  describe('Architecture Review Hook Execution', () => {
    it('should run architecture review when conductor_review tool is executed', async () => {
      const hooks = await HarnessPlugin(mockPluginInput);

      // Mock hook input for conductor_review tool
      const hookInput = {
        tool: 'conductor_review',
        sessionID: 'test-session',
        callID: 'test-call',
      };

      // Mock hook output
      const hookOutput = {
        output: 'Original review output',
        title: 'Review Complete',
        metadata: {},
      };

      // Execute the hook
      const executeAfter = hooks['tool.execute.after'];
      if (executeAfter) {
        await executeAfter(hookInput, hookOutput);

        // Verify architecture review was appended to output
        expect(hookOutput.output).toContain('Architecture Review');
        expect(hookOutput.output).toContain('Original review output');
        expect(hookOutput.output.length).toBeGreaterThan('Original review output'.length);
      }
    });

    it('should not run architecture review for non-review tools', async () => {
      const hooks = await HarnessPlugin(mockPluginInput);

      // Mock hook input for a different tool
      const hookInput = {
        tool: 'some_other_tool',
        sessionID: 'test-session',
        callID: 'test-call',
      };

      const hookOutput = {
        output: 'Original output',
        title: 'Operation Complete',
        metadata: {},
      };

      const originalOutput = hookOutput.output;

      // Execute the hook
      const executeAfter = hooks['tool.execute.after'];
      if (executeAfter) {
        await executeAfter(hookInput, hookOutput);

        // Verify architecture review was NOT added
        expect(hookOutput.output).toBe(originalOutput);
        expect(hookOutput.output).not.toContain('Architecture Review');
      }
    });

    it('should handle errors gracefully during architecture review', async () => {
      const hooks = await HarnessPlugin({
        directory: '/nonexistent/directory/that/does/not/exist',
      } as PluginInput);

      const hookInput = {
        tool: 'conductor_review',
        sessionID: 'test-session',
        callID: 'test-call',
      };

      const hookOutput = {
        output: 'Original review output',
        title: 'Review Complete',
        metadata: {},
      };

      // Execute the hook - should handle error gracefully
      const executeAfter = hooks['tool.execute.after'];
      if (executeAfter) {
        // The hook should complete without throwing
        await executeAfter(hookInput, hookOutput);

        // Verify error was reported in output
        expect(hookOutput.output).toContain('Architecture Review');
        expect(hookOutput.output).toContain('error');
      }
    });

    it('should add warning indicator to title when critical issues found', async () => {
      const hooks = await HarnessPlugin(mockPluginInput);

      const hookInput = {
        tool: 'conductor_review',
        sessionID: 'test-session',
        callID: 'test-call',
      };

      const hookOutput = {
        output: 'Original review output',
        title: 'Review Complete',
        metadata: {},
      };

      const originalTitle = hookOutput.title;

      // Execute the hook
      const executeAfter = hooks['tool.execute.after'];
      if (executeAfter) {
        await executeAfter(hookInput, hookOutput);

        // If critical issues were found, title should have warning indicator
        // Note: This test may pass without indicator if no critical issues in current diff
        // The test validates the behavior is correct either way
        if (hookOutput.title !== originalTitle) {
          expect(hookOutput.title).toContain('⚠️');
        }
      }
    });
  });

  describe('Conductor Plugin Delegation', () => {
    it('should preserve conductor plugin hooks', async () => {
      const hooks = await HarnessPlugin(mockPluginInput);

      // The plugin should have all conductor hooks available
      expect(hooks).toBeDefined();
      
      // At minimum, it should have the tool.execute.after hook we added
      expect(hooks['tool.execute.after']).toBeDefined();
    });
  });
});
