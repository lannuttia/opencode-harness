# Specification: Pre-Commit Dead Link Checking

## Overview

Implement a pre-commit Git hook that validates all links in markdown and HTML files before allowing commits. The hook will use the `markdown-link-check` tool to perform comprehensive validation of both local file references and external URLs, blocking commits if any dead links are detected.

## Functional Requirements

### FR1: Link Detection and Scanning
- **FR1.1:** Scan markdown and HTML files in the repository for links
- **FR1.2:** Detect various link formats:
  - Markdown links: `[text](url)` and reference-style `[text][ref]`
  - HTML links: `<a href="url">` and `<img src="url">`
  - Plain URLs in markdown and HTML files

### FR2: Comprehensive Link Validation
- **FR2.1:** Validate local file paths exist relative to repository root
- **FR2.2:** Validate external URLs are reachable (HTTP/HTTPS requests)
- **FR2.3:** Check that URLs respond with successful status codes (200-299 range)
- **FR2.4:** Follow HTTP redirects (up to a reasonable limit, e.g., 5 redirects)
- **FR2.5:** Validate both absolute and relative file paths

### FR3: Pre-Commit Hook Integration
- **FR3.1:** Integrate with existing husky pre-commit hook setup
- **FR3.2:** Run link checking automatically before each commit
- **FR3.3:** Block commits if any dead links are found
- **FR3.4:** Display clear error messages indicating which links failed and why
- **FR3.5:** Show the file path and URL for each dead link

### FR4: Tool Installation and Configuration
- **FR4.1:** Install `markdown-link-check` as a development dependency via npm/bun
- **FR4.2:** Configure `markdown-link-check` with appropriate settings:
  - Timeout values for HTTP requests
  - Redirect following behavior
  - Retry logic for transient failures
  - Excluded URLs or patterns (if needed)
- **FR4.3:** Create a `.markdown-link-check.json` configuration file and `.mlcignore` for exclusions

### FR5: Error Reporting
- **FR5.1:** Output clearly formatted error messages showing:
  - Total number of links checked
  - Number of dead links found
  - Each dead link with file path, URL, and failure reason (e.g., HTTP status code)
- **FR5.2:** Use colored terminal output for better visibility (red for errors, green for success)
- **FR5.3:** Provide actionable error messages (e.g., "404 Not Found" vs "Connection timeout")

## Non-Functional Requirements

### NFR1: Performance
- Link checking should complete within a reasonable time (target <60 seconds for typical commit)
- Use concurrent HTTP requests to speed up external URL validation
- Cache successful URL checks to avoid redundant network requests (built-in to markdown-link-check)

### NFR2: Reliability
- Handle network failures gracefully (distinguish between dead links and temporary network issues)
- Retry failed requests with exponential backoff
- Continue checking all links even if some fail

### NFR3: Maintainability
- Configuration should be version-controlled (`.markdown-link-check.json`, `.mlcignore`)
- Documentation should explain how to bypass the hook in emergencies (`--no-verify`)
- Simple npm/bun-based installation integrated with existing package.json

## Acceptance Criteria

1. **AC1:** Pre-commit hook is automatically triggered before every commit
2. **AC2:** Hook blocks commits when dead links are detected
3. **AC3:** Hook passes and allows commits when all links are valid
4. **AC4:** Error output clearly identifies each dead link with file path and URL
5. **AC5:** Both local file paths and external URLs are validated
6. **AC6:** HTTP redirects are followed correctly
7. **AC7:** markdown-link-check configuration is documented and version-controlled
8. **AC8:** Hook integrates with existing husky setup without breaking other hooks

## Out of Scope

- Checking links in source code files (TypeScript, JavaScript, etc.)
- Checking links in binary files (images, PDFs, etc.)
- Line number reporting for broken links (limitation of markdown-link-check)
- Advanced URL validation (e.g., checking for URL scheme correctness)
- Interactive prompts to fix links during pre-commit
- Automated link fixing or suggestions
- Integration with CI/CD pipelines (focus is local pre-commit hook only)
- Custom link checker implementation (using existing tool: markdown-link-check)
