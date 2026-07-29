# Link Checking Documentation

This project uses [markdown-link-check](https://github.com/tcort/markdown-link-check) to validate all links in markdown and HTML files before commits. The link checker runs automatically as part of the pre-commit hook to ensure documentation remains accurate and free of broken links.

## Overview

The link checker validates:
- **Local file references:** Ensures relative and absolute file paths exist
- **External URLs:** Verifies HTTP/HTTPS links return valid status codes (200-226)
- **Markdown links:** Checks `[text](url)` and reference-style `[text][ref]` links
- **HTML links:** Validates `<a href="url">` and `<img src="url">` in markdown and HTML files

## How It Works

### Pre-Commit Hook

The link checker runs automatically before each commit:

1. Finds all `.md` and `.html` files in the repository (excluding ignored directories)
2. Checks every link in each markdown and HTML file
3. Reports any dead or broken links
4. Blocks the commit if dead links are found

**Example output (success):**
```
Checking links in markdown files...
✓ All links are valid
```

**Example output (failure):**
```
Checking links in markdown files...

  ERROR: 1 dead link found in ./README.md !
  [✖] https://example.com/broken-page → Status: 404

❌ Dead links detected!
Please fix the broken links before committing.
Run 'bunx markdown-link-check --config .markdown-link-check.json <file>' to check individual files.
```

### Configuration

**Location:** `.markdown-link-check.json`

The configuration file controls link checking behavior:

```json
{
  "ignorePatterns": [
    {
      "pattern": "^http://localhost"
    },
    {
      "pattern": "^https://www.npmjs.com/package/"
    }
  ],
  "timeout": "30s",
  "retryOn429": true,
  "retryCount": 3,
  "fallbackRetryDelay": "5s",
  "aliveStatusCodes": [200, 201, 202, 203, 204, 205, 206, 207, 208, 226]
}
```

**Configuration options:**
- **ignorePatterns:** Regex patterns for URLs to skip (e.g., localhost, known blocked sites)
- **timeout:** Maximum time to wait for each HTTP request (default: 30s)
- **retryOn429:** Retry when receiving HTTP 429 (Too Many Requests)
- **retryCount:** Number of retry attempts for failed requests
- **fallbackRetryDelay:** Time to wait between retries
- **aliveStatusCodes:** HTTP status codes considered "alive" (successful)

### Ignored Directories

The following directories are excluded from link checking (defined in `.husky/pre-commit`):

- `node_modules/` - Dependencies
- `.git/` - Git metadata
- `dist/` - Build output
- `build/` - Build artifacts
- `conductor/archive/` - Archived conductor tracks

**Ignore file:** `.mlcignore`

Additional patterns can be added to `.mlcignore`:
```
# Example patterns
*.lock
vendor/
tmp/
```

## Manual Usage

### Check a Single File

```bash
bunx markdown-link-check --config .markdown-link-check.json README.md
```

### Check Multiple Files

```bash
bunx markdown-link-check --config .markdown-link-check.json README.md docs/hooks.md
```

### Check All Markdown and HTML Files

```bash
find . \( -name "*.md" -o -name "*.html" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -exec bunx markdown-link-check --config .markdown-link-check.json {} \;
```

### Verbose Output

```bash
bunx markdown-link-check --verbose --config .markdown-link-check.json README.md
```

### Quiet Mode (Errors Only)

```bash
bunx markdown-link-check --quiet --config .markdown-link-check.json README.md
```

## Common Issues and Solutions

### Issue: Pre-commit hook not executing

**Problem:** Hook doesn't run or shows permission denied.

**Solution:** Ensure the hook is executable:
```bash
chmod +x .husky/pre-commit
```

If the issue persists, verify husky is properly installed:
```bash
bun install
```

### Issue: Link is valid but marked as dead

**Problem:** A link works in the browser but fails in the automated check.

**Common causes:**
- **Bot protection:** Site uses Cloudflare or similar (returns 403)
- **User-agent filtering:** Site blocks automated requests
- **Rate limiting:** Too many requests too quickly (429)
- **Geo-blocking:** Site blocks certain regions

**Solutions:**
1. Add the URL pattern to `ignorePatterns` in `.markdown-link-check.json`
2. Manually verify the link works in a browser
3. Document the exception in this file

**Example:**
```json
{
  "ignorePatterns": [
    {
      "pattern": "^https://blocked-site.com/"
    }
  ]
}
```

### Issue: Timeout errors on slow networks

**Problem:** Links fail with timeout errors on slow connections.

**Solution:** Increase the timeout value:
```json
{
  "timeout": "60s"
}
```

### Issue: Too many false positives

**Problem:** Many valid links fail due to rate limiting or temporary issues.

**Solutions:**
1. Increase retry count: `"retryCount": 5`
2. Increase retry delay: `"fallbackRetryDelay": "10s"`
3. Enable retry on 429: `"retryOn429": true`

### Issue: Local file links fail

**Problem:** Relative file paths are reported as broken.

**Causes:**
- Incorrect relative path (e.g., `./file.md` vs `../file.md`)
- File doesn't exist in the repository
- Case sensitivity issues (Linux is case-sensitive)

**Solutions:**
1. Verify the file exists: `ls -la path/to/file.md`
2. Check relative path from the linking file's directory
3. Ensure correct case matches actual filename

### Issue: Link checker is too slow

**Problem:** Pre-commit hook takes >60 seconds to complete.

**Causes:**
- Many external URLs to check
- Slow network connection
- Sites with slow response times

**Solutions:**
1. Reduce timeout: `"timeout": "20s"`
2. Add slow sites to ignore patterns
3. Cache results (markdown-link-check does this automatically)
4. Consider checking only staged files (requires custom script)

## Bypassing the Hook

**Emergency use only:** If you need to commit despite dead links:

```bash
git commit --no-verify -m "docs: update with temporary broken links"
```

**⚠️ WARNING:** Only use `--no-verify` when:
- You're committing work-in-progress documentation
- Links are temporarily unavailable but will be fixed soon
- You've documented why the links are failing in the commit message

**DO NOT** use `--no-verify` to:
- Commit documentation with genuinely broken links
- Avoid fixing dead links
- Rush commits without proper validation

Always create a follow-up issue or task to fix the broken links.

## Integration with CI/CD

The link checker can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Check markdown and HTML links
  run: |
    find . \( -name "*.md" -o -name "*.html" \) \
      -not -path "*/node_modules/*" \
      -not -path "*/.git/*" \
      -exec bunx markdown-link-check --config .markdown-link-check.json {} \;
```

## Performance Expectations

Based on the specification requirements:

- **Small repositories (<50 markdown files):** <10 seconds
- **Medium repositories (50-200 markdown files):** <30 seconds
- **Large repositories (>200 markdown files):** <60 seconds

Performance depends on:
- Number of markdown files
- Number of external links
- Network speed and latency
- Link response times

## Known Limitations

1. **No line numbers in error output:** Unlike some tools (e.g., lychee), markdown-link-check does not report the specific line number where a broken link appears, only the file path and URL. Developers must manually search files to locate broken links.
2. **Limited file type support:** Primarily designed for markdown files. HTML support exists but does not extend to source code comments or other file types.
3. **No anchor validation:** Internal anchors (#section) are not validated
4. **Bot protection:** Some sites block automated tools (Cloudflare, etc.)
5. **Rate limiting:** Checking many links to the same site may trigger rate limits
6. **No JavaScript links:** Dynamic links generated by JavaScript are not detected

## Further Reading

- [markdown-link-check on GitHub](https://github.com/tcort/markdown-link-check)
- markdown-link-check on npm (Note: npmjs.com links ignored due to Cloudflare protection)
- [Pre-Commit Hooks Documentation](./hooks.md)
- [Conductor Workflow](../conductor/workflow.md)
