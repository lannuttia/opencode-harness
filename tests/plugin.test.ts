import { describe, expect, test } from "bun:test";
import HarnessPlugin from "../src/index";
import type { PluginInput } from "@opencode-ai/plugin";

describe("OpenCode Harness Plugin", () => {
  test("Plugin is defined and is a function", () => {
    expect(HarnessPlugin).toBeDefined();
    expect(typeof HarnessPlugin).toBe("function");
  });

  test("Plugin loads successfully", async () => {
    // Create a minimal mock input
    const mockInput = {
      client: {} as Record<string, unknown>,
      project: {} as Record<string, unknown>,
      directory: "/mock/directory",
      worktree: "/mock/worktree",
      experimental_workspace: {
        register: () => {},
      },
      serverUrl: new URL("http://localhost:3000"),
      $: {} as Record<string, unknown>,
    } as PluginInput;

    // Plugin should be callable and return a Promise
    const result = HarnessPlugin(mockInput);
    expect(result).toBeInstanceOf(Promise);
  });

  test("Plugin returns Hooks object", async () => {
    const mockInput = {
      client: {} as Record<string, unknown>,
      project: {} as Record<string, unknown>,
      directory: "/mock/directory",
      worktree: "/mock/worktree",
      experimental_workspace: {
        register: () => {},
      },
      serverUrl: new URL("http://localhost:3000"),
      $: {} as Record<string, unknown>,
    } as PluginInput;

    const hooks = await HarnessPlugin(mockInput);
    
    // Hooks should be an object
    expect(hooks).toBeDefined();
    expect(typeof hooks).toBe("object");
  });
});
