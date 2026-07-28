# TypeScript Code Style Guide

## General Principles

1. **Type Safety First:** Leverage TypeScript's type system to catch errors at compile time
2. **Explicit Over Implicit:** Be explicit about types, especially in public APIs
3. **Consistency:** Follow consistent patterns across the codebase
4. **Readability:** Code is read more often than written

## TypeScript Configuration

### tsconfig.json

Use strict TypeScript settings:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Naming Conventions

### Files and Directories

- **Files:** kebab-case for file names (`user-service.ts`, `git-workspace.ts`)
- **Test files:** Same name with `.test.ts` or `.spec.ts` suffix
- **Type definition files:** Same name with `.d.ts` suffix
- **Directories:** kebab-case (`src/track-manager`, `lib/git-utils`)

### Variables and Functions

```typescript
// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 5000;

// Variables: camelCase
let trackCount = 0;
const userName = "developer";

// Functions: camelCase with descriptive verb
function createWorkspace(trackId: string): Workspace { }
function validateTrackId(id: string): boolean { }
async function fetchUserData(): Promise<User> { }

// Private functions: prefix with underscore (optional)
function _internalHelper(): void { }
```

### Classes and Interfaces

```typescript
// Classes: PascalCase
class TrackManager { }
class GitWorkspaceService { }

// Interfaces: PascalCase (no I prefix)
interface Track {
  id: string;
  status: TrackStatus;
}

interface WorkspaceConfig {
  path: string;
  branch: string;
}

// Type aliases: PascalCase
type TrackStatus = "new" | "in_progress" | "completed" | "cancelled";
type Result<T> = { success: true; data: T } | { success: false; error: string };

// Enums: PascalCase for name, UPPER_CASE for values
enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR"
}
```

### Generics

```typescript
// Single letter for simple generics
function identity<T>(value: T): T {
  return value;
}

// Descriptive names for complex generics
function mapAsync<TInput, TOutput>(
  items: TInput[],
  mapper: (item: TInput) => Promise<TOutput>
): Promise<TOutput[]> {
  return Promise.all(items.map(mapper));
}
```

## Type Annotations

### When to Use Type Annotations

```typescript
// Always annotate function parameters
function processTrack(trackId: string, options: ProcessOptions): void { }

// Always annotate function return types
function getTrackStatus(id: string): TrackStatus {
  return "in_progress";
}

// Annotate when type inference is unclear
const config: WorkspaceConfig = loadConfig();

// Let TypeScript infer obvious types
const count = 5; // number (inferred)
const items = [1, 2, 3]; // number[] (inferred)
```

### Avoid `any`

```typescript
// Bad
function process(data: any): any {
  return data.value;
}

// Good - use unknown for truly unknown types
function process(data: unknown): string {
  if (typeof data === "object" && data !== null && "value" in data) {
    return String(data.value);
  }
  throw new Error("Invalid data");
}

// Good - use generics when appropriate
function process<T extends { value: string }>(data: T): string {
  return data.value;
}
```

## Functions

### Function Declarations

```typescript
// Use function declarations for top-level functions
function createTrack(description: string): Track {
  return { id: generateId(), description, status: "new" };
}

// Use arrow functions for callbacks and short functions
const trackIds = tracks.map(track => track.id);
const activeTrack = tracks.find(t => t.status === "in_progress");

// Async functions
async function loadTrack(id: string): Promise<Track> {
  const data = await readFile(`tracks/${id}/metadata.json`);
  return JSON.parse(data);
}
```

### Optional and Default Parameters

```typescript
// Optional parameters (use ? sparingly)
function formatTrack(track: Track, verbose?: boolean): string {
  return verbose ? JSON.stringify(track, null, 2) : track.id;
}

// Default parameters (preferred over optional)
function formatTrack(track: Track, verbose: boolean = false): string {
  return verbose ? JSON.stringify(track, null, 2) : track.id;
}

// Rest parameters
function mergeTracks(...tracks: Track[]): Track[] {
  return tracks;
}
```

## Interfaces and Types

### Interface vs Type

```typescript
// Prefer interfaces for object shapes
interface Track {
  id: string;
  description: string;
  status: TrackStatus;
}

// Use type for unions, intersections, and primitives
type TrackStatus = "new" | "in_progress" | "completed";
type Result<T> = Success<T> | Failure;

// Extending interfaces
interface DetailedTrack extends Track {
  createdAt: Date;
  updatedAt: Date;
}

// Intersection types
type TrackWithMetadata = Track & {
  metadata: Record<string, unknown>;
};
```

### Readonly Properties

```typescript
// Use readonly for immutable properties
interface Track {
  readonly id: string;
  description: string;
  status: TrackStatus;
}

// Readonly arrays
function processItems(items: readonly string[]): void {
  // items.push("new"); // Error: readonly
}
```

## Classes

### Class Structure

```typescript
class TrackManager {
  // Static properties first
  private static readonly DEFAULT_STATUS = "new";
  
  // Instance properties
  private tracks: Map<string, Track>;
  private readonly config: ManagerConfig;
  
  // Constructor
  constructor(config: ManagerConfig) {
    this.config = config;
    this.tracks = new Map();
  }
  
  // Public methods
  public createTrack(description: string): Track {
    const track = this.buildTrack(description);
    this.tracks.set(track.id, track);
    return track;
  }
  
  // Private methods
  private buildTrack(description: string): Track {
    return {
      id: this.generateId(),
      description,
      status: TrackManager.DEFAULT_STATUS
    };
  }
  
  private generateId(): string {
    return `track_${Date.now()}`;
  }
}
```

### Access Modifiers

```typescript
class Workspace {
  // public: accessible everywhere (default)
  public id: string;
  
  // protected: accessible in class and subclasses
  protected config: WorkspaceConfig;
  
  // private: accessible only in class
  private state: WorkspaceState;
  
  // Use private for true encapsulation
  #internalState: string; // ECMAScript private field
}
```

## Error Handling

### Custom Error Classes

```typescript
class TrackError extends Error {
  constructor(
    message: string,
    public readonly trackId: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = "TrackError";
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown
  ) {
    super(message);
    this.name = "ValidationError";
  }
}
```

### Error Handling Patterns

```typescript
// Use try-catch for async operations
async function loadTrack(id: string): Promise<Track> {
  try {
    const data = await readFile(`tracks/${id}/metadata.json`);
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TrackError(`Invalid JSON in track ${id}`, id, error);
    }
    throw error;
  }
}

// Result type for operations that may fail
type Result<T, E = Error> = 
  | { success: true; value: T }
  | { success: false; error: E };

async function safeLoadTrack(id: string): Promise<Result<Track>> {
  try {
    const track = await loadTrack(id);
    return { success: true, value: track };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}
```

## Async/Await

### Async Best Practices

```typescript
// Always mark async functions
async function fetchData(): Promise<Data> {
  const response = await fetch("/api/data");
  return response.json();
}

// Parallel async operations
async function loadMultipleTracks(ids: string[]): Promise<Track[]> {
  // Good: parallel execution
  const tracks = await Promise.all(ids.map(id => loadTrack(id)));
  return tracks;
  
  // Bad: sequential execution (slower)
  // const tracks: Track[] = [];
  // for (const id of ids) {
  //   tracks.push(await loadTrack(id));
  // }
  // return tracks;
}

// Handle errors in async functions
async function processTrack(id: string): Promise<void> {
  try {
    const track = await loadTrack(id);
    await validateTrack(track);
    await saveTrack(track);
  } catch (error) {
    console.error(`Failed to process track ${id}:`, error);
    throw error;
  }
}
```

## Modules and Imports

### Import Order

```typescript
// 1. Node.js built-ins
import { readFile } from "fs/promises";
import { join } from "path";

// 2. External packages
import { z } from "zod";
import { Effect } from "effect";

// 3. Internal modules (absolute imports)
import { Track, TrackStatus } from "@/types";
import { validateTrack } from "@/validators";

// 4. Relative imports
import { helper } from "./helper";
import type { LocalConfig } from "./types";
```

### Export Patterns

```typescript
// Named exports (preferred for most cases)
export function createTrack(desc: string): Track { }
export class TrackManager { }
export interface Track { }

// Default exports (use sparingly, mainly for single-purpose modules)
export default class MainService { }

// Re-exports
export { Track, TrackStatus } from "./types";
export type { TrackMetadata } from "./metadata";
```

## Type Guards and Assertions

### Type Guards

```typescript
// User-defined type guard
function isTrack(value: unknown): value is Track {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "status" in value &&
    typeof value.id === "string"
  );
}

// Use type guards
function processValue(value: unknown): void {
  if (isTrack(value)) {
    console.log(value.id); // TypeScript knows it's a Track
  }
}
```

### Type Assertions

```typescript
// Avoid type assertions when possible
const value = getData() as Track; // Avoid

// Prefer type guards
const value = getData();
if (isTrack(value)) {
  // Use value as Track
}

// Use non-null assertion (!) only when certain
const element = document.getElementById("root")!; // Only if guaranteed to exist

// Const assertions for literal types
const config = {
  mode: "production",
  port: 3000
} as const; // Creates readonly literal types
```

## Comments and Documentation

### JSDoc Comments

```typescript
/**
 * Creates a new track with the given description.
 * 
 * @param description - Human-readable description of the track
 * @param options - Optional configuration for track creation
 * @returns The newly created track
 * @throws {ValidationError} If description is empty
 * 
 * @example
 * ```typescript
 * const track = createTrack("Implement user authentication");
 * console.log(track.id); // "auth_20260728"
 * ```
 */
export function createTrack(
  description: string,
  options?: TrackOptions
): Track {
  if (!description.trim()) {
    throw new ValidationError("Description cannot be empty", "description", description);
  }
  // Implementation
}
```

### Inline Comments

```typescript
// Use comments to explain why, not what
// Bad: Comments that repeat the code
let count = 0; // Set count to 0

// Good: Comments that explain reasoning
// Initialize retry count. Max retries defined in config to prevent infinite loops
let retryCount = 0;

// Good: Comment complex logic
// Use worktree instead of branch to allow concurrent work on multiple tracks
// without the need to stash/commit incomplete work
await git.worktree.add(workspacePath, branch);
```

## Testing

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from "bun:test";

describe("TrackManager", () => {
  let manager: TrackManager;
  
  beforeEach(() => {
    manager = new TrackManager({ basePath: "/tmp/test" });
  });
  
  describe("createTrack", () => {
    it("should create a track with valid description", () => {
      const track = manager.createTrack("New feature");
      
      expect(track.id).toBeDefined();
      expect(track.description).toBe("New feature");
      expect(track.status).toBe("new");
    });
    
    it("should throw ValidationError for empty description", () => {
      expect(() => {
        manager.createTrack("");
      }).toThrow(ValidationError);
    });
  });
});
```

## Performance Considerations

```typescript
// Use const for values that won't change
const MAX_TRACKS = 100;

// Destructure only what you need
const { id, status } = track; // Instead of using track.id, track.status repeatedly

// Use early returns to avoid deep nesting
function processTrack(track: Track | null): void {
  if (!track) return;
  if (track.status !== "active") return;
  
  // Process active track
}

// Prefer map/filter/reduce over loops for clarity
const activeIds = tracks
  .filter(t => t.status === "active")
  .map(t => t.id);
```

## Code Organization

### File Structure

```
src/
├── types/           # Type definitions
│   ├── track.ts
│   └── workspace.ts
├── services/        # Business logic
│   ├── track-manager.ts
│   └── workspace-service.ts
├── utils/           # Helper functions
│   ├── git.ts
│   └── file-system.ts
├── validators/      # Validation logic
│   └── track-validator.ts
└── index.ts         # Main entry point
```

### Module Size

- Keep files focused on a single responsibility
- Aim for files under 300 lines
- Split large files into smaller, cohesive modules
- Group related functionality in directories
