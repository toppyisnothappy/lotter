# Workflow - Lotter

This document defines the development workflow and verification procedures for the Lotter project.

## Testing & Quality
- **TDD Policy**: Flexible. Automated tests are strictly recommended for significant backend logic (e.g., debt interest calculation, transaction processing) but optional for UI-only components.
- **Verification Checkpoints**: Milestone-based. A manual verification sweep is required at the end of each Phase (e.g., Phase 3 completion) before moving to the next.

## Git Standards
- **Commit Strategy**: Conventional Commits. Commits must follow the `type: description` format (e.g., `feat: implement pos search`, `fix: correct organization routing`).
- **Branching**: Task-based tracks. Every feature or fix should be developed in its own track and integrated once milestone verification is complete.

## Task Lifecycle
1. **Red**: Define expectations (optional failing test for backend).
2. **Green**: Implement minimal logic to meet requirements.
3. **Refactor**: Clean up and optimize for performance.
4. **Verify**: Ensure the task meets project standards and milestone criteria.
