# Track Specification: harness_20260728

## Overview

Implement the initial OpenCode Harness plugin under the package name `@lannuttia/opencode-harness`. This plugin serves as a thin, opinionated wrapper around two existing OpenCode plugins: `opencode-workspace` and `opencode-conductor-plugin`.

## Objectives

1. Create a minimal, functional OpenCode plugin that wraps existing plugins
2. Establish the plugin package structure following OpenCode plugin conventions
3. Register and expose the wrapped plugins through the harness interface
4. Ensure the harness can be installed and activated in OpenCode environments

## Requirements

### Functional Requirements

1. **Plugin Package Structure**
   - Package name: `@lannuttia/opencode-harness`
   - Valid OpenCode plugin manifest
   - Proper TypeScript configuration
   - Entry point that initializes the harness

2. **Plugin Wrapping**
   - Import and initialize `opencode-workspace` plugin
   - Import and initialize `opencode-conductor-plugin` plugin
   - Pass through all functionality from wrapped plugins without modification
   - Maintain all existing APIs and commands from wrapped plugins

3. **Plugin Registration**
   - Register as an OpenCode plugin via `@opencode-ai/plugin` SDK
   - Expose wrapped plugins through the plugin lifecycle hooks
   - Ensure proper plugin activation and deactivation

### Non-Functional Requirements

1. **Simplicity**
   - No custom logic beyond wrapping the two plugins
   - No additional features, commands, or functionality
   - Minimal configuration required

2. **Type Safety**
   - Full TypeScript type coverage
   - Strict mode enabled
   - No `any` types in public APIs

3. **Documentation**
   - README with installation instructions
   - Clear indication that this is a wrapper plugin
   - Documentation of wrapped plugins and their capabilities

4. **Testing**
   - Basic smoke tests to verify plugin loads
   - Tests to confirm wrapped plugins are accessible
   - Coverage: >80% for harness code (not wrapped plugins)

## Out of Scope

- Custom commands or functionality
- Modifications to wrapped plugin behavior
- Additional plugin dependencies beyond the two specified
- CLI tools or standalone executables
- Configuration files beyond what's required for the plugin to function

## Success Criteria

1. **Installation**: Plugin can be installed in an OpenCode environment via package.json
2. **Activation**: Plugin activates successfully when OpenCode loads
3. **Functionality**: All commands from `opencode-workspace` and `opencode-conductor-plugin` are available through the harness
4. **Type Safety**: All TypeScript compilation passes with strict mode
5. **Tests**: All tests pass with >80% code coverage

## Technical Approach

### Package Structure

```
@lannuttia/opencode-harness/
├── src/
│   ├── index.ts           # Main plugin entry point
│   ├── plugin.ts          # Plugin initialization logic
│   └── types.ts           # Type definitions
├── tests/
│   └── plugin.test.ts     # Basic plugin tests
├── package.json           # Package manifest with dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # Documentation
```

### Dependencies

**Production:**
- `@opencode-ai/plugin` (v1.18.9) - Already installed
- `opencode-workspace` - Git workspace management
- `opencode-conductor-plugin` - Conductor methodology

**Development:**
- `typescript` - Language compiler
- `@types/node` - Node.js types
- Testing framework (to be determined during implementation)

### Plugin Implementation Pattern

The harness plugin will:

1. Import both wrapped plugins
2. Initialize them during plugin activation
3. Forward all plugin lifecycle events to wrapped plugins
4. Expose wrapped plugin APIs through the harness interface

### Integration Points

- **OpenCode Plugin System**: Use `@opencode-ai/plugin` SDK for registration
- **Wrapped Plugins**: Import and initialize both plugins
- **TypeScript**: Compile to JavaScript for runtime execution
- **Bun**: Use as package manager and runtime

## Constraints

1. **No Custom Logic**: The harness must not implement custom features
2. **Pass-Through Only**: All functionality comes from wrapped plugins
3. **Minimal Configuration**: Plugin should work with zero or minimal configuration
4. **Version Compatibility**: Must work with OpenCode plugin system v1.18.9

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Wrapped plugin API changes | High | Pin specific versions in package.json |
| Plugin initialization order issues | Medium | Test plugin activation thoroughly |
| Type compatibility between plugins | Low | Use careful type mapping and assertions |
| OpenCode plugin system changes | High | Follow official plugin SDK patterns |

## Acceptance Criteria

- [ ] Package `@lannuttia/opencode-harness` is created with proper structure
- [ ] Both `opencode-workspace` and `opencode-conductor-plugin` are listed as dependencies
- [ ] Plugin initializes successfully in OpenCode
- [ ] All commands from wrapped plugins are accessible
- [ ] TypeScript compilation succeeds with strict mode
- [ ] Tests pass with >80% coverage
- [ ] README documents installation and usage
- [ ] No custom functionality is implemented (wrapper only)

## Future Enhancements (Not in This Track)

- Custom commands building on wrapped plugin functionality
- Enhanced error handling and logging
- Configuration file support
- CLI tool integration
- Additional plugin wrappers
