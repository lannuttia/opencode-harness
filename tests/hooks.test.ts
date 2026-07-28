import { describe, test, expect } from "bun:test";
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
    test("commit-msg hook file exists", () => {
      const commitMsgPath = join(huskyDir, "commit-msg");
      expect(existsSync(commitMsgPath)).toBe(true);
    });

    test("commit-msg hook contains commitlint command", () => {
      const commitMsgPath = join(huskyDir, "commit-msg");
      const content = readFileSync(commitMsgPath, "utf-8");
      expect(content).toContain("bunx commitlint --edit");
    });

    test("commit-msg hook is executable", () => {
      const commitMsgPath = join(huskyDir, "commit-msg");
      const stats = require("fs").statSync(commitMsgPath);
      expect(stats.mode & 0o100).toBeGreaterThan(0);
    });

    test("commitlint config file exists", () => {
      const configPath1 = join(projectRoot, "commitlint.config.js");
      const configPath2 = join(projectRoot, ".commitlintrc.json");
      const hasConfig = existsSync(configPath1) || existsSync(configPath2);
      expect(hasConfig).toBe(true);
    });
  });

  describe("Pre-Push Hook", () => {
    test("pre-push hook file exists", () => {
      const prePushPath = join(huskyDir, "pre-push");
      expect(existsSync(prePushPath)).toBe(true);
    });

    test("pre-push hook contains test command", () => {
      const prePushPath = join(huskyDir, "pre-push");
      const content = readFileSync(prePushPath, "utf-8");
      expect(content).toContain("bun test");
    });

    test("pre-push hook is executable", () => {
      const prePushPath = join(huskyDir, "pre-push");
      const stats = require("fs").statSync(prePushPath);
      expect(stats.mode & 0o100).toBeGreaterThan(0);
    });

    test("test command is available", () => {
      // Verify that the test script exists in package.json
      const packageJsonPath = join(projectRoot, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.scripts.test).toBeDefined();
      expect(packageJson.scripts.test).toBe("bun test");
    });
  });
});
