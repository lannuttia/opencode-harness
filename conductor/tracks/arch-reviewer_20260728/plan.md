# Implementation Plan: Specialized Architecture Reviewer

## Phase 1: Research and Design

### Task 1: Analyze Existing /conductor:review Implementation
- [x] Locate and read the current `/conductor:review` command implementation
- [x] Document the existing review workflow and execution flow
- [x] Identify extension points for integrating architecture reviewer
- [x] Document current report format and structure
- [x] Identify how the existing reviewer is invoked and how results are returned

### Task 2: Design Architecture Reviewer Framework
- [x] Design the specialized reviewer architecture supporting multiple subagents
- [x] Define interfaces for specialized reviewers (Product Alignment, future reviewers)
- [x] Design result aggregation mechanism for unified reporting
- [x] Design severity categorization system (critical, warning, info)
- [x] Create architecture diagram showing integration with existing review command

### Task 3: Design Product Alignment Reviewer Specifications
- [x] Define specific criteria for product alignment review
- [x] Specify which sections of `product.md` to analyze (vision, users, scope, non-goals)
- [x] Design prompt/instructions for Product Alignment Reviewer subagent
- [x] Define expected output format from the subagent
- [x] Identify edge cases and error scenarios

- [x] Task: Conductor - User Manual Verification 'Phase 1: Research and Design' (Protocol in workflow.md)

## Phase 2: Core Framework Implementation

### Task 4: Implement Architecture Reviewer Base Framework
- [x] Write tests for architecture reviewer framework (test initialization, subagent registration, result aggregation)
- [x] Implement base architecture reviewer class/module
- [x] Implement specialized reviewer interface/base class
- [x] Implement result aggregation logic to combine multiple reviewer results
- [x] Implement severity categorization system
- [x] Run tests and verify framework foundation

### Task 5: Implement Context File Loader
- [x] Write tests for context file loading (product.md, tech-stack.md, workflow.md, code style guides)
- [x] Implement context file reader that resolves and loads all required files
- [x] Implement caching mechanism to avoid redundant file reads
- [x] Implement error handling for missing or invalid context files
- [x] Run tests and verify all context files are properly loaded

### Task 6: Implement Unified Report Generator
- [x] Write tests for report generation (format consistency, severity grouping, file references)
- [x] Implement report generator that matches existing `/conductor:review` format
- [x] Implement issue categorization and formatting by severity
- [x] Implement file reference and line number formatting
- [x] Implement actionable recommendation formatting
- [x] Run tests and verify report structure

- [x] Task: Conductor - User Manual Verification 'Phase 2: Core Framework Implementation' (Protocol in workflow.md)

## Phase 3: Product Alignment Reviewer Implementation

### Task 7: Implement Product Alignment Reviewer Subagent
- [x] Write tests for Product Alignment Reviewer (vision alignment, scope validation, user needs matching)
- [x] Implement Product Alignment Reviewer as a specialized reviewer
- [x] Implement analysis logic for product vision alignment
- [x] Implement scope and non-goals validation
- [x] Implement target user needs verification
- [x] Implement core problems validation
- [x] Run tests and verify reviewer identifies misalignments correctly

### Task 8: Implement Subagent Execution Logic
- [x] Write tests for subagent execution (parallel execution, result collection, error handling)
- [x] Implement subagent invocation using OpenCode task/subagent system
- [x] Implement parallel execution of multiple reviewers
- [x] Implement timeout and error handling for subagent failures
- [x] Implement result collection from completed subagents
- [x] Run tests and verify subagents execute correctly

### Task 9: Implement Critical Issue Blocking
- [x] Write tests for blocking logic (critical issues block, warnings don't block)
- [x] Implement severity detection and classification
- [x] Implement review completion blocking when critical issues exist
- [x] Implement user notification for blocking issues
- [x] Implement mechanism to re-run review after fixes
- [x] Run tests and verify blocking behavior

- [~] Task: Conductor - User Manual Verification 'Phase 3: Product Alignment Reviewer Implementation' (Protocol in workflow.md)

## Phase 4: Integration with /conductor:review

### Task 10: Extend /conductor:review Command
- [ ] Write tests for integration (automatic execution, backward compatibility, combined results)
- [ ] Modify `/conductor:review` to invoke architecture reviewer automatically
- [ ] Integrate architecture reviewer results into existing review output
- [ ] Ensure backward compatibility with existing review functionality
- [ ] Implement combined result reporting
- [ ] Run tests and verify integration works correctly

### Task 11: Implement Progress Indicators
- [ ] Write tests for progress display (initialization, subagent execution, aggregation)
- [ ] Implement progress indicator for architecture review execution
- [ ] Implement status messages for each subagent (starting, running, completed)
- [ ] Implement final aggregation status message
- [ ] Run tests and verify progress is displayed correctly

- [ ] Task: Conductor - User Manual Verification 'Phase 4: Integration with /conductor:review' (Protocol in workflow.md)

## Phase 5: Testing and Documentation

### Task 12: End-to-End Testing
- [ ] Create test track with intentional product misalignment
- [ ] Run `/conductor:review` and verify architecture reviewer executes
- [ ] Verify Product Alignment Reviewer identifies misalignments
- [ ] Verify critical issues block review completion
- [ ] Verify warnings do not block completion
- [ ] Verify report format matches existing review format
- [ ] Verify performance meets < 2 minute target

### Task 13: Create Documentation
- [ ] Document architecture reviewer framework design
- [ ] Document how to add new specialized reviewers
- [ ] Document Product Alignment Reviewer criteria and logic
- [ ] Document severity categorization rules
- [ ] Update workflow.md if necessary to reflect new review behavior
- [ ] Create examples of review reports with different issue types

### Task 14: Manual Testing and Validation
- [ ] Test with real track implementations to validate reviewer accuracy
- [ ] Verify architecture reviewer doesn't introduce regressions
- [ ] Test error handling with missing context files
- [ ] Test with various track types (features, bugs, chores)
- [ ] Collect and address any issues discovered during testing

- [ ] Task: Conductor - User Manual Verification 'Phase 5: Testing and Documentation' (Protocol in workflow.md)
