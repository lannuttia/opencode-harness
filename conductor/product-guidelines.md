# Product Guidelines: OpenCode Harness

## Documentation & Communication Style

### Prose Style: Technical & Precise

All documentation, error messages, and user-facing text must prioritize clarity and technical accuracy:

- Use precise technical terminology without ambiguity
- Keep sentences concise and information-dense
- Avoid marketing language, superlatives, and unnecessary embellishment
- Structure content with clear headings, lists, and code examples
- Assume the reader has technical competency with Git and command-line tools
- When explaining concepts, lead with the "what" and "how," then optionally provide the "why"

**Example (Good):**
```
Error: Git worktree creation failed. The target path already exists.
Action: Remove the existing directory or specify a different path.
```

**Example (Avoid):**
```
Oops! We couldn't create your awesome new workspace because something's already there!
```

## Design Philosophy

### Progressive Disclosure

The OpenCode Harness should be simple by default while exposing advanced features when needed:

**Core Principles:**

1. **Simple Default Paths:** Common workflows require minimal input or configuration
2. **Gradual Complexity:** Advanced features are documented and available but not forced on users
3. **Discoverability:** Help text and documentation reveal deeper capabilities progressively
4. **Sensible Defaults:** Opinionated choices that work for 80% of use cases
5. **Escape Hatches:** Power users can override defaults through flags or configuration

**Implementation Guidelines:**

- Default commands should work with zero or minimal arguments
- Advanced options available via `--help` or explicit flags
- Configuration files allow customization without cluttering the CLI
- Interactive mode offers progressive questions, not all upfront
- Documentation structured from basic → intermediate → advanced topics

## Error Handling & User Guidance

### Verbose & Educational

Errors are learning opportunities. Every error message must:

1. **Identify the Problem:** State what went wrong in technical terms
2. **Provide Context:** Explain why the error occurred or what triggered it
3. **Suggest Solutions:** Offer specific, actionable next steps
4. **Reference Documentation:** Link to relevant docs or examples when appropriate

**Error Message Template:**
```
Error: [Specific technical error]
Context: [What operation was being performed]
Cause: [Why this error occurred]
Solution: [Specific steps to resolve]
Reference: [Optional link to docs]
```

**Example:**
```
Error: Unable to initialize conductor track "feature_auth"
Context: Creating new track with Git workspace isolation
Cause: No commits exist in the repository. Git worktrees require at least one commit.
Solution: Create an initial commit before creating tracks:
  git add .
  git commit -m "Initial commit"
Reference: See docs/git-workspace-requirements.md
```

## Command-Line Interface Design

### Hybrid Approach: Interactive by Default, Flags for Automation

The CLI should support both interactive workflows and scriptable automation:

**Interactive Mode (Default):**
- Commands prompt for required information when not provided
- Multi-step processes use progressive prompts
- Defaults are suggested and can be accepted with Enter
- Users receive immediate feedback and confirmation

**Flag-Based Mode (Automation):**
- All interactive prompts can be bypassed with flags
- Non-interactive mode available via `--non-interactive` or `--ci` flag
- Exit codes follow POSIX conventions (0 = success, non-zero = error)
- Output can be formatted as JSON with `--json` flag

**Design Rules:**

1. **Never block in non-interactive mode:** If a required value is missing, fail with a clear error
2. **Consistent flag naming:** Use GNU-style long flags (`--flag-name`) with single-letter shortcuts for common options
3. **Confirmation prompts:** Destructive operations require confirmation in interactive mode, but can be forced with `--force`
4. **Progress indication:** Long-running operations show progress in interactive mode, suppressed with `--quiet`

**Example Commands:**
```bash
# Interactive mode (default)
$ opencode-harness track new
> What is the track description? User authentication system
> Select track type: [feature]/bug
> Creating track: auth_20260728...

# Flag-based mode (automation)
$ opencode-harness track new \
    --description "User authentication system" \
    --type feature \
    --non-interactive
```

## Branding & Terminology

### Consistent Vocabulary

Use these terms consistently throughout the project:

- **Track:** A high-level unit of work (feature, bug fix, enhancement)
- **Workspace:** A Git worktree associated with a specific track
- **Harness:** The overall OpenCode Harness framework
- **Conductor:** The methodology and plugin providing structured workflows
- **Context:** Project documentation, guidelines, and track specifications
- **Phase:** A major section of work within a track's implementation plan

### Naming Conventions

- **Commands:** Verb-noun structure (`track new`, `workspace switch`, `context show`)
- **Flags:** Lowercase with hyphens (`--non-interactive`, `--track-id`)
- **File names:** Lowercase with hyphens or underscores as appropriate (`product-guidelines.md`, `setup_state.json`)
- **Track IDs:** Format `shortname_YYYYMMDD` (e.g., `auth_20260728`)

## User Experience Principles

### 1. Predictability
- Commands behave consistently across all contexts
- Similar operations use similar patterns
- No hidden side effects or surprising behavior

### 2. Fail-Safe Operations
- Destructive operations require explicit confirmation
- State changes are logged and reversible when possible
- Recovery mechanisms for common failure scenarios

### 3. Transparency
- Users can inspect state at any time
- Operations explain what they're doing (in verbose mode)
- Hidden files and directories follow standard conventions

### 4. Efficiency
- Common workflows require minimal keystrokes
- Smart defaults reduce decision fatigue
- Parallel operations when safe to do so

### 5. Self-Documentation
- Help text is comprehensive and includes examples
- Error messages teach users how to fix problems
- Code and configuration files include inline comments

## Quality Standards

### Documentation Requirements

- Every command must have `--help` text with examples
- Complex workflows require dedicated documentation pages
- Breaking changes must be documented in CHANGELOG
- API/plugin interfaces require comprehensive JSDoc or equivalent

### Code Quality

- Follow the code style guides defined in `conductor/code_styleguides/`
- All user-facing features require tests
- Error paths must be tested, not just happy paths
- Performance-critical operations should be benchmarked

### Accessibility

- CLI output must be readable in monochrome terminals
- Color coding should enhance, not replace, textual information
- Screen reader compatibility for documentation sites
- Keyboard-only navigation for interactive prompts
