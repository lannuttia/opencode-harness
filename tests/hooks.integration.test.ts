import { describe, test, expect } from "bun:test";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

describe("Git Hooks Integration", () => {
  const projectRoot = join(import.meta.dir, "..");
  const huskyDir = join(projectRoot, ".husky");

  describe("Full workflow validation", () => {
    test("all required hook files exist", () => {
      const requiredHooks = ["pre-commit", "commit-msg", "pre-push"];
      
      requiredHooks.forEach((hook) => {
        const hookPath = join(huskyDir, hook);
        expect(existsSync(hookPath)).toBe(true);
      });
    });

    test("all hooks are executable", () => {
      const requiredHooks = ["pre-commit", "commit-msg", "pre-push"];
      
      requiredHooks.forEach((hook) => {
        const hookPath = join(huskyDir, hook);
        const stats = require("fs").statSync(hookPath);
        expect(stats.mode & 0o100).toBeGreaterThan(0);
      });
    });

    test("hooks contain expected commands", () => {
      const hookCommands = {
        "pre-commit": "bunx tsc --noEmit",
        "commit-msg": "bunx commitlint --edit",
        "pre-push": "bun test",
      };

      Object.entries(hookCommands).forEach(([hook, command]) => {
        const hookPath = join(huskyDir, hook);
        const content = readFileSync(hookPath, "utf-8");
        expect(content).toContain(command);
      });
    });

    test("all hooks have error messages", () => {
      const requiredHooks = ["pre-commit", "commit-msg", "pre-push"];
      
      requiredHooks.forEach((hook) => {
        const hookPath = join(huskyDir, hook);
        const content = readFileSync(hookPath, "utf-8");
        // Each hook should have user-friendly error messages
        expect(content).toContain("❌");
        expect(content).toContain("echo");
      });
    });

    test("all hooks have success messages", () => {
      const requiredHooks = ["pre-commit", "commit-msg", "pre-push"];
      
      requiredHooks.forEach((hook) => {
        const hookPath = join(huskyDir, hook);
        const content = readFileSync(hookPath, "utf-8");
        // Each hook should have success feedback
        expect(content).toContain("✓");
      });
    });
  });

  describe("Configuration validation", () => {
    test("commitlint configuration exists", () => {
      const configPath = join(projectRoot, "commitlint.config.js");
      expect(existsSync(configPath)).toBe(true);
    });

    test("commitlint configuration extends conventional", () => {
      const configPath = join(projectRoot, "commitlint.config.js");
      const content = readFileSync(configPath, "utf-8");
      expect(content).toContain("@commitlint/config-conventional");
    });

    test("commitlint configuration includes conductor type", () => {
      const configPath = join(projectRoot, "commitlint.config.js");
      const content = readFileSync(configPath, "utf-8");
      expect(content).toContain("conductor");
    });

    test("package.json has prepare script", () => {
      const packageJsonPath = join(projectRoot, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.scripts.prepare).toBeDefined();
      expect(packageJson.scripts.prepare).toBe("husky");
    });

    test("required dependencies are installed", () => {
      const packageJsonPath = join(projectRoot, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      
      expect(packageJson.devDependencies.husky).toBeDefined();
      expect(packageJson.devDependencies["@commitlint/cli"]).toBeDefined();
      expect(packageJson.devDependencies["@commitlint/config-conventional"]).toBeDefined();
    });
  });

  describe("Bun runtime compatibility", () => {
    test("hooks use bunx for TypeScript", () => {
      const preCommitPath = join(huskyDir, "pre-commit");
      const content = readFileSync(preCommitPath, "utf-8");
      expect(content).toContain("bunx tsc");
    });

    test("hooks use bunx for commitlint", () => {
      const commitMsgPath = join(huskyDir, "commit-msg");
      const content = readFileSync(commitMsgPath, "utf-8");
      expect(content).toContain("bunx commitlint");
    });

    test("hooks use bun for tests", () => {
      const prePushPath = join(huskyDir, "pre-push");
      const content = readFileSync(prePushPath, "utf-8");
      expect(content).toContain("bun test");
    });
  });

  describe("Documentation", () => {
    test("hooks.md documentation exists", () => {
      const hooksDocPath = join(projectRoot, "docs", "hooks.md");
      expect(existsSync(hooksDocPath)).toBe(true);
    });

    test("hooks.md documents all hooks", () => {
      const hooksDocPath = join(projectRoot, "docs", "hooks.md");
      const content = readFileSync(hooksDocPath, "utf-8");
      
      expect(content).toContain("pre-commit");
      expect(content).toContain("commit-msg");
      expect(content).toContain("pre-push");
    });

    test("hooks.md includes bypass instructions", () => {
      const hooksDocPath = join(projectRoot, "docs", "hooks.md");
      const content = readFileSync(hooksDocPath, "utf-8");
      
      expect(content).toContain("--no-verify");
    });

    test("hooks.md includes troubleshooting section", () => {
      const hooksDocPath = join(projectRoot, "docs", "hooks.md");
      const content = readFileSync(hooksDocPath, "utf-8");
      
      expect(content).toContain("Troubleshooting");
    });
  });
});
