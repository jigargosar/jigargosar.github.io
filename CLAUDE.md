# Project-Level Instructions

## Code Change Protocol

**IMPORTANT:** When working with multi-location updates, warn user and get confirmation before proceeding with:
- Updating related locations
- Adding/removing comments about multi-location patterns
- Updating @README.md documentation

Before completing any code change:
1. Check @README.md for multi-location update patterns related to files being modified
2. When touching a file, look for related locations that need updating (e.g., config + CSS, types + implementation)
3. Verify all locations mentioned in @README.md are updated
4. Update @README.md "Development Notes > Multi-Location Updates":
   - Add new multi-location patterns when discovered
   - Remove patterns that are no longer applicable due to code changes
   - Keep documentation in sync with current codebase