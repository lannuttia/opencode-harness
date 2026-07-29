/**
 * ContextLoader - Loads and caches Conductor context files
 */

import { readFile, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { ProjectContext, ProductDefinition } from './types';

/**
 * Loads Conductor context files from the conductor/ directory
 * 
 * Implements caching to avoid redundant file reads.
 * Follows the Universal File Resolution Protocol.
 */
export class ContextLoader {
  private cache: ProjectContext | null = null;
  private conductorDir: string;

  constructor(workingDir: string = process.cwd()) {
    this.conductorDir = resolve(workingDir, 'conductor');
  }

  /**
   * Load all conductor context files
   * Returns cached context if already loaded
   */
  async load(): Promise<ProjectContext> {
    if (this.cache) {
      return this.cache;
    }

    const context: ProjectContext = {
      product: await this.loadProduct(),
      techStack: await this.loadTechStack(),
      workflow: await this.loadWorkflow(),
      codeStyleGuides: await this.loadCodeStyleGuides(),
      tracksRegistry: await this.loadTracksRegistry(),
    };

    this.cache = context;
    return context;
  }

  /**
   * Get cached context without loading
   */
  getCached(): ProjectContext | null {
    return this.cache;
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache = null;
  }

  /**
   * Load product.md and parse sections
   */
  private async loadProduct(): Promise<ProductDefinition> {
    const content = await this.readFile('product.md');
    
    return {
      vision: this.extractSection(content, 'Product Vision'),
      targetUsers: this.extractSection(content, 'Target Users'),
      coreProblems: this.extractSection(content, 'Core Problems Solved'),
      keyFeatures: this.extractSection(content, 'Key Features'),
      scope: this.extractSection(content, 'Product Scope'),
      nonGoals: this.extractSection(content, 'Non-Goals'),
    };
  }

  /**
   * Load tech-stack.md
   */
  private async loadTechStack(): Promise<{ content: string }> {
    const content = await this.readFile('tech-stack.md');
    return { content };
  }

  /**
   * Load workflow.md
   */
  private async loadWorkflow(): Promise<{ content: string }> {
    const content = await this.readFile('workflow.md');
    return { content };
  }

  /**
   * Load tracks.md registry
   */
  private async loadTracksRegistry(): Promise<{ content: string }> {
    const content = await this.readFile('tracks.md');
    return { content };
  }

  /**
   * Load all code style guides from conductor/code_styleguides/
   */
  private async loadCodeStyleGuides(): Promise<Record<string, string>> {
    const styleGuidesDir = join(this.conductorDir, 'code_styleguides');
    const guides: Record<string, string> = {};

    try {
      await access(styleGuidesDir);
      const fs = await import('node:fs/promises');
      const entries = await fs.readdir(styleGuidesDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          const language = entry.name.replace('.md', '');
          const content = await fs.readFile(join(styleGuidesDir, entry.name), 'utf-8');
          guides[language] = content;
        }
      }
    } catch (error) {
      // Directory doesn't exist or is not accessible - return empty guides
      // This is not an error, as code_styleguides is optional
    }

    return guides;
  }

  /**
   * Read a file from the conductor directory
   */
  private async readFile(filename: string): Promise<string> {
    const path = join(this.conductorDir, filename);
    
    try {
      return await readFile(path, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read ${filename}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Extract a section from markdown content
   * Sections are identified by headings (# or ##)
   */
  private extractSection(content: string, sectionName: string): string {
    const lines = content.split('\n');
    const sectionStart = lines.findIndex(line => {
      // Match ## Section Name or # Section Name
      const match = line.match(/^#{1,6}\s+(.+)$/);
      return match && match[1]?.trim() === sectionName;
    });

    if (sectionStart === -1) {
      return ''; // Section not found
    }

    // Find the end of the section (next heading of same or higher level)
    const startHeading = lines[sectionStart];
    if (!startHeading) return '';
    const startMatch = startHeading.match(/^#+/);
    const startLevel = startMatch ? startMatch[0].length : 0;
    let sectionEnd = lines.length;

    for (let i = sectionStart + 1; i < lines.length; i++) {
      const match = lines[i]?.match(/^#{1,6}\s/);
      if (match) {
        const currentHeading = lines[i];
        const currentMatch = currentHeading?.match(/^#+/);
        const currentLevel = currentMatch ? currentMatch[0].length : 0;
        if (currentLevel <= startLevel) {
          sectionEnd = i;
          break;
        }
      }
    }

    // Extract section content (excluding the heading itself)
    return lines.slice(sectionStart + 1, sectionEnd).join('\n').trim();
  }
}
