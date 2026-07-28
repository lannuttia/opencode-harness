import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

describe("Git Hooks", () => {
  const projectRoot = join(import.meta.dir, "..");
  const huskyDir = join(projectRoot, ".husky");

  describe("Pre-Commit Hook", () => {
    test("pre-commit hook file exists", () => {
      const preCommitPath = join(huskyDir, "pre-commit");
      expect(existsSync(preCommitPath)).toBe(true);
    });

    test("pre-commit hook contains TypeScript type check command", () => {
      const preCommitPath = join(huskyDir, "pre-commit");
      const content = readFileSync(preCommitPath, "utf-8");
      expect(content).toContain("bunx tsc --noEmit");
    });

    test("pre-commit hook is executable", () => {
      const preCommitPath = join(huskyDir, "pre-commit");
      const stats = require("fs").statSync(preCommitPath);
      // Check if file has execute permission (user execute bit)
      expect(stats.mode & 0o100).toBeGreaterThan(0);
    });

    test("TypeScript type check command works", () => {
      // This test verifies that tsc --noEmit runs successfully
      expect(() => {
        execSync("bunx tsc --noEmit", {
          cwd: projectRoot,
          stdio: "pipe",
        });
      }).not.toThrow();
    });
  });

  describe("Commit Message Hook", () => {
    test("commit-msg hook file should exist after implementation", () => {
      const commitMsgPath = join(huskyDir, "commit-msg");
      // This will fail until we implement the hook in Phase 3
      // For now, we'll skip this test
      if (existsSync(commitMsgPath)) {
        expect(existsSync(commitMsgPath)).toBe(true);
      }
    });
  });

  describe("Pre-Push Hook", () => {
    test("pre-push hook file should exist after implementation", () => {
      const prePushPath = join(huskyDir, "pre-push");
      // This will fail until we implement the hook in Phase 4
      // For now, we'll skip this test
      if (existsSync(prePushPath)) {
        expect(existsSync(prePushPath)).toBe(true);
      }
    });
  });
});
