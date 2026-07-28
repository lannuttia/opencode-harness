import { describe, expect, test, beforeEach } from "bun:test";
import { activate, deactivate } from "../src/index";
import type { ExtensionContext } from "@opencode-ai/plugin";

describe("OpenCode Harness Plugin", () => {
  let mockContext: ExtensionContext;

  beforeEach(() => {
    // Create a minimal mock context
    mockContext = {
      subscriptions: [],
      extensionPath: "/mock/extension/path",
      globalState: {
        get: () => undefined,
        update: () => Promise.resolve(),
      },
      workspaceState: {
        get: () => undefined,
        update: () => Promise.resolve(),
      },
    } as unknown as ExtensionContext;
  });

  test("Plugin loads successfully", () => {
    // The plugin module should export activate and deactivate functions
    expect(activate).toBeDefined();
    expect(deactivate).toBeDefined();
    expect(typeof activate).toBe("function");
    expect(typeof deactivate).toBe("function");
  });

  test("Plugin activates without errors", async () => {
    // Activation should not throw
    await expect(activate(mockContext)).resolves.toBeUndefined();
  });

  test("Plugin deactivates cleanly", async () => {
    // Activate first
    await activate(mockContext);
    
    // Deactivation should not throw
    await expect(deactivate()).resolves.toBeUndefined();
  });

  test("Activation returns successfully", async () => {
    const result = await activate(mockContext);
    // Activate can return void or undefined
    expect(result).toBeUndefined();
  });
});
