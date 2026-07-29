/**
 * Tests for ContextLoader
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { ContextLoader } from '../../src/architecture-review/ContextLoader';
import { mkdtemp, writeFile, rm, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('ContextLoader', () => {
  let tempDir: string;
  let conductorDir: string;

  beforeEach(async () => {
    // Create a temporary directory for testing
    tempDir = await mkdtemp(join(tmpdir(), 'context-loader-test-'));
    conductorDir = join(tempDir, 'conductor');
    await mkdir(conductorDir);
  });

  afterEach(async () => {
    // Clean up temp directory
    await rm(tempDir, { recursive: true, force: true });
  });

  describe('load', () => {
    it('should load all context files', async () => {
      // Create mock context files
      await writeFile(
        join(conductorDir, 'product.md'),
        `## Product Vision
Test vision content

## Target Users
Test users content

## Core Problems Solved
Test problems content

## Key Features
Test features content

## Product Scope
Test scope content

## Non-Goals
Test non-goals content
`
      );

      await writeFile(
        join(conductorDir, 'tech-stack.md'),
        'Test tech stack content'
      );

      await writeFile(
        join(conductorDir, 'workflow.md'),
        'Test workflow content'
      );

      await writeFile(
        join(conductorDir, 'tracks.md'),
        'Test tracks content'
      );

      const loader = new ContextLoader(tempDir);
      const context = await loader.load();

      expect(context.product.vision).toBe('Test vision content');
      expect(context.product.targetUsers).toBe('Test users content');
      expect(context.product.coreProblems).toBe('Test problems content');
      expect(context.product.keyFeatures).toBe('Test features content');
      expect(context.product.scope).toBe('Test scope content');
      expect(context.product.nonGoals).toBe('Test non-goals content');
      expect(context.techStack.content).toBe('Test tech stack content');
      expect(context.workflow.content).toBe('Test workflow content');
      expect(context.tracksRegistry.content).toBe('Test tracks content');
    });

    it('should cache loaded context', async () => {
      await writeFile(join(conductorDir, 'product.md'), '# Product Vision\nTest');
      await writeFile(join(conductorDir, 'tech-stack.md'), 'Test');
      await writeFile(join(conductorDir, 'workflow.md'), 'Test');
      await writeFile(join(conductorDir, 'tracks.md'), 'Test');

      const loader = new ContextLoader(tempDir);
      
      // First load
      const context1 = await loader.load();
      
      // Second load should return cached version
      const context2 = await loader.load();
      
      expect(context1).toBe(context2); // Same object reference
    });

    it('should throw error if required file is missing', async () => {
      const loader = new ContextLoader(tempDir);
      
      expect(async () => await loader.load()).toThrow();
    });

    it('should load code style guides if directory exists', async () => {
      await writeFile(join(conductorDir, 'product.md'), '# Product Vision\nTest');
      await writeFile(join(conductorDir, 'tech-stack.md'), 'Test');
      await writeFile(join(conductorDir, 'workflow.md'), 'Test');
      await writeFile(join(conductorDir, 'tracks.md'), 'Test');

      // Create code_styleguides directory with some guides
      const styleGuidesDir = join(conductorDir, 'code_styleguides');
      await mkdir(styleGuidesDir);
      await writeFile(join(styleGuidesDir, 'typescript.md'), 'TypeScript style guide');
      await writeFile(join(styleGuidesDir, 'python.md'), 'Python style guide');

      const loader = new ContextLoader(tempDir);
      const context = await loader.load();

      expect(context.codeStyleGuides.typescript).toBe('TypeScript style guide');
      expect(context.codeStyleGuides.python).toBe('Python style guide');
    });

    it('should return empty guides if code_styleguides directory does not exist', async () => {
      await writeFile(join(conductorDir, 'product.md'), '# Product Vision\nTest');
      await writeFile(join(conductorDir, 'tech-stack.md'), 'Test');
      await writeFile(join(conductorDir, 'workflow.md'), 'Test');
      await writeFile(join(conductorDir, 'tracks.md'), 'Test');

      const loader = new ContextLoader(tempDir);
      const context = await loader.load();

      expect(context.codeStyleGuides).toEqual({});
    });
  });

  describe('getCached', () => {
    it('should return null before loading', () => {
      const loader = new ContextLoader(tempDir);
      expect(loader.getCached()).toBeNull();
    });

    it('should return cached context after loading', async () => {
      await writeFile(join(conductorDir, 'product.md'), '# Product Vision\nTest');
      await writeFile(join(conductorDir, 'tech-stack.md'), 'Test');
      await writeFile(join(conductorDir, 'workflow.md'), 'Test');
      await writeFile(join(conductorDir, 'tracks.md'), 'Test');

      const loader = new ContextLoader(tempDir);
      await loader.load();
      
      const cached = loader.getCached();
      expect(cached).not.toBeNull();
      expect(cached?.product.vision).toBe('Test');
    });
  });

  describe('clearCache', () => {
    it('should clear the cached context', async () => {
      await writeFile(join(conductorDir, 'product.md'), '# Product Vision\nTest');
      await writeFile(join(conductorDir, 'tech-stack.md'), 'Test');
      await writeFile(join(conductorDir, 'workflow.md'), 'Test');
      await writeFile(join(conductorDir, 'tracks.md'), 'Test');

      const loader = new ContextLoader(tempDir);
      await loader.load();
      
      expect(loader.getCached()).not.toBeNull();
      
      loader.clearCache();
      
      expect(loader.getCached()).toBeNull();
    });
  });

  describe('extractSection', () => {
    it('should extract sections with ## headings', async () => {
      await writeFile(
        join(conductorDir, 'product.md'),
        `## Product Vision
Vision content here

## Target Users
Users content here
`
      );
      await writeFile(join(conductorDir, 'tech-stack.md'), 'Test');
      await writeFile(join(conductorDir, 'workflow.md'), 'Test');
      await writeFile(join(conductorDir, 'tracks.md'), 'Test');

      const loader = new ContextLoader(tempDir);
      const context = await loader.load();

      expect(context.product.vision).toBe('Vision content here');
      expect(context.product.targetUsers).toBe('Users content here');
    });

    it('should handle nested headings correctly', async () => {
      await writeFile(
        join(conductorDir, 'product.md'),
        `## Product Vision
Vision overview

### Sub-heading
More detail

## Target Users
Users content
`
      );
      await writeFile(join(conductorDir, 'tech-stack.md'), 'Test');
      await writeFile(join(conductorDir, 'workflow.md'), 'Test');
      await writeFile(join(conductorDir, 'tracks.md'), 'Test');

      const loader = new ContextLoader(tempDir);
      const context = await loader.load();

      expect(context.product.vision).toContain('Vision overview');
      expect(context.product.vision).toContain('Sub-heading');
      expect(context.product.vision).toContain('More detail');
      expect(context.product.targetUsers).toBe('Users content');
    });

    it('should return empty string if section not found', async () => {
      await writeFile(
        join(conductorDir, 'product.md'),
        `## Some Other Section
Content
`
      );
      await writeFile(join(conductorDir, 'tech-stack.md'), 'Test');
      await writeFile(join(conductorDir, 'workflow.md'), 'Test');
      await writeFile(join(conductorDir, 'tracks.md'), 'Test');

      const loader = new ContextLoader(tempDir);
      const context = await loader.load();

      expect(context.product.vision).toBe('');
    });
  });
});

// Import afterEach after describe blocks
const { afterEach } = await import('bun:test');
